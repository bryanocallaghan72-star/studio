'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { updateUserProfile } from './auth/user-profile';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance)
    .then(credential => {
        if (credential.user && authInstance.firestore) {
            updateUserProfile(authInstance.firestore, credential.user);
        }
    })
    .catch(error => {
        console.error("Anonymous sign-in error:", error);
    });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .then(credential => {
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
    .then(credential => {
        if (credential.user && authInstance.firestore) {
            updateUserProfile(authInstance.firestore, credential.user);
        }
    })
    .catch(error => {
        // This will be caught by onAuthStateChanged listeners if they have an error handler
        console.error("Sign-in error:", error);
    });
}
