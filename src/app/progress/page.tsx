import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

const completedScenarios = [
  { id: 1, title: 'Suspicious SMS', score: '100%', date: '2 days ago' },
  { id: 2, title: 'Online Banking', score: '75%', date: '1 week ago' },
];

export default function ProgressPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Your Progress
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Review your performance in completed scenarios and track your learning journey.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completed Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          {completedScenarios.length > 0 ? (
            <ul className="space-y-4">
              {completedScenarios.map((item) => (
                <li key={item.id} className="flex items-center justify-between p-4 rounded-lg border bg-secondary/50">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  <div className="font-bold text-lg text-primary">{item.score}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
              <p>You haven't completed any scenarios yet.</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/">Go back to the homepage to get started!</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
