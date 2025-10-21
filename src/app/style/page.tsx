'use client';

import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { StyleList } from "@/components/iykyk/StyleList";

export default function StylePage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
          <Header />
          <main className="flex-1 p-4 md:p-6 pb-24">
            <StyleList />
          </main>
          <MobileNav />
        </div>
    );
}
