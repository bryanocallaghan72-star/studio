'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, Flame, Users, User } from 'lucide-react';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useUser();

  // Navigation is hidden on the landing page
  if (pathname === '/') return null;

  const tabs = [
    { label: 'Discover', href: '/discover', icon: Home },
    { label: 'Feed', href: '/feed', icon: MessageSquare },
    { label: 'Fire', href: '/fire', icon: Flame },
    { label: 'Social', href: '/social', icon: Users },
    { label: 'Me', href: user ? `/profile/${user.uid}` : '/auth', icon: User, root: '/profile' },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 h-[83px] pb-[20px] border-t border-black/[0.08] flex items-center justify-around px-4"
      style={{ backgroundColor: 'transparent' }}
    >
      {tabs.map((tab) => {
        const isActive = tab.root ? pathname.startsWith(tab.root) : pathname === tab.href;
        const Icon = tab.icon;

        return (
          <Link
            key={tab.label}
            href={tab.href}
            className="flex flex-col items-center justify-center gap-1 min-w-[64px]"
          >
            <div className="flex flex-col items-center">
              <Icon
                size={22}
                strokeWidth={1.8}
                className="transition-colors duration-200"
                style={{ 
                  color: isActive ? 'var(--phase-accent)' : 'var(--phase-text)',
                  opacity: isActive ? 1 : 0.35 
                }}
              />
              <div className="h-1 mt-1">
                {isActive && (
                  <div 
                    className="w-1 h-1 rounded-full animate-in fade-in zoom-in duration-300" 
                    style={{ backgroundColor: 'var(--phase-accent)' }}
                  />
                )}
              </div>
            </div>
            <span
              className={cn(
                "text-[10px] tracking-tight transition-colors duration-200",
                isActive && "font-semibold"
              )}
              style={{ 
                color: isActive ? 'var(--phase-accent)' : 'var(--phase-text)',
                opacity: isActive ? 1 : 0.4
              }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
