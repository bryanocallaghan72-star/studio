'use client';
import {
  Auth,
  UserCredential,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { updateUserProfile } from './auth/user-profile';

const handleNewUser = (credential: UserCredential, authInstance: Auth) => {
    const user = credential.user;
    const metadata = user.metadata;
    // Check if the user is new by comparing creation time and last sign-in time.
    // A small tolerance (e.g., 5 seconds) can account for minor clock differences.
    if (metadata.creationTime && metadata.lastSignInTime &&
        new Date(metadata.lastSignInTime).getTime() - new Date(metadata.creationTime).getTime() < 5000) {
      if (authInstance.firestore) {
        updateUserProfile(authInstance.firestore, user);
      }
    }
}


/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance)
    .then(credential => {
        handleNewUser(credential, authInstance);
    })
    .catch(error => {
        console.error("Anonymous sign-in error:", error);
    });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .then(credential => {
        // This is always a new user, so we directly call updateUserProfile.
        if (credential.user && authInstance.firestore) {
            updateUserProfile(authInstance.firestore, credential.user);
        }
    })
    .catch(error => {
        // This will be caught by onAuthStateChanged listeners if they have an error handler
        console.error("Sign-up error:", error);
    });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  signInWithEmailAndPassword(authInstance, email, password)
    // No need to check for profile on standard sign-in.
    // Auth state listeners will handle UI updates.
    .catch(error => {
        // This will be caught by onAuthStateChanged listeners if they have an error handler
        console.error("Sign-in error:", error);
    });
}
