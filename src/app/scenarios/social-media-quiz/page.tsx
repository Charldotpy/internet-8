'use client';

import { useState } from 'react';
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
];

const scenarioId = 'social-media-quiz';

const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;

export default function SocialMediaQuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState<{ title: string; message: string; correct: boolean } | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);

  const currentScenario = scenarios[currentStep];

  const handleAnswer = (userThinksIsScam: boolean) => {
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
    if (currentStep < scenarios.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
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
      <Card className="overflow-hidden">
        <CardHeader className="p-4 border-b bg-muted/50">
            <h1 className="text-xl font-bold flex items-center gap-2">
                {renderPlatformIcon(currentScenario.platform)}
                Step {currentStep + 1} of {scenarios.length}: {currentScenario.platform}
            </h1>
            <p className="text-muted-foreground text-sm">Is this situation a scam or is it safe? Analyze the post below and make your choice.</p>
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
