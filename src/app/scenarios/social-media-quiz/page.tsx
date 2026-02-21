'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Check, X, ArrowRight, CheckCircle, XCircle, Heart, MessageCircle, Send, Bookmark, Users } from 'lucide-react';
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


const scenarios = [
  {
    id: 1,
    platform: 'Instagram',
    profileName: 'CruiseDeals_Official',
    profileImage: placeholderImageMap['social-profile-cruise'].imageUrl,
    image: placeholderImageMap['social-post-cruise'].imageUrl,
    text: "You've been selected for a FREE 7-day Caribbean cruise! 🌴☀️ To claim your prize, click the link in our bio and enter your details. Limited spots available, act fast!",
    isScam: true,
    explanation: "This is a classic scam. 'Too good to be true' offers, pressure to act fast, and requests for personal information are major red flags. The link likely leads to a phishing site.",
  },
  {
    id: 2,
    platform: 'Facebook',
    profileName: 'National Geographic',
    profileImage: placeholderImageMap['social-profile-natgeo'].imageUrl,
    image: placeholderImageMap['social-post-nature'].imageUrl,
    text: "Did you know? The axolotl can regenerate not just its limbs, but also its heart and parts of its brain! #FunFactFriday #NatureIsAmazing",
    isScam: false,
    explanation: "This is a safe post from a verified, reputable page. It shares an interesting fact and doesn't ask you to do anything suspicious."
  },
  {
    id: 3,
    platform: 'Instagram DM',
    profileName: 'your_friend_anna',
    profileImage: placeholderImageMap['social-profile-anna'].imageUrl,
    image: null,
    text: "OMG I can't believe this photo of you! 😱 is-this-really-you.com/view-photo. Is this really you??",
    isScam: true,
    explanation: "This is a common account takeover scam. A hacker has likely taken over your friend's account and is trying to trick you into clicking a malicious link, which could compromise your own account."
  },
  {
    id: 4,
    platform: 'Facebook',
    profileName: 'John S.',
    profileImage: placeholderImageMap['social-profile-john'].imageUrl,
    image: placeholderImageMap['social-post-console'].imageUrl,
    text: "Selling PS5, brand new. Price: $250. My cousin is in the hospital so I need money fast. I can't do pickup, but if you pay me upfront with a gift card, I can ship it to you today.",
    isScam: true,
    explanation: "This has multiple red flags for a marketplace scam: a price that's too low, a sob story to create urgency, refusal of a safe transaction method (pickup), and a request for an untraceable payment method (gift card)."
  },
  {
    id: 5,
    platform: 'Facebook',
    profileName: 'Local Community Group',
    profileImage: placeholderImageMap['social-profile-community'].imageUrl,
    image: placeholderImageMap['social-post-lost-pet'].imageUrl,
    text: "Found this sweet dog wandering near the park. No collar. Does anyone recognize her? Please share so we can find her owner!",
    isScam: false,
    explanation: "This is a typical post in a community group. It's a genuine attempt to help and doesn't involve any red flags like asking for money or clicking strange links.",
  },
  {
    id: 6,
    platform: 'Instagram',
    profileName: 'Crypto_King_88',
    profileImage: placeholderImageMap['social-profile-crypto'].imageUrl,
    image: placeholderImageMap['social-post-chart'].imageUrl,
    text: "I turned $100 into $10,000 in one week with my secret crypto strategy. DM me 'INFO' and I'll teach you how. Guaranteed profits!",
    isScam: true,
    explanation: "This is an investment scam. Promises of 'guaranteed profits' and 'secret strategies' are major red flags. These scams aim to get you to send them money, which you'll never see again.",
  },
  {
    id: 7,
    platform: 'Facebook',
    profileName: 'Your Aunt Carol',
    profileImage: placeholderImageMap['social-profile-aunt'].imageUrl,
    image: null,
    text: "Hey sweetie, I'm in a bit of a jam and need to borrow $50 for groceries. Can you send it to me on this new payment app I'm trying? I'll pay you back on Friday!",
    isScam: true,
    explanation: "Be careful! This could be a scammer who has hacked your aunt's account. The unusual request for money, especially using a 'new payment app', is suspicious. Always verify such requests by calling your relative directly.",
  },
  {
    id: 8,
    platform: 'Instagram',
    profileName: 'BakeWithLove',
    profileImage: placeholderImageMap['social-profile-baker'].imageUrl,
    image: placeholderImageMap['social-post-cake'].imageUrl,
    text: "Just finished this custom birthday cake! So happy with how the chocolate drip turned out. What are you all baking this weekend? 🎂 #baking #cakedecorating",
    isScam: false,
    explanation: "This is a normal, safe post from a hobbyist or small business account. It's sharing content and engaging with its audience, which is what social media is for.",
  }
];

const scenarioId = 'social-media-quiz';

type Scenario = typeof scenarios[0];

const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;

export default function SocialMediaQuizPage() {
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
    return (
      <div className="bg-white dark:bg-black rounded-lg border max-w-md mx-auto">
        {/* Post Header */}
        <div className="flex items-center p-3 border-b border-zinc-200 dark:border-zinc-800">
          <Avatar className="h-8 w-8 mr-3">
              <AvatarImage src={currentScenario.profileImage} alt={currentScenario.profileName} />
              <AvatarFallback>{currentScenario.profileName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-sm">{currentScenario.profileName}</span>
        </div>

        {/* Post Image */}
        {currentScenario.image && (
            <div className="relative w-full aspect-square">
                <Image src={currentScenario.image} alt="Social media post" fill className="object-cover" />
            </div>
        )}
        
        {/* Post Actions (Instagram-like) */}
        {currentScenario.platform.includes('Instagram') && currentScenario.image && (
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
            <p className="text-sm">
                <span className="font-semibold cursor-pointer">{currentScenario.profileName}</span>{' '}
                {currentScenario.text}
            </p>
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
                {renderPlatformIcon(currentScenario.platform)}
                Step {currentStep + 1} of {shuffledScenarios.length}: {currentScenario.platform}
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
