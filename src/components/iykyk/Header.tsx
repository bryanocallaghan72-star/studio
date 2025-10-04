import { Flame } from "lucide-react";

const QuirkyLogo = () => (
    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <span className="text-sm font-bold -rotate-12">i</span>
        <span className="text-sm font-bold rotate-12">y</span>
        <span className="text-sm font-bold -rotate-6">k</span>
        <span className="text-sm font-bold rotate-6">y</span>
        <span className="text-sm font-bold">k</span>
    </div>
);


export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center gap-2">
            <Flame className="h-8 w-8 text-primary"/>
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
