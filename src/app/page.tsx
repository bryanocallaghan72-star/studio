
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background text-center p-4">
      <div className="z-10 flex flex-col items-center gap-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Go where the locals go. No reviews. No ads. Just real recommendations.
        </motion.p>

        <motion.div
            className="flex flex-col items-center gap-4 mt-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.6 }}
        >
            <Link href="/discover" passHref>
                <Button 
                    size="lg" 
                    className="rounded-full text-lg font-bold shadow-lg px-12 py-7 transition-all duration-300 ease-in-out hover:scale-105 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    Enter Bondi
                </Button>
            </Link>
             <Link href="/login" passHref>
                <Button variant="link" className="text-muted-foreground">
                    Log In or Sign Up
                </Button>
            </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
