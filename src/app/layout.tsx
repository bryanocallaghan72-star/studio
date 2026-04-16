// In app/layout.tsx

import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { cn } from '@/lib/utils';
import { DemoTimeProvider } from '@/context/DemoTimeContext';
import GodModeButton from '@/components/iykyk/GodModeButton';
import { BottomNav } from '@/components/layout/BottomNav';

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
      <body className={cn(inter.variable, "font-body antialiased")}>
        <FirebaseClientProvider>
          <DemoTimeProvider>
            <div className="flex min-h-screen w-full flex-col bg-background">
              <main className="flex-1 flex flex-col">
                {children}
              </main>
              <BottomNav />
            </div>
            <GodModeButton />
          </DemoTimeProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
