import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-6 h-6", className)}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#4A90E2', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#00438A', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="url(#logoGradient)" stroke="none" />
      <path d="M7 10.5c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0" stroke="white" strokeWidth="1.5" />
      <path d="M7 12.5c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" />
    </svg>
  );
};
