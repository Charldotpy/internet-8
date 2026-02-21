'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, ChevronLeft, Check, X, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
  },
  {
    id: 5,
    sender: 'Delivery Service',
    text: "We missed your delivery. A $1.99 redelivery fee is required. Please update your details here: my-package-tracking.info",
    isScam: true,
    explanation: "Scammers often use small 'fees' to get your credit card details. Legitimate delivery companies usually don't charge redelivery fees this way and the URL is not official.",
  },
  {
    id: 6,
    sender: 'Your Favorite Store',
    text: "Our 24-hour flash sale is ON! Get 50% off everything. Sale ends tonight at midnight. Shop now!",
    isScam: false,
    explanation: "This is a typical marketing message. While it creates urgency, it's from a known sender and doesn't ask for personal information via text.",
  },
  {
    id: 7,
    sender: 'Unknown Number',
    text: "Someone tagged you in a new photo album. See the pics here: view-my-album.xyz/123",
    isScam: true,
    explanation: "Be cautious of messages from unknown numbers, especially with generic text and strange links. This is a common way to spread malware or phishing links.",
  },
  {
    id: 8,
    sender: 'Account Services',
    text: "Your verification code is 843512. Do not share this with anyone. It expires in 10 minutes.",
    isScam: false,
    explanation: "This is a standard two-factor authentication (2FA) message. As long as YOU initiated the login or action that prompted it, it's safe.",
  }
];

const scenarioId = 'suspicious-sms';

type Scenario = typeof scenarios[0];

const FakePhoneFrame = ({ sender, children }: { sender: string, children: React.ReactNode }) => (
    <div className="bg-white dark:bg-black w-full max-w-sm mx-auto rounded-3xl border-[10px] border-gray-700 dark:border-gray-400 shadow-2xl overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center gap-2 border-b dark:border-gray-700">
             <ChevronLeft className="h-6 w-6 text-primary" />
            <div className="text-center flex-1">
                <p className="font-bold">{sender}</p>
            </div>
             <div className="w-6"></div>
        </div>
        <div className="p-4 h-64 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
            {children}
        </div>
    </div>
);

const MessageBubble = ({ text }: { text: string }) => (
    <div className="flex justify-start">
        <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-2xl max-w-[85%] my-1 rounded-bl-lg">
            <p className="text-sm">{text}</p>
        </div>
    </div>
);


export default function SuspiciousSmsPage() {
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

    let title: string;
    let message: string;

    if (isCorrect) {
        title = "Correct!";
        message = "Great job! " + currentScenario.explanation;
    } else { 
        title = "Be careful!";
        message = "This was actually " + (currentScenario.isScam ? "a scam. " : "safe. ") + currentScenario.explanation;
    }

    setShowResult({ title, message, correct: isCorrect });
  };

  const handleNext = () => {
    setShowResult(null);
    if (answers.length < shuffledScenarios.length) {
      setCurrentStep(answers.length);
    } else {
      sessionStorage.setItem(`results-${scenarioId}`, JSON.stringify(answers));
      router.push(`/scenarios/${scenarioId}/summary`);
    }
  };

  const renderScenarioContent = () => {
    return (
        <FakePhoneFrame sender={currentScenario.sender}>
            <MessageBubble text={currentScenario.text} />
        </FakePhoneFrame>
    );
  };

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
            <h1 className="text-xl font-bold flex items-center gap-2"><Smartphone /> Step {currentStep + 1} of {shuffledScenarios.length}</h1>
            <p className="text-muted-foreground text-sm">Is this message a scam or is it safe? Analyze the message below and make your choice.</p>
        </CardHeader>
        <CardContent className="p-6">
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
