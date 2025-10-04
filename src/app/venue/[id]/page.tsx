import { Header } from "@/components/iykyk/Header";
import { MobileNav } from "@/components/iykyk/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VenueProfilePage({ params }: { params: { id: string } }) {
  // A simple function to convert slug to title case
  const formatTitle = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-6 pb-24">
        <Card>
          <CardHeader>
            <CardTitle>Venue: {formatTitle(params.id)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is the profile page for the venue. Content coming soon!</p>
          </CardContent>
        </Card>
      </main>
      <MobileNav />
    </div>
  );
}
