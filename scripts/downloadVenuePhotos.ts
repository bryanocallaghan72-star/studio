
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

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-8946896495-11b4f';
const STORAGE_BUCKET = `${PROJECT_ID}.firebasestorage.app`;

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

async function downloadAndUpload(venueId: string, photoRef: string, index: number): Promise<string | null> {
  // Use the new Google Places API v1 media endpoint for AU_ZVE references
  const url = `https://places.googleapis.com/v1/${photoRef}/media?maxWidthPx=1200&key=${GOOGLE_PLACES_API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`  ✗ Failed to fetch media from Google for ${venueId}: ${response.statusText}`);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const destPath = `venue_images/${venueId}/${index}.jpg`;
    const file = bucket.file(destPath);

    // Upload to Firebase Storage
    await file.save(buffer, {
      metadata: {
        contentType: 'image/jpeg',
        cacheControl: 'public, max-age=31536000',
      }
    });

    // Make file public or use standardized URL pattern
    // Note: In App Hosting/Firebase setup, we usually want the public URL
    // For admin SDK, we get the signed URL or standardized download URL
    return `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(destPath)}?alt=media`;

  } catch (error: any) {
    console.error(`  ✗ Error processing image for ${venueId}: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting Venue Photo Migration to Firebase Storage...');
  console.log(`Project: ${PROJECT_ID} | Bucket: ${STORAGE_BUCKET}`);

  const venuesRef = db.collection('venues');
  const snapshot = await venuesRef.get();

  console.log(`Found ${snapshot.size} venues to check.`);

  let totalVenuesProcessed = 0;
  let totalImagesUploaded = 0;

  for (const doc of snapshot.docs) {
    const venue = doc.data();
    const photos = venue.photos || [];
    
    // Only process venues that have Google references (start with AU_)
    const needsMigration = photos.length > 0 && photos.some((ref: string) => ref.startsWith('AU_'));

    if (!needsMigration) {
      continue;
    }

    console.log(`📦 Migrating: ${venue.name || doc.id}...`);
    
    const newPhotoUrls: string[] = [];

    for (let i = 0; i < photos.length; i++) {
      const ref = photos[i];
      
      if (ref.startsWith('AU_')) {
        const storageUrl = await downloadAndUpload(doc.id, ref, i);
        if (storageUrl) {
          newPhotoUrls.push(storageUrl);
          totalImagesUploaded++;
        } else {
          // If upload fails, keep the original ref for now
          newPhotoUrls.push(ref);
        }
      } else {
        // Keep existing URLs (e.g. already migrated or http)
        newPhotoUrls.push(ref);
      }
    }

    try {
      await doc.ref.update({
        photos: newPhotoUrls,
        migratedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`✅ Completed: ${venue.name} (${newPhotoUrls.length} images)`);
      totalVenuesProcessed++;
    } catch (updateErr: any) {
      console.error(`✗ Failed to update Firestore for ${venue.name}: ${updateErr.message}`);
    }
  }

  console.log('\n' + '='.repeat(40));
  console.log('Migration Summary:');
  console.log(`Venues Migrated: ${totalVenuesProcessed}`);
  console.log(`Images Uploaded: ${totalImagesUploaded}`);
  console.log('='.repeat(40));
}

main().catch((err) => {
  console.error('CRITICAL ERROR:', err);
  process.exit(1);
});
