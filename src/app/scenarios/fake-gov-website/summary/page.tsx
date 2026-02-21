'use client';

import { Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from 'next/link';
import PerformanceSummary from '@/components/performance-summary';
import { Skeleton } from '@/components/ui/skeleton';

function SummaryContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PerformanceSummary scenarioTitle="Fake Government Website" scenarioId="fake-gov-website" />
      <div className="text-center">
        <Button size="lg" asChild className="mt-4">
          <Link href="/">
            Back to Scenarios <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

const SummarySkeleton = () => (
    <div className="max-w-3xl mx-auto space-y-8">
        <Skeleton className="h-96 w-full" />
        <div className="flex justify-center">
            <Skeleton className="h-12 w-48" />
        </div>
    </div>
)

export default function SummaryPage() {
  return (
    <Suspense fallback={<SummarySkeleton />}>
      <SummaryContent />
    </Suspense>
  );
}
