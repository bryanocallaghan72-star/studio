
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { DesktopNav } from '@/components/iykyk/DesktopNav';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'iykyk: Your real-time cultural portal to Bondi.',
  description: 'A quirky, game-like travel buddy for tourists, a monetization funnel for creators, and a discovery engine for locals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
         <link rel="preload" href="/_next/static/media/24c595304859a84a-s.p.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className={cn(inter.variable, "font-body antialiased")}>
        <FirebaseClientProvider>
          <div className="md:flex">
            <DesktopNav />
            <main className="flex-1 md:pl-16">
              {children}
            </main>
          </div>
        </FirebaseClientProvider>
          <Toaster />
      </body>
    </html>
  );
}
