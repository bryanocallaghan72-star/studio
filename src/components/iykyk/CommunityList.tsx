
"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getCommunityRecommendations } from "@/app/actions";
import { CommunityConnectorOutput } from "@/ai/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Users, Activity, BarChart } from "lucide-react";
import { Badge } from "../ui/badge";

const FormSchema = z.object({
  interests: z.string().min(3, {
    message: "Please enter at least one interest.",
  }),
});

const ActivityIcon = ({ level }: { level: string }) => {
    switch (level.toLowerCase()) {
        case 'high': return <BarChart className="w-4 h-4 text-green-500" />;
        case 'medium': return <BarChart className="w-4 h-4 text-yellow-500" />;
        case 'low': return <BarChart className="w-4 h-4 text-red-500" />;
        default: return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
}

export function CommunityList() {
  const [recommendations, setRecommendations] = useState<CommunityConnectorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      interests: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setError(null);
    setRecommendations(null);
    startTransition(async () => {
      const result = await getCommunityRecommendations(data);
      if (result.error) {
        setError(result.error);
      } else {
        setRecommendations(result.success ?? null);
      }
    });
  }

  return (
    <section>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full mb-2">
            <Sparkles className="h-5 w-5" />
            <span className="font-bold text-sm">AI Powered</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Find Your Tribe</h2>
        <p className="text-muted-foreground mt-2">
          Tell us your interests, and our AI will find the perfect communities for you.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Your Interests</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="e.g., sushi, cocktails, fitness..."
                        {...field}
                        disabled={isPending}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                    </>
                ) : (
                    "Find Communities"
                )}
                </Button>
            </form>
            </Form>
        </CardContent>
      </Card>
      

      {error && <p className="text-destructive text-center mt-4">{error}</p>}

      {recommendations && recommendations.communities.length > 0 && (
        <div className="mt-12">
            <h3 className="text-2xl font-bold tracking-tight text-center mb-6">Here's what we found for you...</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.communities.map((community) => (
                <Card key={community.name} className="flex flex-col text-center items-center p-6 bg-card shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1">
                    <CardHeader className="p-0">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto bg-primary/10">
                            <Users className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle>{community.name}</CardTitle>
                        <CardDescription className="mt-1">{community.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 mt-4 w-full flex-grow flex flex-col justify-end">
                        <Badge variant="outline" className="mx-auto mb-4">
                            <ActivityIcon level={community.activityLevel} />
                            <span className="ml-2">{community.activityLevel} Activity</span>
                        </Badge>
                        <Button className="w-full font-semibold">Join Community</Button>
                    </CardContent>
                </Card>
            ))}
            </div>
        </div>
      )}

      {recommendations && recommendations.communities.length === 0 && (
         <div className="text-center mt-12">
            <p className="text-muted-foreground">No communities found. Try broadening your interests!</p>
        </div>
      )}

    </section>
  );
}
