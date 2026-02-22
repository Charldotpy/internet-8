
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, ChevronLeft, Check, X, ArrowRight, CheckCircle, XCircle, Volume2, Loader2, AlertTriangle } from 'lucide-react';
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
import { generateSmsScenarios } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle as AlertTitleUI } from '@/components/ui/alert';

type Scenario = {
    id: number;
    sender: string;
    text: string;
    isScam: boolean;
    explanation: string;
};

const scenarioId = 'suspicious-sms';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState<{ title: string; message: string; correct: boolean } | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [shuffledScenarios, setShuffledScenarios] = useState<Scenario[]>([]);

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const scenarioStorageKey = `scenarios-${scenarioId}`;
    let isMounted = true;

    const fetchScenarios = async () => {
      setIsLoading(true);
      setError(null);

      // This part is synchronous, it runs before any potential unmount in strict mode.
      const storedScenarios = sessionStorage.getItem(scenarioStorageKey);
      if (storedScenarios) {
        try {
          setShuffledScenarios(JSON.parse(storedScenarios));
          setIsLoading(false);
          return;
        } catch (e) {
          console.error("Failed to parse stored scenarios, fetching new ones.", e);
          sessionStorage.removeItem(scenarioStorageKey);
        }
      }

      // This part is async and can cause a race condition.
      try {
        const scenarios = await generateSmsScenarios({ count: 8 });
        if (isMounted) {
          if (!scenarios || scenarios.length === 0) {
            throw new Error('Could not generate the simulation scenarios.');
          }
          sessionStorage.setItem(scenarioStorageKey, JSON.stringify(scenarios));
          setShuffledScenarios(scenarios);
        }
      } catch (e: any) {
        console.error(e);
        if (isMounted) {
          setError(e.message || 'An unexpected error occurred while setting up the simulation.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchScenarios();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Stop speech when component unmounts or step changes
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentStep]);

  useEffect(() => {
    if (showResult) {
      handleSpeak(`${showResult.title}. ${showResult.message}`);
    }
  }, [showResult]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto text-center p-8">
          <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-lg text-muted-foreground">Generating your personalized simulation...</p>
          <p className="text-sm text-muted-foreground">This may take a moment.</p>
      </div>
    );
  }

  if (error) {
      return (
          <div className="max-w-2xl mx-auto">
              <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitleUI>Error</AlertTitleUI>
                  <AlertDescription>
                      <p>{error}</p>
                      <Button asChild variant="link" className="p-0 h-auto mt-2">
                          <Link href="/">Return to Homepage</Link>
                      </Button>
                  </AlertDescription>
              </Alert>
          </div>
      );
  }

  if (shuffledScenarios.length === 0) {
    return null;
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
            <div className="flex items-center gap-2">
                <div className="flex-grow">
                    <MessageBubble text={currentScenario.text} />
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleSpeak(currentScenario.text)} className="shrink-0" aria-label="Read message aloud">
                    <Volume2 className="h-5 w-5" />
                </Button>
            </div>
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

    

    

    