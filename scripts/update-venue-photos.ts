// scripts/updateVenuePhotos.ts
// Replaces Google Places photos with each venue's own marketing image
// Strategy: fetches og:image meta tag from the venue's stored website URL
// Auth: Application Default Credentials (works automatically in Firebase Studio IDX)
// Run: npx tsx scripts/updateVenuePhotos.ts

import * as admin from 'firebase-admin';

// ── Config ───────────────────────────────────────────────────────────────────

const PROJECT_ID = 'studio-8946896495-11b4f';
const BUCKET = 'studio-8946896495-11b4f.firebasestorage.app';

// ── Init ─────────────────────────────────────────────────────────────────────

admin.initializeApp({ projectId: PROJECT_ID });

const db = admin.firestore();
const bucket = admin.storage().bucket(BUCKET);

// ── Types ────────────────────────────────────────────────────────────────────

interface VenueDoc {
  slug: string;
  name: string;
  website?: string;
}

type Result =
  | { slug: string; name: string; status: 'success'; storageUrl: string }
  | { slug: string; name: string; status: 'skip'; reason: string }
  | { slug: string; name: string; status: 'fail'; reason: string; website?: string };

// ── Helpers ──────────────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string, ms = 10000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IYKYKBot/1.0)' },
    });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

async function getOgImage(websiteUrl: string): Promise<string | null> {
  const res = await fetchWithTimeout(websiteUrl);
  const html = await res.text();

  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
  ];

  for (const pat of patterns) {
    const match = html.match(pat);
    if (match) return match[1].trim();
  }
  return null;
}

async function downloadImage(url: string): Promise<{ buffer: Buffer; contentType: string }> {
  const res = await fetchWithTimeout(url, 15000);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get('content-type')?.split(';')[0] ?? 'image/jpeg';
  return { buffer, contentType };
}

async function uploadPhoto(slug: string, buffer: Buffer, contentType: string): Promise<string> {
  const ext = contentType.includes('png') ? 'png'
    : contentType.includes('webp') ? 'webp'
    : 'jpg';

  const filePath = `venue_images/${slug}/0.${ext}`;
  const file = bucket.file(filePath);

  await file.save(buffer, { metadata: { contentType }, resumable: false });
  await file.makePublic();

  const encodedPath = filePath.split('/').map(encodeURIComponent).join('%2F');
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodedPath}?alt=media`;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ── Process one venue ────────────────────────────────────────────────────────

async function processVenue(doc: admin.firestore.QueryDocumentSnapshot): Promise<Result> {
  const data = doc.data() as VenueDoc;
  const { slug, name, website } = data;

  if (!website) {
    return { slug, name, status: 'skip', reason: 'no website stored' };
  }

  // 1. Get og:image from venue website
  let ogImageUrl: string | null;
  try {
    ogImageUrl = await getOgImage(website);
  } catch (e: any) {
    return { slug, name, status: 'fail', reason: `website unreachable: ${e.message}`, website };
  }

  if (!ogImageUrl) {
    return { slug, name, status: 'fail', reason: 'no og:image tag found', website };
  }

  // Resolve relative URLs
  if (ogImageUrl.startsWith('/')) {
    const base = new URL(website);
    ogImageUrl = `${base.origin}${ogImageUrl}`;
  }

  // 2. Download image
  let buffer: Buffer;
  let contentType: string;
  try {
    ({ buffer, contentType } = await downloadImage(ogImageUrl));
  } catch (e: any) {
    return { slug, name, status: 'fail', reason: `image download failed: ${e.message}`, website };
  }

  // 3. Upload to Storage (overwrites existing file at same path)
  let storageUrl: string;
  try {
    storageUrl = await uploadPhoto(slug, buffer, contentType);
  } catch (e: any) {
    return { slug, name, status: 'fail', reason: `upload failed: ${e.message}` };
  }

  // 4. Update Firestore — replace photos array with new URL
  await doc.ref.update({ photos: [storageUrl] });

  return { slug, name, status: 'success', storageUrl };
}

// ── Run ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log('🏄 IYKYK Photo Updater\n');

  const snap = await db.collection('venues').get();
  console.log(`Found ${snap.docs.length} venues\n`);

  const succeeded: string[] = [];
  const failed: Result[] = [];
  const skipped: Result[] = [];

  for (const doc of snap.docs) {
    const result = await processVenue(doc);

    if (result.status === 'success') {
      console.log(`✓  ${result.name}`);
      succeeded.push(result.slug);
    } else if (result.status === 'skip') {
      console.log(`⊘  ${result.name} — ${result.reason}`);
      skipped.push(result);
    } else {
      console.log(`✗  ${result.name} — ${result.reason}`);
      if ('website' in result && result.website) console.log(`   ${result.website}`);
      failed.push(result);
    }

    await sleep(600);
  }

  console.log('\n── Summary ──────────────────────────────');
  console.log(`✓  Updated:  ${succeeded.length}`);
  console.log(`⊘  Skipped:  ${skipped.length}  (no website stored)`);
  console.log(`✗  Failed:   ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nHandle these manually — find a photo and update via /admin VenueEnricher:');
    failed.forEach(f => {
      if (f.status === 'fail') {
        console.log(`\n  • ${f.name} [${f.slug}]`);
        if (f.website) console.log(`    ${f.website}`);
        console.log(`    reason: ${f.reason}`);
      }
    });
  }
}

run().catch(err => {
  console.error('\nFatal:', err.message);
  process.exit(1);
});