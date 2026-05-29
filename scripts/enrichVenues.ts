
/**
 * @fileOverview Google Places Venue Enrichment Script
 * This script must not persist Google Places volatile fields permanently. 
 * It may only update googleCache with timestamped, refreshable reference data.
 * 
 * NOTE: Google ratings and other restricted fields are excluded/deleted 
 * to maintain compliance with Google Maps Platform Terms of Service.
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-8946896495-11b4f';

if (!GOOGLE_MAPS_API_KEY) {
  console.error('❌ GOOGLE_MAPS_API_KEY is not set in .env');
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

async function fetchPlaceData(venueName: string, showDebug: boolean = false) {
  // Step 1: Text Search to get place_id with location bias (Bondi Beach)
  const encodedName = encodeURIComponent(venueName);
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedName}&location=-33.8908,151.2743&radius=3000&key=${GOOGLE_MAPS_API_KEY}`;
  
  if (showDebug) {
    console.log(`[DEBUG] First Search URL: ${searchUrl}`);
  }
  
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();

  if (!searchData.results || searchData.results.length === 0) {
    return null;
  }

  const placeId = searchData.results[0].place_id;

  // Step 2: Place Details for rich metadata (Excluding ratings)
  const fields = 'place_id,photos,opening_hours,price_level,formatted_phone_number,website,business_status,formatted_address,geometry,name';
  const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_MAPS_API_KEY}`;
  
  const detailsRes = await fetch(detailsUrl);
  const detailsData = await detailsRes.json();

  return detailsData.result;
}

async function main() {
  console.log('🚀 Starting Google Places enrichment (P1 Compliance Edition)...');
  console.log(`Project: ${PROJECT_ID} | API Key: ${GOOGLE_MAPS_API_KEY!.substring(0, 8)}...`);

  const venuesRef = db.collection('venues');
  const snapshot = await venuesRef.get();

  console.log(`Found ${snapshot.size} venues to process.`);

  let successCount = 0;
  let failCount = 0;
  let processed = 0;

  for (const doc of snapshot.docs) {
    const venue = doc.data() as VenueDoc;
    
    try {
      const place = await fetchPlaceData(venue.name, processed === 0);
      processed++;

      if (!place) {
        console.log(`⚠️ Not found: ${venue.name}`);
        failCount++;
        continue;
      }

      const now = new Date();
      const refreshedAt = admin.firestore.Timestamp.fromDate(now);
      const expiresAt = admin.firestore.Timestamp.fromDate(new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));

      const updateData = {
        // Essential reference
        placeId: place.place_id,
        
        // iykyk editorial status
        iykykScore: 0,
        enrichedAt: admin.firestore.FieldValue.serverTimestamp(),

        // Safe Google Cache Layer (Refreshed Reference Data)
        googleCache: {
            displayName: place.name || venue.name,
            formattedAddress: place.formatted_address || venue.address || null,
            location: {
                lat: place.geometry?.location?.lat || venue.latitude || null,
                lng: place.geometry?.location?.lng || venue.longitude || null,
            },
            phone: place.formatted_phone_number || null,
            website: place.website || null,
            refreshedAt,
            expiresAt,
            attributionRequired: true
        },

        // STOP PERSISTING VOLATILE FIELDS PERMANENTLY (P1 Compliance)
        // These fields are deleted from the top-level or restricted entirely.
        openingHours: admin.firestore.FieldValue.delete(),
        photos: admin.firestore.FieldValue.delete(),
        priceLevel: admin.firestore.FieldValue.delete(),
        businessStatus: admin.firestore.FieldValue.delete(),
        rating: admin.firestore.FieldValue.delete(),
        totalRatings: admin.firestore.FieldValue.delete(),

        // Temporary backward compatibility
        phone: place.formatted_phone_number ?? null,
        website: place.website ?? null,
      };

      await doc.ref.update(updateData);
      console.log(`✅ Enriched & Compliant: ${venue.name} | Cache expiry: 30 days`);
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
