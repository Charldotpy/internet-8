'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Landmark, ChevronLeft, Check, X, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const scenarios = [
  {
    id: 1,
    type: 'email',
    sender: 'secure.banking@net-bank.com',
    subject: 'Urgent Action Required on Your Account',
    text: "We have detected suspicious activity. Please log in using this link to verify your details immediately: http://net-bank-security.co. Failure to do so will result in account suspension.",
    isScam: true,
    explanation: "This is a phishing attempt. The email creates false urgency, comes from a slightly suspicious email address, and uses a non-official link. Never click links in unexpected emails; always go to the official website yourself.",
  },
  {
    id: 2,
    type: 'notification',
    text: "Your monthly statement for May 2024 is now available to view in the 'Documents' section.",
    isScam: false,
    explanation: "This is a normal, safe notification. It's informational and doesn't ask you to click strange links or provide sensitive information."
  },
  {
    id: 3,
    type: 'offer',
    text: "Congratulations! You've been pre-approved for a $10,000 loan at 0% interest. Click here to accept and provide your personal details to finalize!",
    isScam: true,
    explanation: "Be wary of 'too good to be true' offers. Unsolicited loan or prize notifications are a common tactic to get you to give up sensitive personal information."
  },
  {
    id: 4,
    type: 'login',
    url: 'www.net-bank.com',
    text: "The web address in your browser for your bank's login page is: https://www.net-bank.com. Is this safe to log into?",
    isScam: false,
    explanation: "This is a safe URL. It uses HTTPS for a secure connection and has a legitimate-looking domain name. It's always good practice to check the URL before entering login details."
  }
];

const scenarioId = 'online-banking';

export default function OnlineBankingQuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState<{ title: string; message: string; correct: boolean } | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);

  const currentScenario = scenarios[currentStep];

  const handleAnswer = (userThinksIsScam: boolean) => {
    const isCorrect = userThinksIsScam === currentScenario.isScam;

    setAnswers(prev => [...prev, { ...currentScenario, userAnsweredScam: userThinksIsScam, isCorrect }]);

    if (isCorrect) {
      setShowResult({
        title: "Correct!",
        message: "Great job! " + currentScenario.explanation,
        correct: true,
      });
    } else {
      setShowResult({
        title: "Be careful!",
        message: "This was actually " + (currentScenario.isScam ? "a scam. " : "safe. ") + currentScenario.explanation,
        correct: false,
      });
    }
  };

  const handleNext = () => {
    setShowResult(null);
    if (currentStep < scenarios.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      router.push(`/scenarios/${scenarioId}/summary`);
    }
  };

  const renderScenarioContent = () => {
    switch (currentScenario.type) {
      case 'email':
        return (
          <div className="text-left text-sm p-4 border rounded-lg bg-card">
            <div className="flex justify-between text-muted-foreground">
              <p>From: {currentScenario.sender}</p>
              <p>Subject: {currentScenario.subject}</p>
            </div>
            <hr className="my-2"/>
            <p className="mt-4 text-base">“{currentScenario.text}”</p>
          </div>
        );
      case 'login':
        return (
             <Alert variant='default'>
                <AlertTitle>Check the URL</AlertTitle>
                <AlertDescription>
                    <p className='text-base mb-2'>“{currentScenario.text}”</p>
                    <div className="font-mono bg-muted p-2 rounded-md text-center">
                        {currentScenario.url}
                    </div>
                </AlertDescription>
            </Alert>
        )
      default:
        return (
            <div className="bg-card text-card-foreground p-4 rounded-xl shadow-md">
                <p className="text-base sm:text-lg">“{currentScenario.text}”</p>
            </div>
        );
    }
  }


  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "inline-flex items-center gap-2")}>
        <ChevronLeft className="h-4 w-4" />
        Back to Scenarios
      </Link>
      <Card className="overflow-hidden">
        <CardHeader className="p-4 border-b bg-muted/50">
            <h1 className="text-xl font-bold flex items-center gap-2"><Landmark /> Step {currentStep + 1} of {scenarios.length}</h1>
            <p className="text-muted-foreground text-sm">Is this situation a scam or is it safe? Analyze the message below and make your choice.</p>
        </CardHeader>
        <CardContent className="p-6 bg-slate-200 dark:bg-slate-800">
            {renderScenarioContent()}
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
