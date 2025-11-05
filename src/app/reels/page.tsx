

import { Reels } from "@/components/iykyk/Reels";
import { FirebaseClientProvider } from "@/firebase/client-provider";

export default function ReelsPage() {
  return (
      <FirebaseClientProvider>
        <div className="bg-black h-screen w-full">
          <Reels />
        </div>
      </FirebaseClientProvider>
  );
}
