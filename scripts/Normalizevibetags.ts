// scripts/normalizeVibeTags.ts
// Normalises vibeTag casing across all venues — merges lowercase into Title Case, deduplicates
// Run: npx tsx scripts/normalizeVibeTags.ts

import * as admin from 'firebase-admin';

admin.initializeApp({ projectId: 'studio-8946896495-11b4f' });

const db = admin.firestore();

// Normalisation map — lowercase source → canonical Title Case target
const NORMALISE: Record<string, string> = {
  'date night':       'Date Night',
  'local favourite':  'Local Favourite',
  'hidden gem':       'Hidden Gem',
  'cocktails':        'Cocktails',
  'lively':           'Lively',
  'wellness':         'Wellness',
  'community':        'Community',
};

function normaliseTags(tags: string[]): string[] {
  const normalised = tags.map(t => NORMALISE[t.toLowerCase()] ?? t);
  // Deduplicate preserving order
  return [...new Set(normalised)];
}

(async () => {
  const snap = await db.collection('venues').get();
  console.log(`\nNormalising vibeTags across ${snap.docs.length} venues...\n`);

  let updated = 0;
  let unchanged = 0;

  const batch = db.batch();

  snap.docs.forEach(doc => {
    const original: string[] = doc.data().vibeTags || [];
    const normalised = normaliseTags(original);

    const changed =
      original.length !== normalised.length ||
      original.some((t, i) => t !== normalised[i]);

    if (changed) {
      console.log(`  ✓ ${doc.data().name}`);
      console.log(`    before: [${original.join(', ')}]`);
      console.log(`    after:  [${normalised.join(', ')}]\n`);
      batch.update(doc.ref, { vibeTags: normalised });
      updated++;
    } else {
      unchanged++;
    }
  });

  await batch.commit();

  console.log('── Summary ──────────────────────────────');
  console.log(`✓ Updated:   ${updated} venues`);
  console.log(`· Unchanged: ${unchanged} venues`);
})();