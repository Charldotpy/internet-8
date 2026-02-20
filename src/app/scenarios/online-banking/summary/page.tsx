'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, PartyPopper } from "lucide-react";
import Link from 'next/link';

export default function SummaryPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center flex flex-col items-center gap-6 p-8 border-2 border-dashed rounded-lg">
        <PartyPopper className="h-16 w-16 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Congratulations!
        </h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
          You have successfully completed this simulation.
        </p>
        <Button size="lg" asChild className="mt-4">
          <Link href="/">
            Back to Scenarios <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
