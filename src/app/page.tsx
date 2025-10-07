"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background text-center p-4">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-accent via-primary to-secondary opacity-50 animate-gradient-xy"></div>
      </motion.div>

      <div className="z-10 flex flex-col items-center gap-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-foreground shadow-2xl">
            iykyk
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Bondi
          </h2>
        </motion.div>
        
        <motion.div
          className="mt-6 max-w-md text-lg text-muted-foreground space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p>Go where the locals go.</p>
          <p>No reviews. No ads. Just real recommendations.</p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.6 }}
        >
            <Link href="/discover" passHref>
                <Button 
                    size="lg" 
                    className="mt-10 rounded-full text-lg font-bold shadow-2xl px-12 py-7 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-primary/40"
                >
                    Enter Bondi
                </Button>
            </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
