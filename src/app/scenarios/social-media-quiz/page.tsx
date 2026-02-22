
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Check, X, ArrowRight, CheckCircle, XCircle, Heart, MessageCircle, Send, Bookmark, Users, Volume2, Loader2, AlertTriangle } from 'lucide-react';
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
import { placeholderImageMap } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateSocialMediaScenarios } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle as AlertTitleUI } from '@/components/ui/alert';


const scenarioId = 'social-media-quiz';

type Scenario = {
    id: number;
    platform: string;
    profileName: string;
    profileImageId: string;
    imageId?: string | null;
    text: string;
    isScam: boolean;
    explanation: string;
};

const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;

export default function SocialMediaQuizPage() {
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
            const scenarios = await generateSocialMediaScenarios({ count: 8 });
            if (!scenarios || scenarios.length === 0) {
                throw new Error('Could not generate the simulation scenarios.');
            }
            sessionStorage.setItem(scenarioStorageKey, JSON.stringify(scenarios));
            setShuffledScenarios(scenarios);
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An unexpected error occurred while setting up the simulation.');
        } finally {
            setIsLoading(false);
        }
    };
    fetchScenarios();
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

  const handleAnswer = (userThinksIsScam: boolean) => {
    if (isReviewing) return;

    const isCorrect = userThinksIsScam === currentScenario.isScam;
    setAnswers(prev => [...prev, { ...currentScenario, userAnsweredScam: userThinksIsScam, isCorrect }]);
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

  const renderPlatformIcon = (platform: string) => {
    if (platform.includes('Instagram')) return <InstagramIcon />;
    if (platform.includes('Facebook')) return <Users className="h-6 w-6" />;
    return null;
  }

  const renderScenarioContent = () => {
    const textToSpeak = `${currentScenario.profileName} wrote: ${currentScenario.text}`;
    
    const profileImageSrc = placeholderImageMap[currentScenario.profileImageId]?.imageUrl;
    const postImageSrc = currentScenario.imageId ? placeholderImageMap[currentScenario.imageId]?.imageUrl : null;
    
    return (
      <div className="bg-white dark:bg-black rounded-lg border max-w-md mx-auto">
        {/* Post Header */}
        <div className="flex items-center p-3 border-b border-zinc-200 dark:border-zinc-800">
          <Avatar className="h-8 w-8 mr-3">
              <AvatarImage src={profileImageSrc} alt={currentScenario.profileName} />
              <AvatarFallback>{currentScenario.profileName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-sm">{currentScenario.profileName}</span>
        </div>

        {/* Post Image */}
        {postImageSrc && (
            <div className="relative w-full aspect-square">
                <Image src={postImageSrc} alt="Social media post" fill className="object-cover" />
            </div>
        )}
        
        {/* Post Actions (Instagram-like) */}
        {currentScenario.platform.includes('Instagram') && postImageSrc && (
            <div className="flex justify-between p-3">
                <div className="flex gap-4">
                    <Heart className="h-6 w-6 cursor-pointer" />
                    <MessageCircle className="h-6 w-6 cursor-pointer" />
                    <Send className="h-6 w-6 cursor-pointer" />
                </div>
                <Bookmark className="h-6 w-6 cursor-pointer" />
            </div>
        )}

        {/* Post Text */}
        <div className="px-3 pb-4">
          <div className="flex items-start gap-2 pt-2">
            <p className="text-sm flex-grow">
                <span className="font-semibold cursor-pointer">{currentScenario.profileName}</span>{' '}
                {currentScenario.text}
            </p>
            <Button variant="ghost" size="icon" onClick={() => handleSpeak(textToSpeak)} className="shrink-0" aria-label="Read post aloud">
                <Volume2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
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
            <h1 className="text-xl font-bold flex items-center gap-2">
                {currentScenario && renderPlatformIcon(currentScenario.platform)}
                Step {currentStep + 1} of {shuffledScenarios.length}: {currentScenario?.platform}
            </h1>
            <p className="text-muted-foreground text-sm">Is this situation a scam or is it safe? Analyze the post below and make your choice.</p>
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
    

    