'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  Flag,
  Landmark,
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const transactions = [
  { date: 'June 20, 2024', description: 'Grocery Store', amount: '-$78.50' },
  { date: 'June 19, 2024', description: 'Gas Station', amount: '-$45.21' },
  { date: 'June 18, 2024', description: 'Direct Deposit', amount: '+$2,100.00' },
  { date: 'June 17, 2024', description: 'Online Shopping', amount: '-$123.45' },
];

const scenarioId = 'online-banking';

export default function BankingDashboardPage() {
  const router = useRouter();
  const [reported, setReported] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const anomaly = {
    title: 'URGENT SECURITY ALERT',
    text: "We've detected unusual activity on your account. Please verify your identity immediately to prevent your account from being locked.",
    buttonText: 'Verify Identity Now',
    description: "This is a phishing tactic. Banks rarely use high-pressure, urgent pop-ups inside a secure session. They would likely send you a secure message or email asking you to log in through official channels, not click an immediate, alarming button."
  };

  const handleReport = () => {
    setReported(true);
    setShowResult(true);
  };

  const finishSimulation = () => {
    router.push(`/scenarios/${scenarioId}/summary`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <Link href={`/scenarios/${scenarioId}`} className={cn(buttonVariants({ variant: "outline" }), "inline-flex items-center gap-2")}>
        <ChevronLeft className="h-4 w-4" />
        Back to Login
      </Link>
      <h1 className="text-2xl font-bold flex items-center gap-3"><Landmark /> Your Account Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Checking Account: ...4321</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$3,456.78</p>
            <p className="text-sm text-muted-foreground">Available Balance</p>
          </CardContent>
        </Card>
        <div className="md:col-span-2 space-y-4">
            <Alert variant="destructive" className="relative group">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{anomaly.title}</AlertTitle>
                <AlertDescription>
                    {anomaly.text}
                    <Button variant="link" className="p-0 h-auto ml-1 text-destructive-foreground underline">
                        {anomaly.buttonText}
                    </Button>
                </AlertDescription>
                 <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-destructive/20 hover:bg-destructive/40 text-destructive-foreground disabled:opacity-50"
                    onClick={handleReport}
                    disabled={reported}
                    aria-label="Report anomaly"
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
            </Alert>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((t, i) => (
                        <TableRow key={i}>
                            <TableCell>{t.date}</TableCell>
                            <TableCell>{t.description}</TableCell>
                            <TableCell className={`text-right font-medium ${t.amount.startsWith('+') ? 'text-green-600' : ''}`}>{t.amount}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
      
       <div className="text-center pt-4">
        <Button size="lg" onClick={finishSimulation} disabled={!reported}>
            Finish Simulation <ArrowRight className="ml-2" />
        </Button>
      </div>

      <AlertDialog open={showResult} onOpenChange={(open) => !open && setShowResult(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle className="text-green-500" />
              Phishing Attempt Spotted!
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-4 text-base">
              {anomaly.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowResult(false)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
