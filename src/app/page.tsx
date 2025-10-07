"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-center p-4 transition-colors duration-1000">
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
            <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-foreground">
                iykyk
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Bondi
            </h2>
        </div>
        <div className="mt-6 max-w-md text-lg text-muted-foreground space-y-1">
            <p>Go where the locals go.</p>
            <p>No reviews. No ads. Just real recommendations.</p>
        </div>
        <Link href="/discover" passHref>
          <Button size="lg" className="mt-10 rounded-full text-lg font-bold shadow-2xl px-12 py-4 bg-primary hover:bg-primary/90 text-primary-foreground transform transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95">
            Enter Bondi
          </Button>
        </Link>
      </div>
    </div>
  );
}
