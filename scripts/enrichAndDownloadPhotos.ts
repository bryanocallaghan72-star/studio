
/**
 * @fileOverview Atomic Venue Enrichment and Photo Migration Script.
 * Fetches fresh photo references from Google Places and immediately 
 * migrates them to Firebase Storage to avoid expiration issues.
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const PROJECT_ID = 'studio-8946896495-11b4f';
const STORAGE_BUCKET = 'studio-8946896495-11b4f.firebasestorage.app';

if (!GOOGLE_MAPS_API_KEY) {
  console.error('❌ GOOGLE_MAPS_API_KEY is not set in .env');
  process.exit(1);
}

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  admin.initializeApp({
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Downloads a photo from Google and uploads to Firebase Storage.
 */
async function migratePhoto(venueId: string, photoRef: string, index: number): Promise<string | null> {
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${GOOGLE_MAPS_API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Photo API returned ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const destPath = `venue_images/${venueId}/${index}.jpg`;
    const file = bucket.file(destPath);

    await file.save(buffer, {
      metadata: {
        contentType: 'image/jpeg',
        cacheControl: 'public, max-age=31536000',
      },
      public: true,
    });

    return `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(destPath)}?alt=media`;
  } catch (error: any) {
    console.error(`      ❌ Photo ${index} fail: ${error.message}`);
    return null;
  }
}

/**
 * Fetches fresh place details and photo references.
 */
async function getFreshPlaceData(venueName: string) {
  const query = encodeURIComponent(`${venueName} Bondi Beach`);
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=-33.8908,151.2743&radius=3000&key=${GOOGLE_MAPS_API_KEY}`;

  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();

  if (!searchData.results || searchData.results.length === 0) return null;
  const placeId = searchData.results[0].place_id;

  const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_MAPS_API_KEY}`;
  const detailsRes = await fetch(detailsUrl);
  const detailsData = await detailsRes.json();

  return detailsData.result;
}

async function main() {
  console.log('🚀 Starting Atomic Photo Migration...');
  console.log(`Bucket: ${STORAGE_BUCKET}`);

  const venuesRef = db.collection('venues');
  const snapshot = await venuesRef.get();

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const doc of snapshot.docs) {
    const venue = doc.data();
    const photos = venue.photos || [];

    // Check if already migrated
    if (photos[0] && photos[0].startsWith('https://firebasestorage')) {
      console.log(`⏭️  ${venue.name} — already migrated`);
      skipped++;
      continue;
    }

    console.log(`📦 Processing: ${venue.name}...`);

    try {
      // 1. Get fresh data
      const place = await getFreshPlaceData(venue.name);
      const photoRefs = place?.photos?.slice(0, 3).map((p: any) => p.photo_reference) || [];

      if (photoRefs.length === 0) {
        console.log(`  ⚠️  No photos found for ${venue.name}`);
        failed++;
        continue;
      }

      // 2. Immediate download and upload
      const newUrls: string[] = [];
      for (let i = 0; i < photoRefs.length; i++) {
        const storageUrl = await migratePhoto(doc.id, photoRefs[i], i);
        if (storageUrl) newUrls.push(storageUrl);
      }

      // 3. Update Firestore
      if (newUrls.length > 0) {
        await doc.ref.update({
          photos: newUrls,
          migratedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`  ✅ ${venue.name} — ${newUrls.length} photos saved to Storage`);
        success++;
      } else {
        throw new Error('No photos could be uploaded');
      }

      // Rate limit safety
      await sleep(200);
    } catch (error: any) {
      console.error(`  ⚠️  ${venue.name} — failed: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(40));
  console.log('Migration Complete');
  console.log(`✅ Success: ${success}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`⚠️  Failed:  ${failed}`);
  console.log('='.repeat(40));
}

main().catch(err => {
  console.error('FATAL ERROR:', err);
  process.exit(1);
});
