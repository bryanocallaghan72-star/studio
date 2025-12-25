
import dynamic from "next/dynamic";
import { FlowTabsSkeleton } from "@/components/iykyk/FlowTabs";

const FlowTabs = dynamic(
  () => import("@/components/iykyk/FlowTabs").then((mod) => mod.FlowTabs),
  { 
    ssr: false,
    loading: () => <FlowTabsSkeleton />,
  }
);

export default function FlowPage() {
  return <FlowTabs />;
}
