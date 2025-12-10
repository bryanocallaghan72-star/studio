
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-1 backdrop-blur-sm md:hidden">
      <div className="grid h-full max-w-lg grid-cols-6 mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
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
        <Link
          href={profileHref}
          className={cn(
            'group flex flex-col items-center justify-center p-2 rounded-lg transition-colors',
            isProfileActive
              ? 'text-primary'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          )}
        >
          <User className="h-6 w-6" />
          <span className="text-xs font-medium sr-only">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
