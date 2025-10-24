
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Bot, Github, Sparkles, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';

function LandingPageContent() {
  const { user, isUserLoading } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderAuthButton = () => {
    if (isUserLoading) {
      return <div className="h-10 w-48" />; // Placeholder for loading state
    }

    if (user) {
      return (
        <Button asChild variant="link" className="text-muted-foreground">
          <Link href={`/profile/${user.uid}`}>View Your Profile</Link>
        </Button>
      );
    }

    return (
      <Button asChild variant="link" className="text-muted-foreground">
        <Link href="/login">Log In or Sign Up</Link>
      </Button>
    );
  };

  if (!isClient) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center"
      >
        <Sparkles className="mx-auto h-16 w-16 text-primary animate-pulse" />
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Welcome to iykyk
        </h1>
      </motion.div>

      <motion.p
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground"
      >
        Your real-time cultural portal to Bondi. A quirky, game-like travel buddy for tourists, a monetization funnel for creators, and a discovery engine for locals.
      </motion.p>
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6"
      >
        <Button asChild size="lg">
          <Link href="/discover">
            Start Exploring <ArrowRight className="ml-2" />
          </Link>
        </Button>
        {renderAuthButton()}
      </motion.div>
    </div>
  );
}


export default function Home() {
  return <LandingPageContent />;
}
