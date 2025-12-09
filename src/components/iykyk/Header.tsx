
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CircleUser,
  Menu,
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
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

function HeaderClientContent() {
  const { user } = useUser();
  const auth = useAuth();

  const handleSignOut = () => {
    if (auth) {
        signOut(auth);
    }
  }

  return (
    <>
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
    </>
  );
}


export function Header() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
    )}>
        <Link href="/discover" className="flex items-center gap-2 font-semibold">
          <Logo />
          <span className="text-lg font-bold">iykyk</span>
        </Link>
        {isClient && <HeaderClientContent />}
    </header>
  );
}
