'use client';

import { useUser } from '@/firebase';
import { ProfilePageClient } from '@/components/iykyk/ProfilePageClient';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProfileSkeleton = () => (
  <div className="flex min-h-screen w-full flex-col bg-[#f2ece0] p-4 md:p-6 pb-32">
    <main className="flex flex-1 flex-col gap-8 max-w-lg mx-auto w-full">
      <div className="space-y-0">
        <div className="relative h-32 w-full rounded-t-3xl bg-[#e8e0d0] animate-pulse" />
        <div className="bg-white border-x border-b border-black/[0.06] rounded-b-3xl p-6 relative">
          <div className="absolute -top-12 left-6">
            <div className="h-24 w-24 rounded-full border-[6px] border-white bg-[#e8e0d0] animate-pulse shadow-lg" />
          </div>
          <div className="mt-12 space-y-3">
            <div className="h-6 w-40 rounded bg-[#e8e0d0] animate-pulse" />
            <div className="h-3 w-24 rounded bg-[#e8e0d0] animate-pulse" />
            <div className="h-4 w-full rounded bg-[#e8e0d0] animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-[#e8e0d0] animate-pulse" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-[88px] rounded-2xl bg-[#e8e0d0] animate-pulse" />
        <div className="h-[88px] rounded-2xl bg-[#e8e0d0] animate-pulse" />
      </div>
    </main>
  </div>
);

export default function MePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return null;
  }

  return <ProfilePageClient uid={user.uid} />;
}
