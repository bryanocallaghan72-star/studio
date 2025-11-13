
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
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
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import { useBondiBingoHighlight } from '@/hooks/useBondiBingoHighlight';
import { useMatchaBingoHighlight } from '@/hooks/useMatchaBingoHighlight';

const navItems = [
  { href: '/discover', icon: Home, label: 'Discover' },
  { href: '/feed', icon: MessageCircle, label: 'Feed' },
  { href: '/reels', icon: PlayCircle, label: 'Reels' },
  { href: '/social', icon: Users, label: 'Social' },
  { href: '/fire', icon: Flame, label: 'Fire' },
];

export function MobileNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const isBondiBingoLive = useBondiBingoHighlight();
  const isMatchaBingoLive = useMatchaBingoHighlight();

  const profileHref = user ? `/profile/${user.uid}` : '/login';
  const isProfileActive = pathname.startsWith('/profile');
  
  const isBingoPage = pathname === '/bingo';
  const currentGame = searchParams.get('game');
  const isBondiBingoActive = isBingoPage && !currentGame;
  const isMatchaBingoActive = isBingoPage && currentGame === 'matcha-ultra-bondi';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-1 backdrop-blur-sm md:hidden">
      <div className="grid h-full max-w-lg grid-cols-8 mx-auto">
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
        {/* Render the Bondi Bingo link */}
        <Link
            href="/bingo"
            className={cn(
                'group flex flex-col items-center justify-center p-2 rounded-lg transition-colors relative',
                isBondiBingoActive
                ? 'text-primary'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
            >
            <Trophy className={cn("h-6 w-6 transition-all", isBondiBingoLive && "scale-110")} />
            <span className="text-xs font-medium sr-only">Bondi Bingo</span>
            {isBondiBingoLive && (
                <span className="absolute top-1 right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary/80"></span>
                </span>
            )}
        </Link>
        {/* Render the Matcha Bingo link */}
         <Link
            href="/bingo?game=matcha-ultra-bondi"
            className={cn(
                'group flex flex-col items-center justify-center p-2 rounded-lg transition-colors relative',
                isMatchaBingoActive
                ? 'text-primary'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
            >
            <Coffee className={cn("h-6 w-6 transition-all", isMatchaBingoLive && "scale-110")} />
            <span className="text-xs font-medium sr-only">Matcha Bingo</span>
            {isMatchaBingoLive && (
                <span className="absolute top-1 right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500/80"></span>
                </span>
            )}
        </Link>
        {/* Render the Profile link separately */}
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
