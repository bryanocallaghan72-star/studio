
/**
 * @fileOverview Google Places Data Cleanup Script
 * Removes rating and totalRatings fields from the Firestore 'venues' collection
 * to ensure compliance with Google Maps Platform Terms of Service.
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-8946896495-11b4f';

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  admin.initializeApp({
    projectId: PROJECT_ID,
  });
}

const db = admin.firestore();

async function main() {
  console.log('🧹 Starting cleanup of Google Ratings from Firestore...');
  console.log(`Project: ${PROJECT_ID}`);

  const venuesRef = db.collection('venues');
  const snapshot = await venuesRef.get();

  if (snapshot.empty) {
    console.log('No venues found in the collection.');
    return;
  }

  console.log(`Found ${snapshot.size} venues to process.`);

  let successCount = 0;
  let failCount = 0;

  for (const doc of snapshot.docs) {
    const venue = doc.data();
    
    try {
      // Remove rating and totalRatings fields using FieldValue.delete()
      await doc.ref.update({
        rating: admin.firestore.FieldValue.delete(),
        totalRatings: admin.firestore.FieldValue.delete()
      });

      console.log(`✅ Cleaned: ${venue.name || doc.id}`);
      successCount++;
    } catch (error: any) {
      console.error(`✗ Failed to clean ${venue.name || doc.id}: ${error.message}`);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(30));
  console.log(`Cleanup complete: ${successCount} succeeded, ${failCount} failed.`);
  console.log('='.repeat(30));
}

main().catch((err) => {
  console.error('CRITICAL ERROR:', err);
  process.exit(1);
});
