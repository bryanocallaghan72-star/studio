/**
 * @fileOverview Script to update venue categories in Firestore.
 * Matches venue names against a canonical mapping and updates the category field.
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

const CATEGORY_MAP: Record<string, string> = {
  "Amalfi Bondi Beach": "Restaurants",
  "Balance Moves Pilates & Barre Studio": "Health & Fitness",
  "Beach Road Hotel": "Nightlife",
  "BEACHOUSE": "Health & Fitness",
  "Besa – Spanish Tapas Bar Bondi": "Restaurants",
  "Birichina Cafe": "Brunch",
  "Bistro Bondi": "Restaurants",
  "Blackwood Bondi": "Brunch",
  "BodyMindLife Bondi Yoga & Pilates": "Health & Fitness",
  "Bondi Markets": "Vibes",
  "Bondi to Bronte Coastal Walk": "Surf",
  "Bondi Trattoria": "Restaurants",
  "Bondi Vixen": "Retail",
  "Bonditony's Burger Joint - BONDI": "Nightlife",
  "Cali Press Cafe & Breakfast Bondi Beach": "Brunch",
  "Chuck Trailer's Bondi Beach": "Nightlife",
  "Don Pedros Bondi": "Restaurants",
  "El Indio Bondi Beach": "Restaurants",
  "Fluidform Pilates": "Health & Fitness",
  "Funky Pies": "Restaurants",
  "Glory Days Bondi": "Brunch",
  "Harrys Bondi": "Brunch",
  "Iberica": "Restaurants",
  "Icebergs Dining Room and Bar": "Restaurants",
  "Ikaria Bondi": "Restaurants",
  "Jac + Jack": "Retail",
  "Kissed Earth": "Retail",
  "Lox Stock & Barrel": "Brunch",
  "Luca & Luca Gelato": "Restaurants",
  "Lulu": "Restaurants",
  "LULU": "Restaurants",
  "Macelleria Bondi Beach": "Restaurants",
  "Makaveli Bondi": "Nightlife",
  "Mamasaan Bondi - Japanese Cuisine Restaurant and Bar in Bondi Beach": "Sushi",
  "Mamis Bondi": "Brunch",
  "Myoko Sushi Bar": "Sushi",
  "Native Drops": "Cocktails",
  "North Bondi Sushi": "Sushi",
  "Nude Lucy Bondi Beach": "Retail",
  "Pocket Bondi": "Brunch",
  "Porch and Parlour": "Brunch",
  "Promenade Beach Bar": "Cocktails",
  "Rare Studios Au (Bondi)": "Health & Fitness",
  "Raw Bar": "Cocktails",
  "RND Bondi": "Health & Fitness",
  "Salty's Bondi": "Brunch",
  "Sarana Bondi": "Restaurants",
  "Sefa Kitchen Bondi": "Brunch",
  "sundays bondi": "Brunch",
  "The Beekeeper Bondi": "Cocktails",
  "The Corner House, Bondi": "Brunch",
  "The Depot": "Brunch",
  "The Upbeat Bondi": "Health & Fitness",
  "Totti's": "Restaurants",
  "Tuchuzy": "Retail",
  "Venroy": "Retail",
  "Volume 1 Bondi": "Nightlife",
};

async function main() {
  console.log('🚀 Starting update of venue categories...');
  console.log(`Project: ${PROJECT_ID}\n`);

  const venuesRef = db.collection('venues');
  const snapshot = await venuesRef.get();

  if (snapshot.empty) {
    console.log('No venues found in the collection.');
    return;
  }

  console.log(`Found ${snapshot.size} venues to process.`);

  let updatedCount = 0;
  let skippedCount = 0;
  let warningCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const name = data.name;

    if (!name) {
      console.log(`⚠️ Document ${doc.id} has no name field. Skipping.`);
      skippedCount++;
      continue;
    }

    const newCategory = CATEGORY_MAP[name];

    if (newCategory) {
      try {
        await doc.ref.update({
          category: newCategory,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`✅ Updated: ${name} -> ${newCategory}`);
        updatedCount++;
      } catch (error: any) {
        console.error(`❌ Failed to update ${name}: ${error.message}`);
        warningCount++;
      }
    } else {
      console.log(`⚠️ No mapping for: ${name}`);
      skippedCount++;
      warningCount++;
    }
  }

  console.log('\n' + '='.repeat(30));
  console.log('Update Summary:');
  console.log(`   ✅ Updated:  ${updatedCount}`);
  console.log(`   ⏭️  Skipped:  ${skippedCount}`);
  console.log(`   ⚠️  Warnings: ${warningCount}`);
  console.log('='.repeat(30));
}

main().catch((err) => {
  console.error('CRITICAL ERROR:', err);
  process.exit(1);
});