'use client';

import {
  doc,
  setDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { User } from 'firebase/auth';

/**
 * Creates a simple, human-readable referral code from a username.
 * Example: 'john-doe-123' -> 'JOHNDOE123'
 * @param username The user's username.
 * @returns A unique-enough referral code.
 */
const createRefCode = (username: string) => {
  const base = username.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${base}${randomSuffix}`;
}

/**
 * Creates or updates a user's profile document in Firestore.
 * This is a non-blocking operation.
 * @param firestore - The Firestore instance.
 * @param user - The Firebase Auth user object.
 */
export function updateUserProfile(firestore: Firestore, user: User) {
  const userDocRef = doc(firestore, 'users', user.uid);
  
  let profileData: {
      email?: string;
      username: string;
      refCode: string;
      createdAt: any;
  };

  if (user.email) {
    // User has an email
    const username = user.email.split('@')[0];
    profileData = {
      email: user.email,
      username: username,
      refCode: createRefCode(username),
      createdAt: serverTimestamp(),
    };
  } else {
    // Anonymous user, do not include email field
    const username = `user${user.uid.substring(0, 6)}`;
    profileData = {
      username: username,
      refCode: createRefCode(username),
      createdAt: serverTimestamp(),
    };
  }

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
