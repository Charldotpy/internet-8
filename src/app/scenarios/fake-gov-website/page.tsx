'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ChevronLeft, Check, AlertTriangle, ArrowRight, CheckCircle, XCircle, Lock } from 'lucide-react';
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

type Scenario = {
  id: number;
  url: string;
  title: string;
  body: string;
  inputs: { label: string, placeholder: string }[];
  isSuspicious: boolean;
  explanation: string;
};

const scenarios: Scenario[] = [
  {
    id: 1,
    url: 'https://my-gov-assistance.com',
    title: 'Government Aid Portal 2026',
    body: 'You are eligible for RM1500 Bantuan. Enter your IC number and bank details to receive payment immediately.',
    inputs: [{ label: 'IC Number', placeholder: 'e.g., 900101-10-1234' }, { label: 'Bank Account', placeholder: 'e.g., 1234567890' }],
    isSuspicious: true,
    explanation: "This is suspicious. The URL 'my-gov-assistance.com' is not an official government domain. Official Malaysian government sites end in '.gov.my'. Also, be wary of sites creating false urgency.",
  },
  {
    id: 2,
    url: 'https://www.hasil.gov.my/login',
    title: 'LHDN MyTax Portal',
    body: 'Welcome to the official MyTax portal. Please log in with your credentials to access your tax information.',
    inputs: [{ label: 'ID Pengenalan', placeholder: 'No. Kad Pengenalan' }, { label: 'Kata Laluan', placeholder: 'Password' }],
    isSuspicious: false,
    explanation: "This is safe. The URL 'hasil.gov.my' is the official domain for the Malaysian Inland Revenue Board (LHDN). It's the correct place to handle tax matters.",
  },
  {
    id: 3,
    url: 'https://rewards-gov.info/claim-bonus',
    title: 'National Loyalty Program',
    body: "Congratulations! As a loyal citizen, you've won a RM500 bonus. To verify your identity, please answer these security questions.",
    inputs: [{ label: "Mother's Maiden Name", placeholder: 'Your Answer' }, { label: 'First School Name', placeholder: 'Your Answer' }],
    isSuspicious: true,
    explanation: "This is suspicious. Government agencies do not run 'loyalty programs' or ask for sensitive security question answers in this way. The URL '.info' is also not a government domain.",
  },
  {
    id: 4,
    url: 'https://www.jpj.gov.my/saman-check',
    title: 'JPJ Compound Check',
    body: 'Check for outstanding traffic compounds. Please enter your Vehicle Registration Number and IC number to proceed.',
    inputs: [{ label: 'Vehicle Number', placeholder: 'e.g., WXA 1234' }, { label: 'IC Number', placeholder: 'e.g., 900101-10-1234' }],
    isSuspicious: false,
    explanation: "This is safe. 'jpj.gov.my' is the official domain for the Road Transport Department Malaysia. This is a legitimate government service.",
  },
  {
    id: 5,
    url: 'https://myspr.gov.my/semak-dpr',
    title: 'Check Your Voter Registration',
    body: 'Semak status pendaftaran anda sebagai pengundi. Welcome to the official portal for the Election Commission of Malaysia.',
    inputs: [{ label: 'IC Number', placeholder: 'e.g., 900101-10-1234' }],
    isSuspicious: false,
    explanation: "This is safe. 'myspr.gov.my' is an official portal of the Malaysian Election Commission (SPR).",
  },
  {
    id: 6,
    url: 'https://citizen-subsidy.org/apply',
    title: 'Fuel Subsidy Application 2026',
    body: 'The government has announced a new fuel subsidy for all citizens. Apply now to receive your monthly fuel card.',
    inputs: [{ label: 'Full Name', placeholder: 'Your Name' }, { label: 'IC Number', placeholder: 'e.g., 900101-10-1234' }, { label: 'Vehicle Plate', placeholder: 'e.g., WXA 1234' }],
    isSuspicious: true,
    explanation: "This is suspicious. The domain '.org' is not typically used for Malaysian government services, which end in '.gov.my'. Be wary of unofficial-looking subsidy sites.",
  },
  {
    id: 7,
    url: 'https://www.mof.gov.my',
    title: 'Ministry of Finance Malaysia',
    body: 'Welcome to the official website of the Malaysian Ministry of Finance. Find the latest budget information, press releases, and publications.',
    inputs: [],
    isSuspicious: false,
    explanation: "This is safe. 'mof.gov.my' is the official website for the Ministry of Finance. It provides information and does not ask for unnecessary personal details.",
  },
  {
    id: 8,
    url: 'http://my-census-update.net/form',
    title: 'Mandatory Census Update',
    body: 'URGENT: All citizens are required to update their census data due to new regulations. Failure to comply may result in a fine. Click here to update now.',
    inputs: [{ label: 'Full Address', placeholder: 'Your Address' }, { label: 'Household Income', placeholder: 'e.g., 5000' }],
    isSuspicious: true,
    explanation: "This is highly suspicious. The URL is not secure (http instead of https), it's not a '.gov.my' domain, and it uses threats (a fine) to create urgency. Official census data is collected through secure, official channels.",
  }
];

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
      const correctAnswers = answers.filter(a => a.isCorrect).length;
      const score = Math.round((correctAnswers / shuffledScenarios.length) * 100);

      const summaryInput = {
          scenarioName: "Fake Government Website",
          actionsTaken: answers.map(a => {
              const action = a.userAnsweredSuspicious ? 'marked as suspicious' : 'marked as safe';
              const outcome = a.isCorrect ? 'correctly' : 'incorrectly';
              return `User ${outcome} ${action} the website with URL: "${a.url}"`;
          }),
          identifiedRisks: answers.filter(a => a.isSuspicious).map(a => ({
              description: `A suspicious website with URL "${a.url}" and title "${a.title}"`,
              correctlyIdentified: a.userAnsweredSuspicious,
          })),
          score: score,
      };
      
      sessionStorage.setItem(`${scenarioId}-summaryInput`, JSON.stringify(summaryInput));
      router.push(`/scenarios/${scenarioId}/summary`);
    }
  };

  const renderScenarioContent = () => {
    return (
        <FakeBrowserFrame url={currentScenario.url}>
            <div className='text-center space-y-4'>
                <h2 className='text-2xl font-bold text-primary'>{currentScenario.title}</h2>
                <p className='text-muted-foreground'>{currentScenario.body}</p>
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
                 {answers.length < shuffledScenarios.length ? 'Continue Learning' : 'View Summary'} <ArrowRight className="ml-2" />
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
                {answers.length < shuffledScenarios.length ? 'Next' : 'Finish'} <ArrowRight className="ml-2" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
