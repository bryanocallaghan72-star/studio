
// In app/layout.tsx

import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { MobileNav } from '@/components/iykyk/MobileNav';
import { cn } from '@/lib/utils';
import { Header } from '@/components/iykyk/Header';
// --- Corrected import path ---
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/iykyk/sidebar';
import { DesktopNavContent } from '@/components/iykyk/DesktopNavContent';
import { DemoTimeProvider } from '@/context/DemoTimeContext';
import GodModeButton from '@/components/iykyk/GodModeButton';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'iykyk: Your real-time cultural portal to Bondi.',
  description: 'A quirky, game-like travel buddy for tourists, a monetization funnel for creators, and a discovery engine for locals.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className={cn(inter.variable, "font-body antialiased")}>
        <FirebaseClientProvider>
          <DemoTimeProvider>
            {/* --- This is the new, correct body structure --- */}
            <SidebarProvider>
              <div className="flex min-h-screen w-full flex-col bg-background">
                <div className="md:flex">
                  <Sidebar collapsible="icon">
                    <DesktopNavContent />
                  </Sidebar>
                  <SidebarInset>
                    <main className="flex-1">
                      {/* The ProfilePageClient now includes its own Header */}
                      {/* <Header /> */}
                      <div className="flex-1 p-4 md:p-6 pb-24">
                        {children}
                      </div>
                      <MobileNav /> {/* <-- Moved MobileNav here */}
                    </main>
                  </SidebarInset>
                </div>
              </div>
            </SidebarProvider>
            <GodModeButton />
          </DemoTimeProvider>
        </FirebaseClientProvider>
          <Toaster />
      </body>
    </html>
  );
}
