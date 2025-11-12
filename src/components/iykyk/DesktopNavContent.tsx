// In src/components/iykyk/DesktopNavContent.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/iykyk/sidebar';
import {
  Home,
  Calendar,
  Map,
  Compass,
  MessageCircle,
  Flame,
  Tag,
  Users,
  Code,
  Shirt,
  Bed,
  Sparkles,
} from 'lucide-react';

// This is the list of links from your old DesktopNav
const navItems = [
  { href: '/discover', icon: Home, label: 'Discover' },
  { href: '/my-day', icon: Calendar, label: 'My Day' },
  { href: '/map', icon: Map, label: 'Vibe Map' },
  { href: '/flow', icon: Compass, label: 'Flow' },
  { href: '/feed', icon: MessageCircle, label: 'Feed' },
  { href: '/fire', icon: Flame, label: 'Fire' },
  { href: '/deals', icon: Tag, label: 'Deals' },
  { href: '/social', icon: Users, label: 'Social' },
  { href: '/code', icon: Code, label: 'Code' },
  { href: '/style', icon: Shirt, label: 'Style' },
  { href: '/stays', icon: Bed, label: 'Stays' },
  { href: '/flash-stays', icon: Sparkles, label: 'Flash Stays' },
];

export function DesktopNavContent() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={item.label}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
