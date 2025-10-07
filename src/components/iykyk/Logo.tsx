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
        <linearGradient id="iconGradient" x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor="hsl(var(--accent))" />
          <stop offset="100%" stopColor="hsl(var(--primary))" />
        </linearGradient>
      </defs>
      
      {/* Icon Shape */}
      <path 
        d="M45.6,25c0,12.5-10.1,22.6-22.6,22.6S0.4,37.5,0.4,25S10.5,2.4,23,2.4c6.1,0,11.6,2.4,15.6,6.3 c-3.9-2.3-8.5-3.6-13.4-3.6C11.6,5.1,3.3,14,3.3,25c0,11,8.3,19.9,19.7,19.9c10.5,0,19.2-8,19.7-18.4H45.6z"
        transform="translate(0, 0)"
        fill="url(#iconGradient)"
      />
       <path
        d="M23,12.2c-3.9,0-7,3.1-7,7s3.1,7,7,7s7-3.1,7-7S26.9,12.2,23,12.2z"
        fill="white"
      />

      {/* Text */}
      <text 
        x="55" 
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
