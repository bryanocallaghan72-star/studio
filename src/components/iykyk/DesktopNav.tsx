'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Flame, PlaySquare, User, Compass, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase/auth/use-user';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function DesktopNav() {
  const pathname = usePathname();
  const { user } = useUser();

  const profileHref = user ? `/profile/${user.uid}` : '/profile/shannon';

  const links = [
    { href: "/discover", icon: Compass, label: "Discover" },
    { href: "/feed", icon: Home, label: "Feed" },
    { href: "/reels", icon: PlaySquare, label: "Reels" },
    { href: "/code", icon: Code, label: "Code" },
    { href: "/social", icon: Users, label: "Social" },
    { href: "/fire", icon: Flame, label: "Fire" },
    { href: profileHref, icon: User, label: "Profile" },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/discover"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Compass className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">iykyk</span>
          </Link>
          {links.map((link) => (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    (pathname.startsWith(link.href) && link.href !== '/discover') || (pathname === link.href) ? 'bg-accent text-accent-foreground' : ''
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{link.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
