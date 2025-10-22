// src/app/profile/[uid]/page.tsx
import { ProfilePageClient } from '@/components/iykyk/ProfilePageClient';

export default function ProfilePage({ params }: { params: { uid: string } }) {
  const { uid } = params;

  // This Server Component passes the dynamic 'uid' from the URL 
  // down to the Client Component that handles the rendering.
  return <ProfilePageClient uid={uid} />;
}
