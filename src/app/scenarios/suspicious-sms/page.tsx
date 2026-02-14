'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, ChevronLeft, Flag, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';
import Link from 'next/link';

const messages = [
  { id: 1, sender: 'Friend', text: "Hey, are we still on for lunch tomorrow at 12? The usual spot.", isAnomaly: false },
  { id: 2, sender: '555-0102', text: "URGENT: Your bank account has been compromised. To secure your funds, click here immediately: bit.ly/secure-my-acct", isAnomaly: true, anomalyDescription: "This is a classic phishing attempt. It creates a sense of urgency and uses a suspicious, shortened link to trick you into giving away your information." },
  { id: 3, sender: 'Doctor\'s Office', text: "Reminder: Your appointment is on Friday at 3 PM. Please reply YES to confirm.", isAnomaly: false },
];

const scenarioId = 'suspicious-sms';

export default function SuspiciousSmsPage() {
  const router = useRouter();
  const [reportedAnomalies, setReportedAnomalies] = useState<number[]>([]);
  const [showResult, setShowResult] = useState<{correct: boolean, description: string} | null>(null);

  const totalAnomalies = messages.filter(m => m.isAnomaly).length;

  const handleReport = (messageId: number) => {
    if (reportedAnomalies.includes(messageId)) return;

    const message = messages.find(m => m.id === messageId);
    if (message) {
      setReportedAnomalies(prev => [...prev, messageId]);
      setShowResult({ correct: message.isAnomaly, description: message.isAnomaly ? message.anomalyDescription! : "This message seems safe. It's from a known contact (your doctor's office) and is a simple reminder. Good job being cautious!" });
    }
  };
  
  const finishSimulation = () => {
    router.push(`/scenarios/${scenarioId}/summary`);
  };

  const correctlyReportedCount = reportedAnomalies.filter(id => messages.find(m => m.id === id)?.isAnomaly).length;
  const progress = (correctlyReportedCount / totalAnomalies) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "inline-flex items-center gap-2")}>
        <ChevronLeft className="h-4 w-4" />
        Back to Scenarios
      </Link>
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50 p-4 border-b">
          <h1 className="text-xl font-bold flex items-center gap-2"><Smartphone /> Suspicious SMS Simulation</h1>
          <p className="text-muted-foreground text-sm">Review the messages below. Click the <Flag className="inline h-4 w-4"/> icon on any message you think is a scam.</p>
          <div className="flex items-center gap-4 pt-2">
            <span className="text-sm font-medium">Anomalies Found:</span>
            <Progress value={progress} aria-label={`${progress}% of anomalies found`} className="w-[60%]" />
            <span className="text-sm font-medium text-muted-foreground">{correctlyReportedCount}/{totalAnomalies}</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-slate-200 dark:bg-slate-800 p-4 space-y-4 max-h-[50vh] overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex items-end gap-2", msg.sender === 'Me' ? 'justify-end' : 'justify-start')}>
                <div className={cn("p-3 rounded-2xl max-w-[80%] relative group shadow-md", msg.sender === 'Me' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none')}>
                  <p className="font-semibold text-xs text-accent-foreground/80">{msg.sender}</p>
                  <p className="text-base">{msg.text}</p>
                   <Button
                    size="icon"
                    variant="ghost"
                    className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    onClick={() => handleReport(msg.id)}
                    disabled={reportedAnomalies.includes(msg.id)}
                    aria-label={`Report message from ${msg.sender}`}
                  >
                    <Flag className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 border-t bg-muted/50">
          <Button onClick={finishSimulation} className="ml-auto" disabled={correctlyReportedCount < totalAnomalies}>
            Finish Simulation <ArrowRight className="ml-2"/>
          </Button>
        </CardFooter>
      </Card>
      
      <AlertDialog open={!!showResult} onOpenChange={(open) => !open && setShowResult(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {showResult?.correct ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
              {showResult?.correct ? "Anomaly Spotted!" : "Looks Safe"}
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-4 text-base">
              {showResult?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowResult(null)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
