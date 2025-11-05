
// src/app/profile/[uid]/page.tsx
import { DesktopNav } from '@/components/iykyk/DesktopNav';
import { MobileNav } from '@/components/iykyk/MobileNav';
import { ProfilePageClient } from '@/components/iykyk/ProfilePageClient';

export default function ProfilePage({ params }: { params: { uid: string } }) {
  const { uid } = params;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="md:flex">
        <DesktopNav />
        <main className="flex-1 md:pl-16">
            <ProfilePageClient uid={uid} />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
