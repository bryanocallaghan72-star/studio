// In app/layout.tsx

import type {Metadata} from 'next';
import './globals.css'; // <-- This fixes your styling
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase/client-provider'; // <-- This fixes the crash
import { DesktopNav } from '@/components/iykyk/DesktopNav';
import { cn } from '@/lib/utils';
import { ThemeApplier } from '@/components/ThemeApplier';

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
            <div className="md:flex">
              <DesktopNav />
              <main className="flex-1 md:pl-16">
                {children}
              </main>
            </div>
          </ThemeApplier>
        </FirebaseClientProvider>
          <Toaster />
      </body>
    </html>
  );
}
