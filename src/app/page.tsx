
'use client';

import { useTransition, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

const LandingPage = () => {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEnter = () => {
    startTransition(() => {
      router.push('/discover');
    });
  };

  if (!isClient) {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background text-center p-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const renderAuthButton = () => {
    if (isUserLoading) {
      return (
        <Button variant="link" className="text-muted-foreground" disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </Button>
      );
    }

    if (user) {
      return (
        <Button asChild variant="link" className="text-muted-foreground">
          <Link href={`/profile/${user.uid}`}>
            View Your Profile
          </Link>
        </Button>
      );
    }

    return (
      <Button asChild variant="link" className="text-muted-foreground">
        <Link href="/login">
          Log In or Sign Up
        </Link>
      </Button>
    );
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background text-center p-4">
      <div className="z-10 flex flex-col items-center gap-4">
        <motion.div
          className="text-center"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-foreground">
            iykyk
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Bondi
          </h2>
        </motion.div>

        <motion.p
          className="mt-6 max-w-md text-lg text-muted-foreground"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Go where the locals go. No reviews. No ads. Just real recommendations.
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-4 mt-10"
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.6 }}
        >
          <Button
            size="lg"
            className="rounded-full text-lg font-bold shadow-lg px-12 py-7 transition-all duration-300 ease-in-out hover:scale-105 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleEnter}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Entering...
              </>
            ) : (
              'Enter Bondi'
            )}
          </Button>
          {renderAuthButton()}
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
