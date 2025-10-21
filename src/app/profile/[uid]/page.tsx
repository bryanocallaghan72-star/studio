
import { ProfilePageClient } from '@/components/iykyk/ProfilePageClient';
import { notFound } from 'next/navigation';

// This is now a Server Component
export default function ProfilePage({ params }: { params: { uid: string }}) {
  const { uid } = params;

  if (!uid) {
    notFound();
  }

  // We pass the uid to the client component, which will handle the data fetching.
  // In a setup with a server-side Firebase Admin SDK, we would fetch the data here
  // and pass the full userProfile object as a prop.
  return <ProfilePageClient uid={uid} />;
}
