
/**
 * @fileOverview AI Venue Enrichment Script
 * Uses Gemini 2.5 Flash to generate contextual vibe tags for all venues in Firestore.
 */

import * as admin from 'firebase-admin';

// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const FORCE_ENRICH = process.argv.includes('--force');

if (!GEMINI_API_KEY) {
  console.error('✗ Error: GEMINI_API_KEY environment variable is required.');
  process.exit(1);
}

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  admin.initializeApp({
    projectId: PROJECT_ID,
  });
}

const db = admin.firestore();

interface VenueDoc {
  name: string;
  category?: string;
  address?: string;
  location?: { address?: string };
  details?: { 
    category?: string;
    description?: string;
  };
  description?: string;
  vibeTags?: string[];
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function getVibeTagsFromGemini(venue: VenueDoc): Promise<string[]> {
  const name = venue.name;
  const category = venue.details?.category || venue.category || 'Unknown';
  const address = venue.location?.address || venue.address || 'Unknown';
  const description = venue.details?.description || venue.description || 'No description provided.';

  const prompt = {
    contents: [{
      parts: [{
        text: `Based on this venue's details, return ONLY a valid JSON array of exactly 3 vibe tags chosen from this list: [Sunset Ritual, Post-Surf, High Voltage, Hidden Gem, Morning Reset, Date Night, Group Energy]
        
        Venue name: ${name}
        Category: ${category}
        Address: ${address}
        Description: ${description}
        
        Return ONLY the JSON array. No explanation. No markdown.`
      }]
    }],
    systemInstruction: {
      parts: [{
        text: "You are a Bondi Beach local and hospitality expert. You know every venue, its crowd, its energy, and its place in the Bondi social fabric."
      }]
    }
  };

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prompt),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  if (!textResponse) {
    throw new Error('Gemini returned an empty response.');
  }

  // Clean up potential markdown formatting if AI ignored instructions
  const cleanedText = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
  
  if (!cleanedText) {
    throw new Error('Cleaned AI response is empty.');
  }

  try {
    const tags = JSON.parse(cleanedText);
    if (!Array.isArray(tags) || tags.length !== 3) {
      throw new Error(`Invalid response format: Expected array of 3, got ${typeof tags}`);
    }
    return tags;
  } catch (e) {
    throw new Error(`Failed to parse AI response as JSON: ${cleanedText}`);
  }
}

async function main() {
  console.log('🚀 Starting venue enrichment...');
  console.log(`Project: ${PROJECT_ID || 'default'} | Force Mode: ${FORCE_ENRICH}`);

  const venuesRef = db.collection('venues');
  const snapshot = await venuesRef.get();

  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (const doc of snapshot.docs) {
    const venue = doc.data() as VenueDoc;

    // Skip logic
    if (!FORCE_ENRICH && venue.vibeTags && venue.vibeTags.length >= 3) {
      console.log(`⚠ Skipping: ${venue.name} (Already has 3 tags)`);
      skipCount++;
      continue;
    }

    try {
      const tags = await getVibeTagsFromGemini(venue);
      
      await doc.ref.update({
        vibeTags: tags,
        vibeTagsGeneratedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✓ Enriched: ${venue.name} → ${tags.join(', ')}`);
      successCount++;
      
      // Delay to avoid rate limiting
      await sleep(500);
    } catch (error: any) {
      console.log(`✗ Failed: ${venue.name} → [${error.message}]`);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(30));
  console.log(`Enrichment complete: ${successCount} succeeded, ${failCount} failed, ${skipCount} skipped`);
  console.log('='.repeat(30));
}

main().catch((err) => {
  console.error('CRITICAL ERROR:', err);
  process.exit(1);
});
