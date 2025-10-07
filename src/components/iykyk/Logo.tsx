import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("text-primary", className)}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      <path
        fill="url(#logoGradient)"
        stroke="none"
        d="M12.0001 22.25C12.0001 22.25 2.75009 15.5 2.75009 9.75C2.75009 5.38875 6.38884 1.75 10.7501 1.75C13.5097 1.75 16.012 3.14937 17.6534 5.375C17.4014 5.14938 17.1189 4.9625 16.8107 4.81438C15.467 4.15687 13.9161 3.81625 12.2429 4.02C8.75009 4.4675 6.20572 7.54563 6.25009 11.04C6.28509 13.9031 8.35822 16.4175 11.1876 16.9456C11.5245 17.0094 11.8545 17.0094 12.1876 16.9456C12.0532 16.6431 12.0001 16.3031 12.0001 15.955C12.0001 14.57 13.1113 13.4588 14.5001 13.4588C15.8889 13.4588 17.0001 14.57 17.0001 15.9588C17.0001 16.5331 16.8082 17.0581 16.4907 17.475C18.6657 16.315 20.2501 13.6263 20.2501 10.5C20.2501 10.2356 20.2326 9.975 20.2014 9.71813C20.8801 10.9381 21.2501 12.3331 21.2501 13.75C21.2501 15.5 20.2501 22.25 12.0001 22.25Z"
      />
      <path
        fill="none"
        stroke="hsl(var(--background))"
        strokeOpacity="0.5"
        d="M12.0001 16.9456C11.5245 17.0094 11.8545 17.0094 11.1876 16.9456C8.35822 16.4175 6.28509 13.9031 6.25009 11.04C6.20572 7.54563 8.75009 4.4675 12.2429 4.02C13.9161 3.81625 15.467 4.15687 16.8107 4.81438"
      />
    </svg>
  );
};
