// In src/components/iykyk/sidebar.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-background sm:flex">
      <TooltipProvider>{children}</TooltipProvider>
    </aside>
  );
}

export function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">{children}</nav>;
}

export function SidebarFooter({ children }: { children: React.ReactNode }) {
    return <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">{children}</nav>;
}

export function SidebarMenuItem({ children }: { children: React.ReactNode }) {
    return <div className="relative">{children}</div>;
}


interface SidebarMenuButtonProps {
    href: string;
    label: string;
    icon: React.ElementType;
    isActive: boolean;
    asChild?: boolean;
    tooltip: string | React.ReactNode;
}

export const SidebarMenuButton = React.forwardRef<
    HTMLAnchorElement,
    Omit<React.ComponentProps<typeof Link>, 'href'> & SidebarMenuButtonProps
>(({ href, label, icon: Icon, isActive, className, tooltip, ...props }, ref) => {
    return (
        <Tooltip>
        <TooltipTrigger asChild>
            <Link
            href={href}
            ref={ref}
            className={cn(
                buttonVariants({ variant: isActive ? 'default' : 'ghost', size: 'icon' }),
                'rounded-lg',
                className
            )}
            {...props}
            >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{label}</span>
            </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{tooltip}</TooltipContent>
        </Tooltip>
    );
});
SidebarMenuButton.displayName = 'SidebarMenuButton';
