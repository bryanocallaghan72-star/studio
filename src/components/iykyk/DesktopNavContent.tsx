
// In src/components/iykyk/DesktopNavContent.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useUser } from '@/firebase';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/iykyk/sidebar';
import {
  Home,
  MessageCircle,
  PlayCircle,
  Users,
  Flame,
  User,
  Trophy,
  Coffee,
} from 'lucide-react';
import { useBondiBingoHighlight } from '@/hooks/useBondiBingoHighlight';
import { useMatchaBingoHighlight } from '@/hooks/useMatchaBingoHighlight';
import { cn } from '@/lib/utils';

export function DesktopNavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const isBondiBingoLive = useBondiBingoHighlight();
  const isMatchaBingoLive = useMatchaBingoHighlight();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures that any code depending on browser-specific APIs
    // like `window` or `searchParams` runs only on the client side.
    setIsClient(true);
  }, []);


  // The Profile link is dynamic. It goes to the user's page if logged in,
  // or to the login page if not.
  const profileHref = user ? `/profile/${user.uid}` : '/login';

  const navItems = [
    { href: '/discover', icon: Home, label: 'Discover' },
    { href: '/feed', icon: MessageCircle, label: 'Feed' },
    { href: '/reels', icon: PlayCircle, label: 'Reels' },
    { href: '/social', icon: Users, label: 'Social' },
    { href: '/fire', icon: Flame, label: 'Fire' },
    { href: '/bingo', icon: Trophy, label: 'Bondi Bingo', isHighlighted: isBondiBingoLive, highlightClass: 'shadow-[0_0_15px_hsl(var(--primary))]' },
    { href: '/bingo?game=matcha-ultra-bondi', icon: Coffee, label: 'Matcha Bingo', isHighlighted: isMatchaBingoLive, highlightClass: 'shadow-[0_0_15px_rgba(134,239,172,0.8)]' },
    // Use a unique key for the profile item to avoid conflicts
    { href: profileHref, icon: User, label: 'Profile', key: 'profile' },
  ];
  
  // Determine if the active path is a profile page
  const isProfileActive = pathname.startsWith('/profile');
  const isBingoActive = pathname === '/bingo';
  
  // Safely get the current game from searchParams
  const currentGame = isClient ? searchParams.get('game') : null;

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        // Special check for the profile link's active state
        let isActive = item.key === 'profile' ? isProfileActive : pathname === item.href;

        if (item.label.includes('Bingo')) {
            const gameType = new URLSearchParams(item.href.split('?')[1] || '').get('game');
            // Only perform this check on the client
            if (isClient) {
              isActive = isBingoActive && gameType === currentGame;
            } else {
              isActive = false; // Default to false on the server
            }
        }

        return (
          <SidebarMenuItem key={item.key || item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={item.label}
              className={cn(
                item.isHighlighted && `${item.highlightClass} animate-pulse`
              )}
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
