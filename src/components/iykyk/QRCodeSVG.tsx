
import { cn } from "@/lib/utils";

export const QRCodeSVG = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={cn("shape-rendering:crispEdges", className)}
      aria-label="Placeholder QR Code"
    >
      <rect width="256" height="256" fill="#FFFFFF" />
      <rect x="32" y="32" width="64" height="64" fill="#000000" />
      <rect x="44" y="44" width="40" height="40" fill="#FFFFFF" />
      <rect x="52" y="52" width="24" height="24" fill="#000000" />
      <rect x="160" y="32" width="64" height="64" fill="#000000" />
      <rect x="172" y="44" width="40" height="40" fill="#FFFFFF" />
      <rect x="180" y="52" width="24" height="24" fill="#000000" />
      <rect x="32" y="160" width="64" height="64" fill="#000000" />
      <rect x="44" y="172" width="40" height="40" fill="#FFFFFF" />
      <rect x="52" y="180" width="24" height="24" fill="#000000" />
      <g>
        <rect x="112" y="32" width="8" height="8" fill="#000000" />
        <rect x="128" y="32" width="8" height="8" fill="#000000" />
        <rect x="144" y="40" width="8" height="8" fill="#000000" />
        <rect x="104" y="48" width="8" height="8" fill="#000000" />
        <rect x="120" y="56" width="8" height="8" fill="#000000" />
        <rect x="104" y="64" width="8" height="8" fill="#000000" />
        <rect x="144" y="64" width="8" height="8" fill="#000000" />
        <rect x="112" y="72" width="8" height="8" fill="#000000" />
        <rect x="128" y="72" width="8" height="8" fill="#000000" />
        <rect x="104" y="80" width="8" height="8" fill="#000000" />
        <rect x="120" y="88" width="8" height="8" fill="#000000" />
        <rect x="136" y="88" width="8" height="8" fill="#0000_00" />
        <rect x="32" y="112" width="8" height="8" fill="#000000" />
        <rect x="48" y="112" width="8" height="8" fill="#000000" />
        <rect x="64" y="112" width="8" height="8" fill="#000000" />
        <rect x="80" y="112" width="8" height="8" fill="#000000" />
        <rect x="32" y="128" width="8" height="8" fill="#000000" />
        <rect x="80" y="128" width="8" height="8" fill="#000000" />
        <rect x="32" y="144" width="8" height="8" fill="#000000" />
        <rect x="56" y="144" width="8" height="8" fill="#000000" />
        <rect x="80" y="144" width="8" height="8" fill="#000000" />
        <rect x="160" y="112" width="8" height="8" fill="#000000" />
        <rect x="176" y="112" width="8" height="8" fill="#000000" />
        <rect x="192" y="112" width="8" height="8" fill="#000000" />
        <rect x="208" y="112" width="8" height="8" fill="#000000" />
        <rect x="160" y="128" width="8" height="8" fill="#000000" />
        <rect x="208" y="128" width="8" height="8" fill="#000000" />
        <rect x="160" y="144" width="8" height="8" fill="#000000" />
        <rect x="184" y="144" width="8" height="8" fill="#000000" />
        <rect x="208" y="144" width="8" height="8" fill="#000000" />
        <rect x="112" y_ ="160" width="8" height="8" fill="#000000" />
        <rect x="128" y="160" width="8" height="8" fill="#000000" />
        <rect x="144" y="168" width="8" height="8" fill="#000000" />
        <rect x="104" y="176" width="8" height="8" fill="#000000" />
        <rect x="120" y="184" width="8" height="8" fill="#000000" />
        <rect x="104" y="192" width="8" height="8" fill="#000000" />
        <rect x="144" y="192" width="8" height="8" fill="#000000" />
        <rect x="112" y="200" width="8" height="8" fill="#000000" />
        <rect x="128" y="200" width="8" height="8" fill="#000000" />
        <rect x="160" y="176" width="8" height="8" fill="#000000" />
        <rect x="176" y="184" width="8" height="8" fill="#000000" />
        <rect x="192" y="192" width="8" height="8" fill="#000000" />
        <rect x="208" y="200" width="8" height="8" fill="#000000" />
      </g>
    </svg>
  );
};
