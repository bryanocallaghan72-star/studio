
/**
 * @fileOverview Venue Photo Migration Script
 * Downloads Google Places photo references (AU_ZVE...) and uploads them 
 * to Firebase Storage. Updates Firestore venue docs with permanent URLs.
 * 
 * Bypasses the need for proxies and ensures long-term image persistence.
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PROJECT_ID = 'studio-8946896495-11b4f';
const STORAGE_BUCKET = 'studio-8946896495-11b4f.firebasestorage.app';

if (!GOOGLE_PLACES_API_KEY) {
  console.error('❌ GOOGLE_PLACES_API_KEY is not set in .env');
  process.exit(1);
}

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  admin.initializeApp({
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

/**
 * Downloads a photo from Google and uploads it to Firebase Storage.
 */
async function migratePhoto(venueId: string, photoRef: string, index: number): Promise<string | null> {
  const url = `https://places.googleapis.com/v1/${photoRef}/media?maxWidthPx=800&key=${GOOGLE_PLACES_API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google API returned ${response.status}: ${response.statusText}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const destPath = `venue_images/${venueId}/${index}.jpg`;
    const file = bucket.file(destPath);

    // Upload to Firebase Storage
    await file.save(buffer, {
      metadata: {
        contentType: 'image/jpeg',
        cacheControl: 'public, max-age=31536000',
      },
      public: true, // Make the file publicly accessible
    });

    // Construct the public download URL
    // Standard Firebase Storage download URL format
    return `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(destPath)}?alt=media`;

  } catch (error: any) {
    console.error(`    ❌ Failed to migrate photo ${index} for ${venueId}: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting Venue Photo Migration to Firebase Storage...');
  console.log(`Project: ${PROJECT_ID} | Bucket: ${STORAGE_BUCKET}`);

  const venuesRef = db.collection('venues');
  const snapshot = await venuesRef.get();

  if (snapshot.empty) {
    console.log('No venues found in the collection.');
    return;
  }

  console.log(`Found ${snapshot.size} venues to check.`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const doc of snapshot.docs) {
    const venue = doc.data();
    const photos = venue.photos || [];
    
    // Safety check: is the first photo a Google reference?
    const firstPhoto = photos[0];
    
    if (!firstPhoto) {
      console.log(`⏭️  Skipping: ${venue.name || doc.id} (No photos found)`);
      skipCount++;
      continue;
    }

    if (firstPhoto.startsWith('https://')) {
      console.log(`⏭️  Skipping: ${venue.name || doc.id} (Already has URLs)`);
      skipCount++;
      continue;
    }

    if (!firstPhoto.startsWith('AU_')) {
      console.log(`⏭️  Skipping: ${venue.name || doc.id} (Unknown photo format: ${firstPhoto.substring(0, 10)}...)`);
      skipCount++;
      continue;
    }

    console.log(`📦 Processing: ${venue.name || doc.id}...`);
    
    const newPhotoUrls: string[] = [];
    const photosToProcess = photos.slice(0, 3); // Max 3 as per task

    for (let i = 0; i < photosToProcess.length; i++) {
      const ref = photosToProcess[i];
      if (ref.startsWith('AU_')) {
        const storageUrl = await migratePhoto(doc.id, ref, i);
        if (storageUrl) {
          newPhotoUrls.push(storageUrl);
        }
      } else if (ref.startsWith('https://')) {
        newPhotoUrls.push(ref);
      }
    }

    if (newPhotoUrls.length > 0) {
      try {
        await doc.ref.update({
          photos: newPhotoUrls,
          migratedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`   ✅ Downloaded: ${venue.name} (${newPhotoUrls.length} photos)`);
        successCount++;
      } catch (err: any) {
        console.error(`   ⚠️  Failed to update Firestore for ${venue.name}: ${err.message}`);
        failCount++;
      }
    } else {
      console.error(`   ⚠️  Failed: ${venue.name} - No photos could be migrated.`);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(40));
  console.log('Migration Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ⏭️  Skipped: ${skipCount}`);
  console.log(`   ⚠️  Failed:  ${failCount}`);
  console.log('='.repeat(40));
}

main().catch((err) => {
  console.error('CRITICAL ERROR:', err);
  process.exit(1);
});
