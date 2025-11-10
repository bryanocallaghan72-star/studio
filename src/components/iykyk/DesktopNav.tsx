'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Flame,
  Map,
  Compass,
  Tag,
  Calendar,
  Users,
  MessageCircle,
  Home,
  Code,
  Shirt,
  Bed,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/discover"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Flame className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">iykyk</span>
          </Link>
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    pathname === item.href && 'bg-accent text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
