"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-center p-4">
      <div className="flex flex-col items-center gap-4">
        <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-primary">
          iykyk Bondi
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Go where the locals go. No reviews. No ads. Just real recommendations.
        </p>
        <Link href="/discover" passHref>
          <Button size="lg" className="mt-6 text-lg font-bold shadow-lg">
            Enter Bondi
          </Button>
        </Link>
      </div>
    </div>
  );
}
