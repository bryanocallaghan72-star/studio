'use client';

import { AuthScreen } from '@/components/auth/AuthScreen';

/**
 * @fileOverview Auth Page - The cinematic entry point for IYKYK.
 * Handles Google, Apple, and Email authentication flows.
 */
export default function AuthPage() {
  return (
    <div className="no-nav">
      <AuthScreen />
    </div>
  );
}
