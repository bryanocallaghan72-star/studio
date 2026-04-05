'use client';

import { useState } from "react";
import { FireFeed } from "@/components/fire/FireFeed";
import { ClaimModal } from "@/components/claim/ClaimModal";

export default function FirePage() {
  const [claimData, setClaimData] = useState<{venue: string, offer: string} | null>(null);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f2ece0] p-4 md:p-6 pb-32">
      <FireFeed onClaim={(venue, offer) => setClaimData({ venue, offer })} />
      
      <ClaimModal
        isOpen={!!claimData}
        onClose={() => setClaimData(null)}
        venueName={claimData?.venue || ''}
        offerText={claimData?.offer || ''}
        source="fire"
      />
    </div>
  );
}
