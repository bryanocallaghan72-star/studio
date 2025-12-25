
'use client';

import {
  writeBatch,
  collection,
  doc,
  getDocs,
  Firestore,
} from 'firebase/firestore';
import { SEED_VENUES } from '@/data/seeds/venues';

export type SeedMode = 'upsert' | 'skip-if-exists';

export interface SeedResult {
  success: boolean;
  message: string;
  operations: {
    total: number;
    written: number;
    skipped: number;
    dryRun: boolean;
  };
}

/**
 * Seeds the Firestore 'venues' collection from the canonical SEED_VENUES data.
 *
 * @param {Firestore} firestore - The Firestore instance.
 * @param {object} options - Seeding options.
 * @param {SeedMode} [options.mode='skip-if-exists'] - The write mode.
 *        'upsert': Creates new venues or overwrites existing ones.
 *        'skip-if-exists': Creates new venues but skips any with existing IDs.
 * @param {boolean} [options.dryRun=false] - If true, simulates the run without writing data.
 * @returns {Promise<SeedResult>} A promise that resolves with the result of the operation.
 */
export async function seedVenues(
  firestore: Firestore,
  options: {
    mode?: SeedMode;
    dryRun?: boolean;
  } = {}
): Promise<SeedResult> {
  const { mode = 'skip-if-exists', dryRun = false } = options;
  const venuesCollection = collection(firestore, 'venues');
  const result: SeedResult = {
    success: true,
    message: '',
    operations: {
      total: SEED_VENUES.length,
      written: 0,
      skipped: 0,
      dryRun,
    },
  };

  try {
    const existingVenues = new Set<string>();
    if (mode === 'skip-if-exists') {
      const snapshot = await getDocs(venuesCollection);
      snapshot.forEach((doc) => existingVenues.add(doc.id));
      result.operations.skipped = existingVenues.size;
    }

    const batch = writeBatch(firestore);
    let writesPerformed = 0;

    SEED_VENUES.forEach((venue) => {
      if (mode === 'skip-if-exists' && existingVenues.has(venue.slug)) {
        return; // Skip this venue
      }
      const docRef = doc(venuesCollection, venue.slug);
      batch.set(docRef, venue);
      writesPerformed++;
    });

    result.operations.written = writesPerformed;
    if (writesPerformed === 0) {
        result.message = 'No new venues to add.';
    } else {
        result.message = `${dryRun ? '[DRY RUN] Would have written' : 'Successfully wrote'} ${writesPerformed} venues.`;
    }

    if (!dryRun && writesPerformed > 0) {
      await batch.commit();
    }
    
    // Adjust skipped count for upsert mode
    if (mode === 'upsert') {
        result.operations.skipped = result.operations.total - result.operations.written;
    }


  } catch (error: any) {
    result.success = false;
    result.message = `An error occurred: ${error.message}`;
    console.error('Error seeding venues:', error);
  }

  return result;
}
