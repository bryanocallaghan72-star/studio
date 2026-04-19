
'use client';

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
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
 * Ensures a user's profile document exists in Firestore.
 * This is an atomic, blocking operation.
 * 
 * @param firestore - The Firestore instance.
 * @param user - The Firebase Auth user object.
 * @returns A promise that resolves when the profile is guaranteed to exist.
 */
export async function updateUserProfile(firestore: Firestore, user: User) {
  const userDocRef = doc(firestore, 'users', user.uid);
  
  try {
    const userSnap = await getDoc(userDocRef);
    
    // Determine identity data
    const username = user.displayName || user.email?.split('@')[0] || `user_${user.uid.substring(0, 5)}`;
    
    if (!userSnap.exists()) {
      // Creation Case: Initialize all required fields for a new user
      const profileData = {
        id: user.uid,
        email: user.email || null,
        username: username,
        refCode: createRefCode(username),
        avatarUrl: user.photoURL || null,
        followerCount: 0,
        followingCount: 0,
        isCreator: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(userDocRef, profileData);
    } else {
      // Sync Case: Ensure non-immutable fields like avatar are current
      await setDoc(userDocRef, {
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }
  } catch (error) {
    console.error("Critical error ensuring user profile:", error);
    throw error; // Re-throw to allow the UI to handle blocking/error states
  }
}
