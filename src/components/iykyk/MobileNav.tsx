'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Flame, PlaySquare, User, Compass, Code } from "lucide-react";

import { cn } from "@/lib/utils";
import { useUser } from "@/firebase/auth/use-user";

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useUser();

  const profileHref = user ? `/profile/${user.uid}` : '/profile/shannon';

  const links = [
    { href: "/feed", icon: Home, label: "Feed" },
    { href: "/reels", icon: PlaySquare, label: "Reels" },
    { href: "/discover", icon: Compass, label: "iykyk" },
    { href: "/social", icon: Users, label: "Social" },
    { href: "/fire", icon: Flame, label: "Fire" },
    { href: profileHref, icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background md:hidden">
      <div className="grid h-16 max-w-full grid-cols-6">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex flex-col items-center justify-center gap-1 p-2 text-xs font-medium transition-colors hover:bg-secondary/50",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label === "iykyk" ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <link.icon className="h-5 w-5" />
                </div>
              ) : (
                <link.icon className="h-6 w-6" />
              )}
              <span className={cn("text-[10px]", isActive && "font-bold")}>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
