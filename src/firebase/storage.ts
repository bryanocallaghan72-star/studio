'use client';

import { getStorage } from 'firebase/storage';
import { useFirebase } from '@/firebase';

/**
 * Hook to access the Firebase Storage instance.
 * @returns The initialized Firebase Storage instance.
 */
export function useStorage() {
  const { firebaseApp } = useFirebase();
  return getStorage(firebaseApp);
}
