import { Home, PlaySquare, Compass, Users, Flame, User } from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "#", icon: Home, label: "Feed" },
  { href: "#", icon: PlaySquare, label: "Reels" },
  { href: "#", icon: Compass, label: "iykyk", active: true },
  { href: "#", icon: Users, label: "Community" },
  { href: "#", icon: Flame, label: "Fire" },
  { href: "#", icon: User, label: "Profile" },
];

export function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t">
      <div className="grid h-full max-w-lg grid-cols-6 mx-auto font-medium">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-secondary ${item.active ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
