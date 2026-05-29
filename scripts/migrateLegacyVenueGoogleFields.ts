/**
 * @fileOverview Migration Script: Legacy Google Fields to googleCache
 * 
 * Synchronizes legacy top-level fields (location, phone, website) into the 
 * structured googleCache layer.
 * 
 * Default: DRY RUN. 
 * Use --write flag to commit changes to Firestore.
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
  const isWriteMode = process.argv.includes('--write');
  console.log(`\n🔍 Starting Legacy Venue Field Migration [Mode: ${isWriteMode ? 'WRITE' : 'DRY RUN'}]...`);

  const snapshot = await db.collection('venues').get();
  const venues = snapshot.docs.map(doc => ({ id: doc.id, ref: doc.ref, ...doc.data() as any }));

  const summary = {
    totalScanned: venues.length,
    wouldUpdate: 0,
    skipped: 0,
    fieldsMigrated: 0,
    missingPlaceId: 0,
    missingGoogleCache: 0,
    prohibitedReappearance: [] as string[]
  };

  for (const venue of venues) {
    const updates: any = {};
    const googleCache = venue.googleCache || {};
    const legacyLocation = venue.location || {};
    const legacyPhone = venue.phone;
    const legacyWebsite = venue.website;

    if (!venue.placeId) summary.missingPlaceId++;
    if (!venue.googleCache) summary.missingGoogleCache++;

    // Detect prohibited fields if they somehow reappeared
    const prohibited = ['rating', 'reviews', 'openingHours', 'businessStatus'];
    prohibited.forEach(field => {
        if (venue[field]) summary.prohibitedReappearance.push(`${venue.id}.${field}`);
    });

    // 1. Sync Address
    if (legacyLocation.address && !googleCache.formattedAddress) {
      if (!updates.googleCache) updates.googleCache = { ...googleCache };
      updates.googleCache.formattedAddress = legacyLocation.address;
      summary.fieldsMigrated++;
    }

    // 2. Sync Coordinates
    if ((legacyLocation.latitude !== undefined || legacyLocation.longitude !== undefined) && !googleCache.location) {
      if (!updates.googleCache) updates.googleCache = { ...googleCache };
      updates.googleCache.location = {
        lat: legacyLocation.latitude || 0,
        lng: legacyLocation.longitude || 0
      };
      summary.fieldsMigrated++;
    }

    // 3. Sync Phone
    if (legacyPhone && !googleCache.phone) {
      if (!updates.googleCache) updates.googleCache = { ...googleCache };
      updates.googleCache.phone = legacyPhone;
      summary.fieldsMigrated++;
    }

    // 4. Sync Website
    if (legacyWebsite && !googleCache.website) {
      if (!updates.googleCache) updates.googleCache = { ...googleCache };
      updates.googleCache.website = legacyWebsite;
      summary.fieldsMigrated++;
    }

    if (Object.keys(updates).length > 0) {
      summary.wouldUpdate++;
      
      // Ensure attribution is required for Google-sourced data
      updates.googleCache.attributionRequired = true;
      
      // Meta tracking
      const sourceMeta = venue.sourceMeta || {};
      updates.sourceMeta = {
        ...sourceMeta,
        migratedLegacyGoogleFieldsAt: admin.firestore.FieldValue.serverTimestamp(),
        legacyGoogleFieldsRetained: true
      };

      console.log(`- ${venue.id}: Prepared sync for ${Object.keys(updates.googleCache).length - 1} fields.`);

      if (isWriteMode) {
        await venue.ref.update(updates);
      }
    } else {
      summary.skipped++;
    }
  }

  console.log('\n--- MIGRATION SUMMARY ---');
  console.log(`Total Venues Scanned: ${summary.totalScanned}`);
  console.log(`${isWriteMode ? 'Updated' : 'Would Update'}: ${summary.wouldUpdate}`);
  console.log(`Skipped: ${summary.skipped}`);
  console.log(`Total Fields Sync'd: ${summary.fieldsMigrated}`);
  console.log(`Missing Place ID: ${summary.missingPlaceId}`);
  console.log(`Missing Google Cache: ${summary.missingGoogleCache}`);

  if (summary.prohibitedReappearance.length > 0) {
      console.log('\n⚠️ WARNING: Prohibited fields detected in docs:', summary.prohibitedReappearance.join(', '));
  }

  if (!isWriteMode) {
    console.log('\nDRY RUN: no Firestore documents were modified.');
  } else {
    console.log('\nWRITE COMPLETE: Sync operation finished successfully.');
  }
}

main().catch((err) => {
    console.error('Critical failure:', err);
    process.exit(1);
});
