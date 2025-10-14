
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Poppins } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { DesktopNav } from '@/components/iykyk/DesktopNav';
import { cn } from '@/lib/utils';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800']
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
      <body className={cn(poppins.variable, "font-body antialiased")}>
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
