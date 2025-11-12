'use client';

import Link from 'next/link';
import {
  CircleUser,
  Menu,
  Flame,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useUser } from '@/firebase';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { DesktopNavContent } from './DesktopNavContent';

export function Header() {
  const { user } = useUser();
  const auth = useAuth();

  const handleSignOut = () => {
    if (auth) {
        signOut(auth);
    }
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-transparent px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
        <Sheet>
            <SheetTrigger asChild>
            <Button
                variant="ghost"
                size="icon"
                className="shrink-0 md:hidden"
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
            </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
                <DesktopNavContent />
            </SheetContent>
        </Sheet>
        
        <Link href="/discover" className="flex items-center gap-2 font-semibold">
          <Flame className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">iykyk</span>
        </Link>
        
        <div className="w-full flex-1 flex items-center justify-end gap-4">
            <span className="text-sm text-muted-foreground hidden md:inline">Real-Time Cultural Portal</span>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user ? user.email : 'My Account'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                {user ? (
                    <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
                ) : (
                    <DropdownMenuItem asChild>
                        <Link href="/login">Login</Link>
                    </DropdownMenuItem>
                )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </header>
  );
}
