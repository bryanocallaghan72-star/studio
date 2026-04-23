/**
 * @fileOverview Script to audit venue categories in Firestore.
 * This is a read-only script that prints current category values for all venues.
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
  console.log('🔍 Starting audit of venue categories...');
  console.log(`Project: ${PROJECT_ID}\n`);

  const venuesRef = db.collection('venues');
  const snapshot = await venuesRef.get();

  if (snapshot.empty) {
    console.log('No venues found in the collection.');
    return;
  }

  console.log(`Found ${snapshot.size} venues. Printing current categories:\n`);

  snapshot.forEach((doc) => {
    const data = doc.data();
    const name = data.name || doc.id;
    // Check root level category
    const category = data.category || 'N/A';
    console.log(`${name} | ${category}`);
  });

  console.log('\nAudit complete.');
}

main().catch((err) => {
  console.error('CRITICAL ERROR:', err);
  process.exit(1);
});
