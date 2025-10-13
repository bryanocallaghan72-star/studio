'use client';

import {
  doc,
  setDoc,
  type Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { User } from 'firebase/auth';

/**
 * Creates or updates a user's profile document in Firestore.
 * This is a non-blocking operation.
 * @param firestore - The Firestore instance.
 * @param user - The Firebase Auth user object.
 */
export function updateUserProfile(firestore: Firestore, user: User) {
  const userDocRef = doc(firestore, 'users', user.uid);
  const profileData = {
    email: user.email,
    username: user.email ? user.email.split('@')[0] : 'anonymous_user',
    // Add other default fields here as needed
  };

  // Use setDoc with { merge: true } to create or update without overwriting
  setDoc(userDocRef, profileData, { merge: true })
    .catch((error) => {
      console.error("Error creating/updating user profile:", error);
      // Optional: Emit a more specific error if needed
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'write',
          requestResourceData: profileData,
        })
      );
    });
}
