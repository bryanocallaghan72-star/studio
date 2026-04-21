
/**
 * @fileOverview Google Places Venue Enrichment Script
 * Fetches real photos, opening hours, price levels, and ratings from Google Places API
 * and updates the Firestore 'venues' collection.
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!GOOGLE_MAPS_API_KEY) {
  console.error('✗ Error: GOOGLE_MAPS_API_KEY environment variable is required in .env');
  process.exit(1);
}

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  admin.initializeApp({
    projectId: PROJECT_ID,
  });
}

const db = admin.firestore();

interface VenueDoc {
  id: string;
  name: string;
  slug: string;
  [key: string]: any;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchPlaceData(venueName: string) {
  // Step 1: Text Search to get place_id
  const searchQuery = encodeURIComponent(`${venueName} Bondi Beach`);
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=${GOOGLE_MAPS_API_KEY}`;
  
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();

  if (!searchData.results || searchData.results.length === 0) {
    return null;
  }

  const placeId = searchData.results[0].place_id;

  // Step 2: Place Details for rich metadata
  const fields = 'place_id,photos,opening_hours,price_level,rating,user_ratings_total,formatted_phone_number,website';
  const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_MAPS_API_KEY}`;
  
  detailsRes = await fetch(detailsUrl);
  const detailsData = await detailsRes.json();

  return detailsData.result;
}

function resolvePhotoUrls(photos: any[]) {
  if (!photos || !Array.isArray(photos)) return [];
  
  return photos.slice(0, 3).map(p => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${p.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`;
  });
}

async function main() {
  console.log('🚀 Starting Google Places enrichment...');
  console.log(`Project: ${PROJECT_ID} | API Key: ${GOOGLE_MAPS_API_KEY.substring(0, 8)}...`);

  const venuesRef = db.collection('venues');
  const snapshot = await venuesRef.get();

  console.log(`Found ${snapshot.size} venues to process.`);

  let successCount = 0;
  let failCount = 0;

  for (const doc of snapshot.docs) {
    const venue = doc.data() as VenueDoc;
    
    try {
      const place = await fetchPlaceData(venue.name);

      if (!place) {
        console.log(`⚠️ Not found: ${venue.name}`);
        failCount++;
        continue;
      }

      const updateData = {
        photos: resolvePhotoUrls(place.photos),
        openingHours: {
          periods: place.opening_hours?.periods || [],
          weekdayText: place.opening_hours?.weekday_text || []
        },
        priceLevel: place.price_level ?? null,
        rating: place.rating ?? null,
        totalRatings: place.user_ratings_total ?? null,
        phone: place.formatted_phone_number ?? null,
        website: place.website ?? null,
        placeId: place.place_id,
        enrichedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await doc.ref.update(updateData);
      console.log(`✅ Enriched: ${venue.name}`);
      successCount++;

      // Small delay to be polite to the API
      await sleep(200);
    } catch (error: any) {
      console.error(`✗ Failed: ${venue.name} -> ${error.message}`);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(30));
  console.log(`Enrichment complete: ${successCount} succeeded, ${failCount} failed.`);
  console.log('='.repeat(30));
}

main().catch((err) => {
  console.error('CRITICAL ERROR:', err);
  process.exit(1);
});
