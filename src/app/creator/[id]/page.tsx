import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreatorProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-6 pb-24">
        <Card>
          <CardHeader>
            <CardTitle>Creator: {params.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is the profile page for the creator. Content coming soon!</p>
          </CardContent>
        </Card>
      </main>
      <MobileNav />
    </div>
  );
}
