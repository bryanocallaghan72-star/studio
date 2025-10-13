
"use client";

import { Home, PlaySquare, Compass, Users, Flame, User, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";

const navItems = [
  { href: "/feed", icon: Home, label: "Feed" },
  { href: "/reels", icon: PlaySquare, label: "Reels" },
  { href: "/discover", icon: Compass, label: "iykyk" },
  { href: "/community", icon: Users, label: "Community" },
  { href: "/fire", icon: Flame, label: "Fire" },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user } = useUser();
  const isLandingPage = pathname === "/";

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  }

  if (isLandingPage) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background/80 backdrop-blur-sm border-t">
      <div className="grid h-full max-w-lg grid-cols-6 mx-auto font-medium">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href) && item.href !== '/';
            
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`inline-flex flex-col items-center justify-center px-5 hover:bg-secondary ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <button
                    className={`inline-flex flex-col items-center justify-center px-5 hover:bg-secondary ${
                        pathname.startsWith('/profile') ? "text-primary" : "text-muted-foreground"
                    }`}
                    >
                    <User className="w-5 h-5 mb-1" />
                    <span className="text-xs">Profile</span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" side="top" align="end">
                <DropdownMenuItem asChild>
                    <Link href={user ? `/profile/${user.uid}` : '/login'}>
                        <User className="mr-2 h-4 w-4" />
                        <span>View Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
