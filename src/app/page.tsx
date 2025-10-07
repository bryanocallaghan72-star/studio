"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-center p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground">
                iykyk
            </h1>
            <p className="text-2xl md:text-3xl font-semibold tracking-tight text-muted-foreground">Bondi</p>
        </div>
        <div className="mt-4 max-w-md text-base text-muted-foreground space-y-1">
            <p>Go where the locals go.</p>
            <p>No reviews. No ads. Just real recommendations.</p>
        </div>
        <Link href="/discover" passHref>
          <Button size="lg" className="mt-8 rounded-full text-lg font-bold shadow-lg bg-[#38B6FF] hover:bg-[#38B6FF]/90 text-white px-10 py-6">
            Enter Bondi
          </Button>
        </Link>
      </div>
    </div>
  );
}
