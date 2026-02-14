import { getPerformanceSummary } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, Lightbulb, UserCheck } from "lucide-react";
import Link from 'next/link';

const mockPerformanceData = {
  scenarioName: "Online Banking Security",
  actionsTaken: [
    "Correctly identified a phishing alert on the account dashboard."
  ],
  identifiedRisks: [
    {
      description: "An urgent, high-pressure pop-up asking to 'verify' identity.",
      correctlyIdentified: true,
    }
  ],
  score: 100,
};

export default async function SummaryPage() {
  const { summary, error } = await getPerformanceSummary(mockPerformanceData);

  if (error || !summary) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-muted-foreground">{error || "Could not generate your performance summary."}</p>
        <Button asChild className="mt-4">
            <Link href="/">Back to Scenarios</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Simulation Complete!
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          {summary.overallSummary}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserCheck className="text-green-600" /> Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {summary.strengths.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-1 text-green-600 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb className="text-yellow-500" /> Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
             {summary.areasForImprovement.length > 0 ? (
                <ul className="space-y-3">
                {summary.areasForImprovement.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 mt-1 text-yellow-500 flex-shrink-0" />
                    <span>{point}</span>
                    </li>
                ))}
                </ul>
             ) : (
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>No specific areas for improvement noted. Great job!</span>
                </div>
             )}
          </CardContent>
        </Card>
      </div>

       <div className="text-center pt-4">
        <Button size="lg" asChild>
          <Link href="/">
            Choose Another Scenario <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
