/**
 * @fileOverview READ-ONLY Audit Script
 * Scans venues and reports presence of legacy/prohibited Google-derived fields.
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-8946896495-11b4f';

if (admin.apps.length === 0) {
  admin.initializeApp({ projectId: PROJECT_ID });
}

const db = admin.firestore();

async function main() {
  console.log('🔍 Starting READ-ONLY Audit of Google Fields in Firestore...');
  
  const snapshot = await db.collection('venues').get();
  const venues = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const report = {
    totalVenues: venues.length,
    hasPlaceId: 0,
    hasGoogleCache: 0,
    hasFreshCache: 0,
    legacyFieldsFound: {
        topLevelAddress: 0,
        topLevelCoords: 0,
        locationObject: 0,
        openingHours: 0,
        photos: 0,
        ratings: 0,
        phone: 0,
        website: 0,
        businessStatus: 0
    },
    affectedVenues: [] as string[]
  };

  venues.forEach(v => {
    let hasLegacy = false;
    
    if (v.placeId) report.hasPlaceId++;
    if (v.googleCache) {
        report.hasGoogleCache++;
        if (v.googleCache.expiresAt && v.googleCache.expiresAt.toDate() > new Date()) {
            report.hasFreshCache++;
        }
    }

    if (v.address) { report.legacyFieldsFound.topLevelAddress++; hasLegacy = true; }
    if (v.latitude || v.longitude) { report.legacyFieldsFound.topLevelCoords++; hasLegacy = true; }
    if (v.location) { report.legacyFieldsFound.locationObject++; hasLegacy = true; }
    if (v.openingHours) { report.legacyFieldsFound.openingHours++; hasLegacy = true; }
    if (v.photos || v.photoReference) { report.legacyFieldsFound.photos++; hasLegacy = true; }
    if (v.rating || v.totalRatings) { report.legacyFieldsFound.ratings++; hasLegacy = true; }
    if (v.phone) { report.legacyFieldsFound.phone++; hasLegacy = true; }
    if (v.website) { report.legacyFieldsFound.website++; hasLegacy = true; }
    if (v.businessStatus) { report.legacyFieldsFound.businessStatus++; hasLegacy = true; }

    if (hasLegacy) report.affectedVenues.push(v.id);
  });

  console.log('\n--- AUDIT SUMMARY ---');
  console.log(`Total Venues: ${report.totalVenues}`);
  console.log(`With Place ID (Safe Reference): ${report.hasPlaceId}`);
  console.log(`With Google Cache (Compliant Layer): ${report.hasGoogleCache}`);
  console.log(`With Fresh Cache (< 30 days): ${report.hasFreshCache}`);
  
  console.log('\n--- LEGACY FIELD DETECTIONS ---');
  console.table(report.legacyFieldsFound);

  console.log(`\nVenues needing cleanup: ${report.affectedVenues.length}`);
  if (report.affectedVenues.length > 0) {
    console.log('Sample affected venues:', report.affectedVenues.slice(0, 10).join(', '));
  }
}

main().catch(console.error);
