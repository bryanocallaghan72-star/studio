/**
 * @fileOverview READ-ONLY Storage Audit Script
 * Lists files in Firebase Storage that may be non-compliant Google-sourced venue photos.
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
  console.log(`🔍 Auditing Storage Bucket: ${BUCKET_NAME}`);
  console.log('Searching for candidate legacy venue photos...');

  try {
    const [files] = await bucket.getFiles({ prefix: 'venue_images/' });
    
    console.log(`\nFound ${files.length} files in 'venue_images/' prefix.`);
    
    let totalSize = 0;

const candidates = files.map((file) => {
  const rawSize = file.metadata.size ?? 0;
  const size = typeof rawSize === 'number' ? rawSize : Number(rawSize);

  totalSize += Number.isFinite(size) ? size : 0;

  return {
    name: file.name,
    size: `${((Number.isFinite(size) ? size : 0) / 1024).toFixed(2)} KB`,
  };
});

    if (files.length > 0) {
        console.table(candidates.slice(0, 20));
        if (files.length > 20) console.log(`... and ${files.length - 20} more.`);
        console.log(`\nTotal estimated size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
    } else {
        console.log('No files found in the standard venue image prefix.');
    }

    console.log('\nNote: These files are likely non-compliant Google binary data.');
    console.log('RECOMMENDATION: Verify if these are independently sourced. If not, delete and use proxy.');

  } catch (error) {
    console.error('Audit failed:', error);
  }
}

main().catch(console.error);
