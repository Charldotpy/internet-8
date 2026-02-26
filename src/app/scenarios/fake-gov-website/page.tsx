
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ChevronLeft, Check, AlertTriangle, ArrowRight, CheckCircle, XCircle, Lock, Volume2, Loader2 } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { generateGovWebsiteScenarios, getTtsAudio } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle as AlertTitleUI } from '@/components/ui/alert';
import LinkifiedText from '@/components/linkified-text';


type Scenario = {
  id: number;
  url: string;
  title: string;
  body: string;
  inputs: { label: string, placeholder: string }[];
  isSuspicious: boolean;
  explanation: string;
};

const scenarioId = 'fake-gov-website';

const FakeBrowserFrame = ({ url, children }: { url: string, children: React.ReactNode }) => (
    <div className="border-2 border-border rounded-lg shadow-lg bg-card">
        <div className="px-4 py-2 border-b flex items-center gap-2 bg-muted/50">
            <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
            </div>
            <div className="flex-1 bg-background rounded-full px-3 py-1 text-sm text-muted-foreground flex items-center gap-2">
                <Lock className="h-3 w-3" />
                <span>{url}</span>
            </div>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

const FakeInput = ({ label, placeholder }: { label: string, placeholder: string }) => (
    <div>
        <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
        <div className="w-full bg-background border border-input rounded-md h-10 px-3 py-2 text-muted-foreground text-sm flex items-center">
            {placeholder}
        </div>
    </div>
);


export default function FakeGovWebsitePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState<{ title: string; message: string; correct: boolean } | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [shuffledScenarios, setShuffledScenarios] = useState<Scenario[]>([]);

  const [audioCache, setAudioCache] = useState<Record<string, string>>({});
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleDialogSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleQuestionSpeak = async (text: string, cacheKey: string) => {
    if (speakingKey === cacheKey) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setSpeakingKey(null);
      return;
    }
    if (speakingKey !== null) {
      return; 
    }
    
    setSpeakingKey(cacheKey);

    try {
      let audioSrc = audioCache[cacheKey];
      if (!audioSrc) {
        const { audioData, error } = await getTtsAudio({ text });
        if (error) throw new Error(error);
        if (!audioData) throw new Error("No audio data received");
        audioSrc = audioData;
        setAudioCache(prev => ({ ...prev, [cacheKey]: audioSrc }));
      }
      
      const audio = new Audio(audioSrc);
      audioRef.current = audio;
      audio.play();
      audio.onended = () => {
        setSpeakingKey(null);
        audioRef.current = null;
      };
    } catch (e) {
      console.error("TTS failed, falling back to browser synthesis.", e);
      setSpeakingKey(null); 
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  useEffect(() => {
    const scenarioStorageKey = `scenarios-${scenarioId}`;
    let isMounted = true;

    const fetchScenarios = async () => {
      setIsLoading(true);
      setError(null);

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

      try {
        const scenarios = await generateGovWebsiteScenarios({ count: 8 });
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
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setSpeakingKey(null);
    };
  }, [currentStep]);

  useEffect(() => {
    if (showResult) {
      handleDialogSpeak(`${showResult.title}. ${showResult.message}`);
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
    return null; // Should be handled by loading/error states
  }

  const isReviewing = currentStep < answers.length;
  const currentAnswerForReview = isReviewing ? answers[currentStep] : null;
  const currentScenario = shuffledScenarios[currentStep];

  const goToStep = (step: number) => {
    if (step < answers.length) {
      setCurrentStep(step);
    }
  };

  const handleAnswer = (userThinksIsSuspicious: boolean) => {
    if (isReviewing) return;

    const isCorrect = userThinksIsSuspicious === currentScenario.isSuspicious;
    setAnswers(prev => [...prev, { ...currentScenario, userAnsweredSuspicious: userThinksIsSuspicious, isCorrect }]);
    setShowResult({
      title: isCorrect ? "Correct!" : "Be careful!",
      message: currentScenario.explanation,
      correct: isCorrect,
    });
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
    const textToSpeak = `${currentScenario.title}. ${currentScenario.body}`;
    const cacheKey = `tts-${currentStep}`;
    const isSpeaking = speakingKey === cacheKey;

    return (
        <FakeBrowserFrame url={currentScenario.url}>
            <div className='text-center space-y-4'>
                <h2 className='text-2xl font-bold text-primary'>{currentScenario.title}</h2>
                <div className="flex items-center gap-2">
                    <p className='text-muted-foreground flex-grow text-left'>
                      <LinkifiedText text={currentScenario.body} />
                    </p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleQuestionSpeak(textToSpeak, cacheKey)}
                      className="shrink-0 self-center" 
                      aria-label="Read content aloud"
                      disabled={speakingKey !== null && !isSpeaking}
                    >
                      {isSpeaking ? <Loader2 className="h-5 w-5 animate-spin" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                </div>
                <div className='space-y-4 pt-4'>
                    {currentScenario.inputs.map((input, index) => (
                        <FakeInput key={index} label={input.label} placeholder={input.placeholder} />
                    ))}
                </div>
                <Button className="mt-4 w-full" size="lg">Submit</Button>
            </div>
        </FakeBrowserFrame>
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
              content = <AlertTriangle className="h-4 w-4" />;
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
            <h1 className="text-xl font-bold flex items-center gap-2">
                <ShieldAlert />
                Step {currentStep + 1} of {shuffledScenarios.length}: Website Analysis
            </h1>
            <p className="text-muted-foreground text-sm">Is the website shown below safe or suspicious? Analyze the URL and content, then make your choice.</p>
        </CardHeader>
        <CardContent className="p-6 bg-slate-200 dark:bg-slate-800">
            {currentScenario && renderScenarioContent()}
        </CardContent>
        <CardFooter className="p-6 flex flex-col sm:flex-row justify-center items-center gap-4">
          {isReviewing && currentAnswerForReview ? (
             <div className="text-center w-full flex flex-col items-center gap-2">
               <p className="text-muted-foreground">You answered: <span className="font-bold">{currentAnswerForReview.userAnsweredSuspicious ? 'This is Suspicious' : 'This is Safe'}</span></p>
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
                  <AlertTriangle className="mr-2" /> This is Suspicious
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
