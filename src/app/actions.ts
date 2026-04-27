"use server";

import { generateItinerary as generateItineraryFlow } from "@/ai/flows/generate-itinerary-flow";
import { Itinerary, ItineraryRequest, ItineraryRequestSchema } from "@/ai/schemas";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseConfig } from "@/firebase/config";
import { isVenueOpen } from "@/lib/venue-status";

export async function generateItinerary(request: ItineraryRequest): Promise<{ success?: Itinerary, error?: { title: string, message: string } }> {
  // Fetch current Bondi weather
  let weatherContext: string | undefined = undefined;
  try {
    const weatherRes = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=-33.8908&longitude=151.2743&current=temperature_2m,weathercode&timezone=Australia/Sydney'
    );
    const weatherData = await weatherRes.json();
    const temp = Math.round(weatherData.current?.temperature_2m ?? 22);
    const code = weatherData.current?.weathercode ?? 0;
    const condition = code === 0 ? 'sunny' : code <= 3 ? 'partly cloudy' : code <= 67 ? 'rainy' : 'cloudy';
    weatherContext = `${temp}°C and ${condition}`;
  } catch (err) {
    console.warn("SERVER ACTION: Weather fetch failed:", err);
  }

  // 1. Fetch real venues from Firestore and filter them
  let venuePool: string[] = [];
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const db = getFirestore(app);
    
    const querySnapshot = await getDocs(collection(db, "venues"));
    if (!querySnapshot.empty) {
        const allVenues = querySnapshot.docs.map(doc => doc.data());
        
        // Filter to open venues using central utility
        const openVenues = allVenues.filter(v => isVenueOpen(v));

        // Occasion-based category filtering
        const vibe = (request.vibe || "").toLowerCase();
        let targetCategories: string[] = [];
        
        if (vibe.includes('date') || vibe.includes('tinder')) {
          targetCategories = ['Restaurants', 'Cocktails', 'Vibes'];
        } else if (vibe.includes('girls')) {
          targetCategories = ['Cocktails', 'Nightlife', 'Vibes'];
        } else if (vibe.includes('wellness') || vibe.includes('yoga') || vibe.includes('pilates')) {
          targetCategories = ['Health & Fitness', 'Brunch'];
        } else if (vibe.includes('lunch') || vibe.includes('quick')) {
          targetCategories = ['Brunch', 'Restaurants', 'Sushi', 'Food'];
        }

        let filteredVenues = openVenues;
        if (targetCategories.length > 0) {
          filteredVenues = openVenues.filter((v: any) => {
            const cat = v.category || v.details?.category;
            return targetCategories.includes(cat);
          });
        }

        // Ensure we have a decent pool, fallback if filtering was too restrictive
        if (filteredVenues.length < 5) filteredVenues = openVenues;

        // Pick top 15 candidates
        venuePool = filteredVenues
          .sort(() => 0.5 - Math.random())
          .slice(0, 15)
          .map((v: any) => v.name)
          .filter(name => !!name);
    }
  } catch (err) {
    console.error('SERVER ACTION: Failsafe pool construction:', err);
  }

  const validatedRequest = ItineraryRequestSchema.safeParse({
    ...request,
    venuePool: venuePool.length > 0 ? venuePool : undefined,
    weatherContext
  });
  
  if (!validatedRequest.success) {
    console.error('Invalid itinerary request:', validatedRequest.error);
    return { error: { title: 'Invalid Request', message: 'The request to generate an itinerary was malformed.' } };
  }

  if (!request.vibe || request.vibe.length < 3) {
     return { error: { title: 'Vibe is too short', message: 'Please describe the mood for your day in a bit more detail.' } };
  }
  
  try {
    const result = await generateItineraryFlow(validatedRequest.data);
    return { success: result };
  } catch (error: any) {
    console.error('CRITICAL: Itinerary generation failed:', error);
    
    let userMessage = "Something went wrong. Try shuffling again.";
    const rawError = String(error?.message || error || "");

    if (rawError.includes("API_KEY") || rawError.includes("apiKey") || rawError.includes("auth")) {
      userMessage = "AI service not configured. Try again later.";
    } else if (rawError.includes("timeout") || rawError.includes("deadline") || rawError.includes("ETIMEDOUT")) {
      userMessage = "Request took too long. Try shuffling again.";
    } else if (rawError.includes("validation") || rawError.includes("schema") || rawError.includes("ZodError")) {
      userMessage = "Couldn't build your itinerary. Try again.";
    }
    
    return { 
      error: { 
        title: 'Generation Failed', 
        message: userMessage 
      } 
    };
  }
}
