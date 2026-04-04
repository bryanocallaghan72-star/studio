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
import { cn } from '@/lib/utils';
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.04] bg-[#080a0d] px-2 py-3 backdrop-blur-md md:hidden">
      <div className="grid h-full max-w-lg grid-cols-6 mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex flex-col items-center justify-center p-2 rounded-lg transition-colors"
            >
              <item.icon 
                className="h-6 w-6 transition-colors duration-300" 
                style={{ color: isActive ? 'var(--phase-accent)' : 'rgba(244, 240, 232, 0.2)' }}
              />
              {isActive && (
                <div 
                  className="absolute -bottom-1 h-1 w-1 rounded-full animate-in fade-in zoom-in duration-500"
                  style={{ backgroundColor: 'var(--phase-accent)' }}
                />
              )}
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
        <Link
          href={profileHref}
          className="relative flex flex-col items-center justify-center p-2 rounded-lg transition-colors"
        >
          <User 
            className="h-6 w-6 transition-colors duration-300"
            style={{ color: isProfileActive ? 'var(--phase-accent)' : 'rgba(244, 240, 232, 0.2)' }}
          />
          {isProfileActive && (
            <div 
              className="absolute -bottom-1 h-1 w-1 rounded-full animate-in fade-in zoom-in duration-500"
              style={{ backgroundColor: 'var(--phase-accent)' }}
            />
          )}
          <span className="sr-only">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
