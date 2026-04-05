'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  MessageCircle,
  Users,
  Flame,
  User,
  Dumbbell,
} from 'lucide-react';
import { useUser } from '@/firebase';

const navItems = [
  { href: '/discover', icon: Home, label: 'Discover' },
  { href: '/feed', icon: MessageCircle, label: 'Feed' },
  { href: '/social', icon: Users, label: 'Social' },
  { href: '/fire', icon: Flame, label: 'Fire' },
  { href: '/active', icon: Dumbbell, label: 'Active' },
];

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useUser();

  const profileHref = user ? `/profile/${user.uid}` : '/login';
  const isProfileActive = pathname.startsWith('/profile');

  // Combine items for a unified rendering logic
  const allItems = [
    ...navItems,
    { href: profileHref, icon: User, label: 'Profile', isProfile: true }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[rgba(0,0,0,0.06)] bg-[#f2ece0] h-[64px] md:hidden">
      <div className="grid h-full max-w-lg grid-cols-6 mx-auto">
        {allItems.map((item) => {
          const isActive = 'isProfile' in item 
            ? isProfileActive 
            : pathname === item.href;
          
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center h-full"
            >
              <div className="flex flex-col items-center justify-center">
                <Icon 
                  className="h-6 w-6 transition-colors duration-200" 
                  style={{ color: isActive ? '#c4762a' : 'rgba(26,18,8,0.25)' }}
                />
                <div className="h-1 mt-1">
                  {isActive && (
                    <div 
                      className="w-1 h-1 rounded-full bg-[#c4762a] animate-in fade-in zoom-in duration-300"
                    />
                  )}
                </div>
              </div>
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
