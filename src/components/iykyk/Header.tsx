
import { Logo } from "./Logo";
import Link from "next/link";


export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/discover" className="mr-4 flex items-center gap-2">
            <Logo className="h-6 w-6"/>
            <span className="text-xl font-bold tracking-tighter text-primary">iykyk</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <p className="hidden text-sm text-muted-foreground md:inline-block">Real-Time Cultural Portal</p>
        </div>
      </div>
    </header>
  );
}
