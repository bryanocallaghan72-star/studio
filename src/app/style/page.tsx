
'use client';

import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { StyleList } from "@/components/iykyk/StyleList";
import { DesktopNav } from "@/components/iykyk/DesktopNav";

export default function StylePage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
          <div className="md:flex">
            <DesktopNav />
            <main className="flex-1 md:pl-16">
              <Header />
              <div className="flex-1 p-4 md:p-6 pb-24">
                <StyleList />
              </div>
            </main>
          </div>
          <MobileNav />
        </div>
    );
}
