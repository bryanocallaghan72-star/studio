import { Logo } from "./Logo";


export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center gap-2">
            <Logo className="h-8 w-8"/>
          <h1 className="font-headline text-2xl font-extrabold tracking-tighter text-primary">
            iykyk
          </h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <p className="hidden text-sm text-muted-foreground md:inline-block">Real-Time Cultural Portal</p>
        </div>
      </div>
    </header>
  );
}
