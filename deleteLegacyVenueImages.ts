/**
 * @fileOverview Irreversible Cleanup Script: Legacy Venue Photos in Storage
 * 
 * Target: Files in 'venue_images/' prefix only.
 * Purpose: Compliance with Google Maps Platform ToS (No binary storage).
 * 
 * Safety:
 * 1. Defaults to DRY RUN.
 * 2. Requires --write AND --confirm-delete-google-venue-images flags.
 * 3. Never touches avatars/, banners/, or posts/.
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-8946896495-11b4f';
const BUCKET_NAME = process.env.STORAGE_BUCKET || `${PROJECT_ID}.firebasestorage.app`;

if (admin.apps.length === 0) {
  admin.initializeApp({
    projectId: PROJECT_ID,
    storageBucket: BUCKET_NAME
  });
}

const bucket = admin.storage().bucket();

async function main() {
  const isWriteMode = process.argv.includes('--write');
  const isConfirmed = process.argv.includes('--confirm-delete-google-venue-images');

  console.log(`\n⚠️  STORAGE CLEANUP: ${BUCKET_NAME}`);
  console.log(`Target Path: venue_images/`);
  console.log(`Mode: ${isWriteMode ? 'WRITE' : 'DRY RUN'}`);

  if (isWriteMode && !isConfirmed) {
    console.error('\n❌ ERROR: Deletion requires explicit confirmation.');
    console.error('Run with: --write --confirm-delete-google-venue-images');
    process.exit(1);
  }

  try {
    const [files] = await bucket.getFiles({ prefix: 'venue_images/' });
    
    // Filter to ensure we only catch files directly in the prefix or its subfolders
    const targetFiles = files.filter(f => f.name.startsWith('venue_images/'));

    if (targetFiles.length === 0) {
      console.log('\n✅ No files found in target path. Cleanup complete.');
      return;
    }

    console.log(`\nFound ${targetFiles.length} candidate files.`);
    
    let totalSize = 0;
    targetFiles.forEach(file => {
      const size = parseInt(file.metadata.size || '0');
      totalSize += size;
      console.log(`- [PENDING DELETION] ${file.name} (${(size / 1024).toFixed(2)} KB)`);
    });

    console.log(`\nTotal estimated size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);

    if (!isWriteMode) {
      console.log('\nℹ️  DRY RUN: No files were deleted.');
      console.log('To execute, add: --write --confirm-delete-google-venue-images');
      return;
    }

    console.log('\n💣 DELETING FILES...');
    console.warn('WARNING: This action is irreversible.');
    
    let successCount = 0;
    let failCount = 0;

    for (const file of targetFiles) {
      try {
        await file.delete();
        successCount++;
        process.stdout.write('.'); // Simple progress indicator
      } catch (err) {
        console.error(`\n  - Failed: ${file.name}`);
        failCount++;
      }
    }

    console.log(`\n\n--- CLEANUP COMPLETE ---`);
    console.log(`Successfully deleted: ${successCount}`);
    console.log(`Failed: ${failCount}`);

  } catch (error) {
    console.error('Cleanup failed:', error);
  }
}

main().catch(console.error);
