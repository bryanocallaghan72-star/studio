// In src/components/iykyk/DesktopNavContent.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/iykyk/sidebar';
import {
  Home,
  MessageCircle,
  Users,
  Flame,
  User,
  Dumbbell,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DesktopNavContent() {
  const pathname = usePathname();
  const { user } = useUser();

  // The Profile link is dynamic. It goes to the user's page if logged in,
  // or to the login page if not.
  const profileHref = user ? `/profile/${user.uid}` : '/auth';

  const navItems = [
    { href: '/discover', icon: Home, label: 'Discover' },
    { href: '/feed', icon: MessageCircle, label: 'Feed' },
    { href: '/social', icon: Users, label: 'Social' },
    { href: '/fire', icon: Flame, label: 'Fire' },
    { href: '/active', icon: Dumbbell, label: 'Active' },
    // Use a unique key for the profile item to avoid conflicts
    { href: profileHref, icon: User, label: 'Profile', key: 'profile' },
  ];
  
  // Determine if the active path is a profile page
  const isProfileActive = pathname.startsWith('/profile');

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        // Special check for the profile link's active state
        let isActive = item.key === 'profile' ? isProfileActive : pathname === item.href;

        return (
          <SidebarMenuItem key={item.key || item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5" />
                <span className="sr-only">{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
