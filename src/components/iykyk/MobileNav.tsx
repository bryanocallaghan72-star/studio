
"use client";

import { Home, PlaySquare, Compass, Users, Flame, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/feed", icon: Home, label: "Feed" },
  { href: "/reels", icon: PlaySquare, label: "Reels" },
  { href: "/discover", icon: Compass, label: "iykyk" },
  { href: "/community", icon: Users, label: "Community" },
  { href: "/fire", icon: Flame, label: "Fire" },
  { href: "/creator/shannon", icon: User, label: "Profile" },
];

export function MobileNav() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

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
      </div>
    </div>
  );
}
