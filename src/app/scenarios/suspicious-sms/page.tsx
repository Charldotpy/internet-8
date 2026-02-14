'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, ChevronLeft, Check, X, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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

const scenarios = [
  {
    id: 1,
    sender: '555-0102',
    text: "Your bank account is locked. Click this link immediately and enter your OTP: bit.ly/secure-my-acct",
    isScam: true,
    explanation: "It creates a sense of urgency and uses a suspicious, shortened link to trick you into giving away your information.",
  },
  {
    id: 2,
    sender: "Doctor's Office",
    text: "Reminder: Your appointment is on Friday at 3 PM. Please reply YES to confirm.",
    isScam: false,
    explanation: "The request is simple, expected, and doesn't ask for sensitive information or for you to click a strange link."
  },
  {
    id: 3,
    sender: 'Prize Dept.',
    text: "CONGRATS! You've won a $1000 gift card. To claim, provide your address and SSN at: real-prizes-4u.net",
    isScam: true,
    explanation: "Unsolicited prize notifications are a huge red flag, especially when they ask for sensitive personal information like your Social Security Number."
  },
  {
    id: 4,
    sender: "Friend",
    text: "Hey, are we still on for lunch tomorrow at 12? The usual spot.",
    isScam: false,
    explanation: "This is a normal message from a friend. There are no suspicious links or urgent requests for information."
  }
];

const scenarioId = 'suspicious-sms';

export default function SuspiciousSmsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState<{ title: string; message: string; correct: boolean } | null>(null);
  // This state is not used for now but could be used for a dynamic summary page later.
  const [answers, setAnswers] = useState<any[]>([]);

  const currentScenario = scenarios[currentStep];

  const handleAnswer = (userThinksIsScam: boolean) => {
    const isCorrect = userThinksIsScam === currentScenario.isScam;

    setAnswers(prev => [...prev, { ...currentScenario, userAnsweredScam: userThinksIsScam, isCorrect }]);

    let title: string;
    let message: string;

    if (isCorrect) {
        if (currentScenario.isScam) {
            title = "Correct!";
            message = "Correct! Never share your OTP or click unknown links. " + currentScenario.explanation;
        } else {
            title = "Correct!";
            message = "You're right, this message is safe. " + currentScenario.explanation;
        }
    } else { // Incorrect
        if (currentScenario.isScam) {
            title = "Be careful!";
            message = "Be careful! This is a SCAM. Never share your OTP. " + currentScenario.explanation;
        } else {
            title = "Be careful!";
            message = "This message was actually safe. " + currentScenario.explanation;
        }
    }

    setShowResult({ title, message, correct: isCorrect });
  };

  const handleNext = () => {
    setShowResult(null);
    if (currentStep < scenarios.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // In a real app, you'd pass the score/answers to the summary page.
      router.push(`/scenarios/${scenarioId}/summary`);
    }
  };


  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "inline-flex items-center gap-2")}>
        <ChevronLeft className="h-4 w-4" />
        Back to Scenarios
      </Link>
      <Card className="overflow-hidden">
        <CardHeader className="p-4 border-b bg-muted/50">
            <h1 className="text-xl font-bold flex items-center gap-2"><Smartphone /> Step {currentStep + 1} of {scenarios.length}</h1>
            <p className="text-muted-foreground text-sm">Is this message a scam or is it safe? Analyze the message below and make your choice.</p>
        </CardHeader>
        <CardContent className="p-6 bg-slate-200 dark:bg-slate-800">
            <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">⚠ You received an SMS from: {currentScenario.sender}</p>
                <div className="bg-card text-card-foreground p-4 rounded-xl shadow-md">
                    <p className="text-base sm:text-lg">“{currentScenario.text}”</p>
                </div>
            </div>
        </CardContent>
        <CardFooter className="p-6 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-green-600 text-green-600 hover:bg-green-600 hover:text-white" onClick={() => handleAnswer(false)}>
                <Check className="mr-2" /> This is Safe
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-destructive text-destructive hover:bg-destructive hover:text-white" onClick={() => handleAnswer(true)}>
                <X className="mr-2" /> This is a Scam
            </Button>
        </CardFooter>
      </Card>
      
      <AlertDialog open={!!showResult} onOpenChange={(open) => !open && setShowResult(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {showResult?.correct ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
              {showResult?.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-4 text-base">
              {showResult?.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleNext}>
                {currentStep < scenarios.length - 1 ? 'Next' : 'Finish'} <ArrowRight className="ml-2" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
