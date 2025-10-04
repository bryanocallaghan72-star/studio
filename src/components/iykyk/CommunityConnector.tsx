"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getCommunityRecommendations } from "@/app/actions";
import { CommunityConnectorOutput } from "@/ai/schemas";
import { Users, Loader2, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

const FormSchema = z.object({
  interests: z.string().min(2, {
    message: "Tell us what you're into!",
  }),
});

export function CommunityConnector() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CommunityConnectorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      interests: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setError(null);
    setResult(null);
    startTransition(async () => {
      const response = await getCommunityRecommendations(data);
      if (response.error) {
        setError(response.error);
      } else if (response.success) {
        setResult(response.success);
      }
    });
  }

  const getCommunityImage = (name: string) => {
    if (name.toLowerCase().includes("sushi")) return "community-sushi";
    if (name.toLowerCase().includes("cocktail")) return "community-cocktail";
    if (name.toLowerCase().includes("fitness")) return "community-fitness";
    return "my-day-3";
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <CardTitle>Community Connector</CardTitle>
        </div>
        <CardDescription>Find your people. Tell us your interests (e.g., sushi, cocktails, fitness) to get connected.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Interests</FormLabel>
                  <FormControl>
                    <Input placeholder="sushi, hiking, live music..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : "Find Communities"}
            </Button>
          </form>
        </Form>
        <div className="mt-6 space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {result && (
                 <div>
                    <h3 className="font-semibold mb-2">Top 3 Recommended Communities:</h3>
                    <div className="space-y-3">
                    {result.communities.map((community, index) => {
                        const image = PlaceHolderImages.find(img => img.id === getCommunityImage(community.name));
                        return (
                            <Card key={index} className="flex items-center gap-4 p-3 hover:bg-secondary/50 transition-colors">
                                {image && <Image src={image.imageUrl} alt={image.description} width={50} height={50} className="rounded-md" data-ai-hint={image.imageHint} />}
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold">{community.name}</h4>
                                        <Badge variant={community.activityLevel === 'high' ? 'default' : 'secondary'} className={community.activityLevel === 'high' ? 'bg-primary' : ''}>
                                            {community.activityLevel} activity
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{community.description}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Card>
                        )
                    })}
                    </div>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
