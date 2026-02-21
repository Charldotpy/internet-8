'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Landmark, ChevronLeft, Check, X, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
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
  },
  {
    id: 5,
    type: 'sms',
    sender: 'Bank Alert',
    text: "We've noticed a login from an unrecognized device. If this was not you, please secure your account here: net-bank.auth-access.com",
    isScam: true,
    explanation: "This is a scam. The URL is not the official bank URL. Scammers often mimic security alerts to panic users into clicking malicious links.",
  },
  {
    id: 6,
    type: 'notification',
    text: "A payment of $55.00 to 'Online Shopping Mart' was successful.",
    isScam: false,
    explanation: "This is a standard transaction notification. If you recognize the transaction, it's safe. If not, you should contact your bank through official channels.",
  },
  {
    id: 7,
    type: 'email',
    sender: 'support@net-bank.com',
    subject: 'Confirm Your New Payee',
    text: "You have added 'John Doe' as a new payee. To confirm this action, please click the link below. If you did not authorize this, contact us immediately.",
    isScam: false,
    explanation: "This is a legitimate security feature. Banks often require confirmation for new payees. As long as you initiated this, it's safe to proceed.",
  },
  {
    id: 8,
    type: 'offer',
    text: "Your credit score has changed! See your new score and apply for a credit limit increase with one click! Go to: free-credit-report.info",
    isScam: true,
    explanation: "While some banks offer credit score services, this message is suspicious due to the unofficial URL and the push to 'apply with one click', which is a pressure tactic.",
  }
];

const scenarioId = 'online-banking';

type Scenario = typeof scenarios[0];

export default function OnlineBankingQuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState<{ title: string; message: string; correct: boolean } | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [shuffledScenarios, setShuffledScenarios] = useState<Scenario[]>([]);

  useEffect(() => {
    setShuffledScenarios([...scenarios].sort(() => Math.random() - 0.5));
  }, []);

  if (shuffledScenarios.length === 0) {
    return null; // Or a loading spinner
  }

  const isReviewing = currentStep < answers.length;
  const currentAnswerForReview = isReviewing ? answers[currentStep] : null;
  const currentScenario = shuffledScenarios[currentStep];

  const goToStep = (step: number) => {
    if (step < answers.length) {
      setCurrentStep(step);
    }
  };

  const handleAnswer = (userThinksIsScam: boolean) => {
    if (isReviewing) return;

    const isCorrect = userThinksIsScam === currentScenario.isScam;

    setAnswers(prev => [...prev, { ...currentScenario, userAnsweredScam: userThinksIsScam, isCorrect }]);

    setShowResult({
      title: isCorrect ? "Correct!" : "Be careful!",
      message: isCorrect
        ? "Great job! " + currentScenario.explanation
        : "This was actually " + (currentScenario.isScam ? "a scam. " : "safe. ") + currentScenario.explanation,
      correct: isCorrect,
    });
  };

  const handleNext = () => {
    setShowResult(null);
    if (answers.length < shuffledScenarios.length) {
      setCurrentStep(answers.length);
    } else {
      router.push(`/scenarios/${scenarioId}/summary?results=${encodeURIComponent(JSON.stringify(answers))}`);
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
      
      <div className="flex justify-center gap-2 flex-wrap">
        {shuffledScenarios.map((scenario, index) => {
          const answer = answers[index];
          const isAnswered = index < answers.length;
          const isCurrent = index === currentStep;

          let cubeClass = 'bg-muted text-muted-foreground border-border';
          let content;

          if (isAnswered) {
            if (answer.isCorrect) {
              cubeClass = 'bg-green-500 hover:bg-green-500/90 text-white border-green-600';
              content = <Check className="h-4 w-4" />;
            } else {
              cubeClass = 'bg-red-500 hover:bg-red-500/90 text-white border-red-600';
              content = <X className="h-4 w-4" />;
            }
          } else {
            content = <>{index + 1}</>;
          }

          return (
            <Button
              key={scenario.id}
              variant="outline"
              size="icon"
              onClick={() => goToStep(index)}
              disabled={!isAnswered || isCurrent}
              className={cn(
                'h-8 w-8 rounded-md transition-all',
                cubeClass,
                isCurrent && 'ring-2 ring-primary ring-offset-2',
                !isAnswered && 'cursor-not-allowed opacity-50'
              )}
              aria-label={`Question ${index + 1}`}
            >
              {content}
            </Button>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="p-4 border-b bg-muted/50">
            <h1 className="text-xl font-bold flex items-center gap-2"><Landmark /> Step {currentStep + 1} of {shuffledScenarios.length}</h1>
            <p className="text-muted-foreground text-sm">Is this situation a scam or is it safe? Analyze the message below and make your choice.</p>
        </CardHeader>
        <CardContent className="p-6 bg-slate-200 dark:bg-slate-800">
            {currentScenario && renderScenarioContent()}
        </CardContent>
        <CardFooter className="p-6 flex flex-col sm:flex-row justify-center items-center gap-4">
          {isReviewing && currentAnswerForReview ? (
            <div className="text-center w-full flex flex-col items-center gap-2">
              <p className="text-muted-foreground">You answered: <span className="font-bold">{currentAnswerForReview.userAnsweredScam ? 'This is a Scam' : 'This is Safe'}</span></p>
              {currentAnswerForReview.isCorrect ? (
                <div className="flex items-center gap-2 text-green-600 font-bold"><CheckCircle /> Correct!</div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 font-bold"><XCircle /> Incorrect.</div>
              )}
              <p className="text-sm text-muted-foreground mt-2">{currentAnswerForReview.explanation}</p>
              <Button onClick={handleNext} className="mt-4">
                Continue <ArrowRight className="ml-2" />
              </Button>
            </div>
          ) : (
            <>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-green-600 text-green-600 hover:bg-green-600 hover:text-white" onClick={() => handleAnswer(false)}>
                  <Check className="mr-2" /> This is Safe
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-destructive text-destructive hover:bg-destructive hover:text-white" onClick={() => handleAnswer(true)}>
                  <X className="mr-2" /> This is a Scam
              </Button>
            </>
          )}
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
                Continue <ArrowRight className="ml-2" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
