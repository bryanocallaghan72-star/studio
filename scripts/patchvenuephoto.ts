// scripts/patchVenuePhoto.ts
// Patches a single venue's photo with a URL you provide
// Usage: npx tsx scripts/patchVenuePhoto.ts <slug> <photo-url>
// Example: npx tsx scripts/patchVenuePhoto.ts totti-s-ceorug https://merivale.com/path/to/photo.jpg

import * as admin from 'firebase-admin';

const PROJECT_ID = 'studio-8946896495-11b4f';
const BUCKET    = 'studio-8946896495-11b4f.firebasestorage.app';

admin.initializeApp({ projectId: PROJECT_ID });

const db     = admin.firestore();
const bucket = admin.storage().bucket(BUCKET);

async function run() {
  const [slug, photoUrl] = process.argv.slice(2);

  if (!slug || !photoUrl) {
    console.error('Usage: npx tsx scripts/patchVenuePhoto.ts <slug> <photo-url>');
    process.exit(1);
  }

  console.log(`\nPatching: ${slug}`);
  console.log(`Source:   ${photoUrl}\n`);

  // 1. Download image
  const res = await fetch(photoUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IYKYKBot/1.0)' },
  });
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);

  const buffer      = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get('content-type')?.split(';')[0] ?? 'image/jpeg';
  const ext         = contentType.includes('png') ? 'png'
                    : contentType.includes('webp') ? 'webp'
                    : 'jpg';

  console.log(`Downloaded ${(buffer.length / 1024).toFixed(1)} KB (${contentType})`);

  // 2. Upload to Storage
  const filePath    = `venue_images/${slug}/0.${ext}`;
  const file        = bucket.file(filePath);

  await file.save(buffer, { metadata: { contentType }, resumable: false });
  await file.makePublic();

  const encodedPath = filePath.split('/').map(encodeURIComponent).join('%2F');
  const storageUrl  = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodedPath}?alt=media`;

  // 3. Update Firestore
  const snap = await db.collection('venues').where('slug', '==', slug).limit(1).get();
  if (snap.empty) throw new Error(`No venue found with slug: ${slug}`);

  await snap.docs[0].ref.update({ photos: [storageUrl] });

  console.log(`✓ Done — ${snap.docs[0].data().name}`);
  console.log(`  ${storageUrl}`);
}

run().catch(err => {
  console.error('\n✗ Error:', err.message);
  process.exit(1);
});