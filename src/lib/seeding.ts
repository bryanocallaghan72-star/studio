
import {
  writeBatch,
  collection,
  doc,
  getDocs,
  Firestore,
} from 'firebase/firestore';
import { SEED_VENUES } from '@/data/seeds/venues';
import { 
    TABLE_DROPS, 
    CLASS_DROPS, 
    STAYS, 
    STYLE_DROPS, 
    HOT_ITEMS, 
    AR_DROPS, 
    DEALS 
} from '@/data/seeds/drops';
import type { Venue } from '@/types/venue';

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
 * Creates a Firestore-compliant data object from a canonical Venue object.
 * This ensures all required fields for security rules are present.
 *
 * @param {Venue} venue - The canonical venue object from the seed file.
 * @returns {object} A data object ready to be written to Firestore.
 */
function createFirestorePayload(venue: Venue): object {
  const latitude = venue.location?.latitude ?? venue.latitude ?? 0;
  const longitude = venue.location?.longitude ?? venue.longitude ?? 0;
  
  // Ensure the payload matches the security rules for creation.
  return {
    ...venue,
    slug: venue.slug, // Rule: slug must match doc ID
    name: venue.name,   // Rule: name must be a string
    placeId: `seed:${venue.slug}`, // Rule: placeId must be a string
    latitude: latitude, // Rule: must be a top-level number
    longitude: longitude, // Rule: must be a top-level number
    
    // Also ensure the canonical nested structure is preserved.
    location: {
      ...venue.location,
      latitude: latitude,
      longitude: longitude,
    },
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

  // Batch safety guard
  if (SEED_VENUES.length > 450) {
    const errorMsg = `Seed count (${SEED_VENUES.length}) exceeds batch limit of 450. Please split the seed file.`;
    console.error(errorMsg);
    result.success = false;
    result.message = errorMsg;
    return result;
  }
  
  try {
    const batch = writeBatch(firestore);
    let writesPerformed = 0;

    if (mode === 'skip-if-exists') {
      const snapshot = await getDocs(venuesCollection);
      const existingVenues = new Set<string>();
      snapshot.forEach((doc) => existingVenues.add(doc.id));
      
      SEED_VENUES.forEach((venue) => {
        if (!existingVenues.has(venue.slug)) {
          const docRef = doc(venuesCollection, venue.slug);
          const firestoreData = createFirestorePayload(venue);
          batch.set(docRef, firestoreData);
          writesPerformed++;
        }
      });
      result.operations.skipped = SEED_VENUES.length - writesPerformed;

    } else { // upsert mode
      SEED_VENUES.forEach((venue) => {
        const docRef = doc(venuesCollection, venue.slug);
        const firestoreData = createFirestorePayload(venue);
        batch.set(docRef, firestoreData, { merge: true }); // Use merge for upsert
        writesPerformed++;
      });
      result.operations.skipped = 0;
    }

    result.operations.written = writesPerformed;
    
    if (writesPerformed === 0) {
        result.message = 'No new venues to add.';
    } else {
        result.message = `${dryRun ? '[DRY RUN] Would have written' : 'Successfully wrote'} ${writesPerformed} venues.`;
    }

    if (!dryRun && writesPerformed > 0) {
      await batch.commit();
    }

  } catch (error: any) {
    result.success = false;
    result.message = `An error occurred: ${error.message}`;
    console.error('Error seeding venues:', error);
  }

  return result;
}

const collectionsToSeed = [
    { name: 'tableDrops', data: TABLE_DROPS, idField: 'id' },
    { name: 'classDrops', data: CLASS_DROPS, idField: 'id' },
    { name: 'stays', data: STAYS, idField: 'id' },
    { name: 'styleDrops', data: STYLE_DROPS, idField: 'id' },
    { name: 'hotItems', data: HOT_ITEMS, idField: 'id' },
    { name: 'arDrops', data: AR_DROPS, idField: 'id' },
    { name: 'deals', data: DEALS, idField: 'id' },
];


export async function seedAllDrops(
  firestore: Firestore,
  options: {
    mode?: SeedMode;
    dryRun?: boolean;
  } = {}
): Promise<SeedResult> {
  const { mode = 'skip-if-exists', dryRun = false } = options;
  const result: SeedResult = {
    success: true,
    message: '',
    operations: {
      total: 0,
      written: 0,
      skipped: 0,
      dryRun,
    },
  };

  const batch = writeBatch(firestore);
  let totalWrites = 0;
  let totalSkips = 0;
  let totalItems = 0;

  try {
    for (const { name, data, idField } of collectionsToSeed) {
        const collectionRef = collection(firestore, name);
        totalItems += data.length;

        let existingIds = new Set<string>();
        if (mode === 'skip-if-exists') {
            const snapshot = await getDocs(collectionRef);
            snapshot.forEach((doc) => existingIds.add(doc.id));
        }

        data.forEach((item: any) => {
            const docId = item[idField];
            if (!docId) {
                console.warn(`Item in collection ${name} is missing id field.`, item);
                return;
            }

            if (mode === 'skip-if-exists' && existingIds.has(docId)) {
                totalSkips++;
            } else {
                const docRef = doc(collectionRef, docId);
                batch.set(docRef, item, { merge: true });
                totalWrites++;
            }
        });
    }

    result.operations.total = totalItems;
    result.operations.written = totalWrites;
    result.operations.skipped = totalSkips;

    if (totalWrites === 0) {
      result.message = 'No new drops to add.';
    } else {
      result.message = `${dryRun ? '[DRY RUN] Would have written' : 'Successfully wrote'} ${totalWrites} drop items across ${collectionsToSeed.length} collections.`;
    }

    if (!dryRun && totalWrites > 0) {
      await batch.commit();
    }

  } catch (error: any) {
    result.success = false;
    result.message = `An error occurred while seeding drops: ${error.message}`;
    console.error('Error seeding drops:', error);
  }

  return result;
}
