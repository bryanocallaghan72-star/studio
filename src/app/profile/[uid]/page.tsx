
// src/app/profile/[uid]/page.tsx
import { ProfilePageClient } from '@/components/iykyk/ProfilePageClient';

export default function ProfilePage({ params }: { params: { uid: string } }) {
  const { uid } = params;

  return (
      <ProfilePageClient uid={uid} />
  );
}
