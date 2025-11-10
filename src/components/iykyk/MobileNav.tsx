'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Flame,
  Map,
  Compass,
  Tag,
  Calendar,
  Users,
  Home,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';

const navItems = [
  { href: '/discover', icon: Home, label: 'Discover' },
  { href: '/my-day', icon: Calendar, label: 'My Day' },
  { href: '/map', icon: Map, label: 'Map' },
  { href: '/feed', icon: MessageCircle, label: 'Feed' },
  { href: '/profile', icon: Users, label: 'Profile' },
];

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useUser();

  const getProfileHref = () => {
    // If the user is logged in, link to their specific profile page.
    // Otherwise, link to the generic login page.
    return user ? `/profile/${user.uid}` : '/login';
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-1 backdrop-blur-sm md:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        {navItems.map((item) => {
          const href = item.label === 'Profile' ? getProfileHref() : item.href;
          // For the profile tab, we check if the pathname starts with /profile/
          // to correctly highlight it for any user's profile page.
          const isActive =
            item.label === 'Profile'
              ? pathname.startsWith('/profile')
              : pathname === href;

          return (
            <Link
              key={item.label}
              href={href}
              className={cn(
                'group flex flex-col items-center justify-center p-2 rounded-lg transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium sr-only">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
