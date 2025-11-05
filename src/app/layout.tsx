
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { cn } from '@/lib/utils';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import { Compass, Home, PlaySquare, Code, Users, Flame, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/iykyk/Logo';
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

const navLinks = [
    { href: "/discover", icon: Compass, label: "Discover" },
    { href: "/feed", icon: Home, label: "Feed" },
    { href: "/reels", icon: PlaySquare, label: "Reels" },
    { href: "/code", icon: Code, label: "Code" },
    { href: "/social", icon: Users, label: "Social" },
    { href: "/fire", icon: Flame, label: "Fire" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, "font-body antialiased")}>
        <ThemeApplier>
          <FirebaseClientProvider>
            <SidebarProvider>
              <Sidebar>
                  <SidebarContent>
                      <SidebarHeader>
                          <div className="flex items-center gap-2">
                            <Logo className="h-6 w-6"/>
                            <span className="text-xl font-bold tracking-tighter text-primary">iykyk</span>
                          </div>
                      </SidebarHeader>
                      <SidebarMenu>
                          {navLinks.map((link) => (
                              <SidebarMenuItem key={link.href}>
                                  <Link href={link.href}>
                                      <SidebarMenuButton tooltip={link.label}>
                                          <link.icon/>
                                          <span>{link.label}</span>
                                      </SidebarMenuButton>
                                  </Link>
                              </SidebarMenuItem>
                          ))}
                      </SidebarMenu>
                      <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Link href="/profile/shannon">
                                      <SidebarMenuButton tooltip="Profile">
                                          <User/>
                                          <span>Profile</span>
                                      </SidebarMenuButton>
                                  </Link>
                            </SidebarMenuItem>
                              <SidebarMenuItem>
                                <Link href="/login">
                                      <SidebarMenuButton tooltip="Logout">
                                          <LogOut/>
                                          <span>Logout</span>
                                      </SidebarMenuButton>
                                  </Link>
                            </SidebarMenuItem>
                        </SidebarMenu>
                      </SidebarFooter>
                  </SidebarContent>
              </Sidebar>
              <SidebarInset>
                <div className="p-4 md:p-6">
                  {children}
                </div>
              </SidebarInset>
            </SidebarProvider>
            <Toaster />
          </FirebaseClientProvider>
        </ThemeApplier>
      </body>
    </html>
  );
}
