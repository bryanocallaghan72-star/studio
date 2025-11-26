
// src/app/profile/[uid]/page.tsx
import { ProfilePageClient } from '@/components/iykyk/ProfilePageClient';

export default async function ProfilePage({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params;

  return (
      <ProfilePageClient uid={uid} />
  );
}
