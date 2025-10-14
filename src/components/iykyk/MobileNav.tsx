
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, Search, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useUser();

  const links = [
    { href: "/discover", icon: Home, label: "Home" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/new", icon: Plus, label: "New" },
    { href: user ? `/profile/${user.uid}` : "/login", icon: User, label: "Profile" },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background md:hidden">
      <div className="grid max-w-md grid-cols-4 gap-2 p-3 mx-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md p-0 text-sm font-medium transition-colors hover:bg-secondary/50",
              pathname === link.href ? "bg-secondary/50" : "bg-transparent",
            )}
          >
            <link.icon className="h-5 w-5" />
            <span className="sr-only">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
