import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 50"
      className={cn(className)}
      aria-label="iykyk logo"
    >
      <defs>
        <linearGradient id="iconGradient" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      
      {/* Icon Path */}
      <path 
        d="M25 2C12.3 2 2 12.3 2 25s10.3 23 23 23c4.8 0 9.3-1.5 13-4.1.5-.4.9-.8 1.3-1.2-4.2-3.2-7-8.1-7-13.7 0-9.4 7.6-17 17-17 .7 0 1.5.1 2.2.2C47.2 6.4 36.7 2 25 2zm0 10c-3.9 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7z"
        fill="url(#iconGradient)"
      />
      <path 
        d="M25,21c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S27.2,21,25,21z"
        fill="white"
      />

      {/* Text */}
      <text 
        x="58" 
        y="37" 
        fontFamily="var(--font-poppins), sans-serif"
        fontSize="34" 
        fontWeight="800"
        letterSpacing="-0.05em"
        fill="hsl(var(--primary))"
      >
        iykyk
      </text>
    </svg>
  );
};
