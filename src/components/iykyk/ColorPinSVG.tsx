
import { cn } from "@/lib/utils";

export const ColorPinSVG = ({ className, color = 'currentColor' }: { className?: string; color?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("drop-shadow-lg", className)}
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill={color} />
      <circle cx="12" cy="10" r="3" fill="white" stroke="none"/>
    </svg>
  );
};
