'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Augment the Auth interface to include Firestore
declare module 'firebase/auth' {
  interface Auth {
    firestore: Firestore;
  }
}

// This function now ensures Firebase is only initialized once across the client.
export function initializeFirebase(): { firebaseApp: FirebaseApp; auth: Auth; firestore: Firestore; } {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  // Augment the auth instance with a firestore property
  (auth as Auth).firestore = firestore;

  // Enable offline persistence.
  // This must be done once, before any other Firestore operations.
  // We wrap it in a try/catch to handle cases where it might be called in an environment
  // that doesn't support it or if it's already been enabled (e.g., in another tab).
  try {
    enableIndexedDbPersistence(firestore)
      .catch((err) => {
        if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled in one tab at a a time.
          console.warn('Firestore persistence failed: Multiple tabs open.');
        } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the features required to enable persistence
          console.warn('Firestore persistence failed: Browser does not support persistence.');
        }
      });
  } catch (error) {
    console.error("Error enabling Firestore persistence:", error);
  }

  return {
    firebaseApp: app,
    auth: auth,
    firestore: firestore,
  };
}


export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
export * from './auth/user-profile';
export * from './auth/use-user';