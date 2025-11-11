
// In app/layout.tsx

import type {Metadata} from 'next';
import './globals.css'; // <-- This fixes your styling
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase/client-provider'; // <-- This fixes the crash
import { DesktopNav } from '@/components/iykyk/DesktopNav';
import { MobileNav } from '@/components/iykyk/MobileNav';
import { cn } from '@/lib/utils';
import { ThemeApplier } from '@/components/ThemeApplier';
import { Header } from '@/components/iykyk/Header';

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
          <ThemeApplier>
            <div className="flex min-h-screen w-full flex-col bg-background">
              <div className="md:flex">
                <DesktopNav />
                <main className="flex-1 md:pl-16">
                  <Header />
                  <div className="flex-1 p-4 md:p-6 pb-24">
                    {children}
                  </div>
                </main>
              </div>
              <MobileNav />
            </div>
          </ThemeApplier>
        </FirebaseClientProvider>
          <Toaster />
      </body>
    </html>
  );
}
