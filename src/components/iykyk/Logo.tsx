import { Flame } from 'lucide-react';
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Flame className={cn("text-primary", className)} />
  );
};
