
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
 * Now optimized to skip writes if the profile already exists.
 * 
 * @param firestore - The Firestore instance.
 * @param user - The Firebase Auth user object.
 * @returns A promise that resolves when the profile check/creation task is complete.
 */
export async function updateUserProfile(firestore: Firestore, user: User) {
  const userDocRef = doc(firestore, 'users', user.uid);
  
  try {
    const userSnap = await getDoc(userDocRef);
    
    // If the profile already exists, we skip the write entirely to save time/cost
    if (userSnap.exists()) {
      return;
    }

    // creation logic only for new users
    const username = user.displayName || user.email?.split('@')[0] || `user_${user.uid.substring(0, 5)}`;
    
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

    // Note: We use await here because this function itself is usually called 
    // as a background task, but we want the internal task to be reliable.
    await setDoc(userDocRef, profileData);
  } catch (error) {
    // Log silently as requested, so as not to interrupt the user session
    console.warn("Background profile sync task failed:", error);
  }
}
