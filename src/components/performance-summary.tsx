'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';

type Answer = {
  isCorrect: boolean;
  isScam?: boolean;
  isSuspicious?: boolean;
  // other properties...
};

const StatCard = ({ title, value, total }: { title: string; value: number; total: number }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value} / {total}</p>
      <div className="flex items-center gap-2 mt-1">
        <Progress value={percentage} className="h-2" />
        <span className="text-xs font-semibold text-muted-foreground">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};


export default function PerformanceSummary({ scenarioTitle, scenarioId }: { scenarioTitle: string, scenarioId: string }) {
  const [answers, setAnswers] = useState<Answer[] | null>(null);

  useEffect(() => {
    const resultsJson = sessionStorage.getItem(`results-${scenarioId}`);
    if (resultsJson) {
      try {
        setAnswers(JSON.parse(resultsJson));
      } catch (e) {
        console.error("Failed to parse results from session storage", e);
        setAnswers([]);
      }
    } else {
        setAnswers([]);
    }
  }, [scenarioId]);

  if (answers === null) {
      return (
          <Card className="w-full max-w-3xl mx-auto">
              <CardHeader className="text-center">
                  <Skeleton className="h-10 w-3/4 mx-auto" />
                  <Skeleton className="h-6 w-1/2 mx-auto mt-2" />
              </CardHeader>
              <CardContent className="space-y-6">
                  <Skeleton className="h-24 w-full" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                  </div>
                  <Skeleton className="h-40 w-full" />
              </CardContent>
          </Card>
      )
  }

  if (answers.length === 0) {
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Error</CardTitle>
                <CardDescription>Could not load simulation results.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  const totalQuestions = answers.length;
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const isScamKey = 'isScam' in answers[0] ? 'isScam' : 'isSuspicious';

  const totalThreats = answers.filter(a => a[isScamKey]).length;
  const correctlyIdentifiedThreats = answers.filter(a => a[isScamKey] && a.isCorrect).length;
  
  const totalSafe = answers.filter(a => !a[isScamKey]).length;
  const correctlyIdentifiedSafe = answers.filter(a => !a[isScamKey] && a.isCorrect).length;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold tracking-tight md:text-4xl">Simulation Complete!</CardTitle>
        <CardDescription className="text-lg text-muted-foreground pt-2">
            You completed the "{scenarioTitle}" scenario.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-6 bg-secondary rounded-lg">
            <p className="text-muted-foreground">Your Score</p>
            <p className="text-6xl font-bold text-primary">{score}%</p>
            <p className="text-muted-foreground mt-1">You answered {correctAnswers} out of {totalQuestions} questions correctly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard title="Threats Identified" value={correctlyIdentifiedThreats} total={totalThreats} />
            <StatCard title="Safe Items Identified" value={correctlyIdentifiedSafe} total={totalSafe} />
        </div>
        
        <div>
            <h3 className="font-bold mb-2 text-lg">Category Performance</h3>
            <p className="text-muted-foreground text-sm mb-4">
                Here's a breakdown of how you did on identifying threats versus safe items.
            </p>
            <div className='border rounded-lg'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead className='text-right'>Accuracy</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <div className='flex items-center gap-2 font-medium'>
                                    <AlertCircle className='h-5 w-5 text-destructive'/>
                                    <span>Identifying Threats</span>
                                </div>
                            </TableCell>
                            <TableCell className='text-right font-mono font-semibold'>
                                {correctlyIdentifiedThreats} / {totalThreats} ({totalThreats > 0 ? Math.round((correctlyIdentifiedThreats / totalThreats) * 100) : 0}%)
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className='flex items-center gap-2 font-medium'>
                                    <CheckCircle2 className='h-5 w-5 text-green-600'/>
                                    <span>Identifying Safe Items</span>
                                </div>
                            </TableCell>
                            <TableCell className='text-right font-mono font-semibold'>
                                {correctlyIdentifiedSafe} / {totalSafe} ({totalSafe > 0 ? Math.round((correctlyIdentifiedSafe / totalSafe) * 100) : 0}%)
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
