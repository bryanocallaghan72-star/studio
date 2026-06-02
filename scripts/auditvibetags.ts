// scripts/auditVibeTags.ts
// Audits all vibeTags across venues — shows unique values and counts
// Run: npx tsx scripts/auditVibeTags.ts

import * as admin from 'firebase-admin';

admin.initializeApp({ projectId: 'studio-8946896495-11b4f' });

const VIBE_MAP_FILTERS = [
  'Post Surf',
  'Sunset Ritual',
  'High Voltage',
  'Hidden Gem',
  'Morning Reset',
];

(async () => {
  const snap = await admin.firestore().collection('venues').get();
  const counts: Record<string, number> = {};

  snap.docs.forEach(d => {
    const tags: string[] = d.data().vibeTags || [];
    tags.forEach(t => {
      counts[t] = (counts[t] || 0) + 1;
    });
  });

  // Sort by count descending
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  console.log('\n── All vibeTags in Firestore ─────────────────');
  sorted.forEach(([tag, count]) => {
    const isFilter = VIBE_MAP_FILTERS.includes(tag);
    console.log(`  ${isFilter ? '✓' : '·'} "${tag}" — ${count} venue${count > 1 ? 's' : ''}`);
  });

  console.log('\n── Vibe Map filter coverage ──────────────────');
  VIBE_MAP_FILTERS.forEach(filter => {
    const count = counts[filter] || 0;
    console.log(`  ${count > 0 ? '✓' : '✗'} "${filter}" — ${count} venue${count !== 1 ? 's' : ''}`);
  });

  const untagged = snap.docs.filter(d => !(d.data().vibeTags?.length > 0)).length;
  console.log(`\n── ${untagged} venues with no vibeTags at all`);
})();