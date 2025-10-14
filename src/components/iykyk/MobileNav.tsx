
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Flame, PlaySquare, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useUser();

  const links = [
    { href: "/discover", icon: Home, label: "Home" },
    { href: "/feed", icon: Flame, label: "Feed" },
    { href: "/reels", icon: PlaySquare, label: "Reels" },
    { href: "/community", icon: Users, label: "Community" },
    { href: user ? `/profile/${user.uid}` : "/login", icon: User, label: "Profile" },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background md:hidden">
      <div className="grid max-w-md grid-cols-5 gap-2 p-3 mx-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col h-14 items-center justify-center rounded-md p-2 text-xs font-medium transition-colors hover:bg-secondary/50 gap-1",
              pathname === link.href ? "text-primary" : "text-muted-foreground",
            )}
          >
            <link.icon className="h-6 w-6" />
            <span className="">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
