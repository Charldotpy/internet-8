
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, ChevronLeft, Check, X, ArrowRight, CheckCircle, XCircle, Volume2 } from 'lucide-react';
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
  },
  {
    id: 9,
    sender: 'Tax Refund Dept.',
    text: "You are eligible for a tax refund of $542. To receive your money, go to irs-claims-gov.com and fill out your details.",
    isScam: true,
    explanation: "Tax agencies like the IRS do not initiate contact via text message for refunds. The URL is also fake; official US government sites end in .gov.",
  },
  {
    id: 10,
    sender: 'Local Pharmacy',
    text: "Your prescription for Amoxicillin is ready for pickup at our Main St location. Refill #12345.",
    isScam: false,
    explanation: "This is a legitimate notification that you would expect to receive from your pharmacy. It provides information without asking for anything unusual.",
  },
  {
    id: 11,
    sender: '555-0103',
    text: "Hi, it's me, I got a new phone and lost my contacts. Who is this?",
    isScam: false,
    explanation: "While it's from an unknown number, this is a common and usually harmless message. You can choose to reply with your name or ignore it.",
  },
  {
    id: 12,
    sender: 'Streaming Service',
    text: "Your payment for this month was declined. To avoid service interruption, please update your billing info at: stream-service-login.net",
    isScam: true,
    explanation: "This is a common phishing scam. Always go directly to the service's official website to check your account status, never through a link in a text.",
  },
  {
    id: 13,
    sender: 'Political Campaign',
    text: "Don't forget to vote tomorrow! Polls are open from 7am-8pm. Find your polling place here: vote.org",
    isScam: false,
    explanation: "Political campaigns often use text messages for reminders. As long as the links go to reputable, non-partisan sites, these are generally safe.",
  },
  {
    id: 14,
    sender: 'Job Recruiter',
    text: "We saw your resume online. We have a remote data entry position for $45/hr. Are you interested? Text us back for details.",
    isScam: true,
    explanation: "Job offers that sound too good to be true, especially for remote work with high pay and little required experience, are often scams to steal your personal information.",
  },
  {
    id: 15,
    sender: 'Airline',
    text: "Your flight 245 to Chicago has been delayed by 30 minutes. New departure time is 4:15 PM.",
    isScam: false,
    explanation: "Airlines frequently send flight status updates via text. This is a normal and helpful service.",
  },
  {
    id: 16,
    sender: '555-0104',
    text: "FINAL NOTICE: Your car's extended warranty is about to expire. Call us immediately at 1-800-555-1234 to avoid costly repairs.",
    isScam: true,
    explanation: "The 'car warranty' scam is very common. They use high-pressure tactics and vague information to get you to call and give them money or personal details.",
  },
  {
    id: 17,
    sender: 'Food Delivery',
    text: "Your driver, Kevin, is approaching with your order. Track his progress here: [map link]",
    isScam: false,
    explanation: "This is a standard and helpful notification from a food delivery service.",
  },
  {
    id: 18,
    sender: 'Social Media',
    text: "A login to your account from a new device in Moscow, Russia was detected. If this wasn't you, secure your account now: social-media-auth.com",
    isScam: true,
    explanation: "Scammers use fake security alerts mentioning foreign locations to create panic. The link leads to a phishing site, not the real social media platform.",
  },
  {
    id: 19,
    sender: 'Local School',
    text: "SCHOOL ALERT: All schools in the district are closed today due to snow. Stay safe!",
    isScam: false,
    explanation: "This is a typical mass notification sent by schools to parents and staff. It's informational and safe.",
  },
  {
    id: 20,
    sender: 'Unknown',
    text: "I have a package for you, but the address is incomplete. Please confirm your details here to schedule delivery: delivery-update-service.info",
    isScam: true,
    explanation: "This is a phishing attempt. Delivery companies have your address; they wouldn't ask for it via a random text link.",
  },
  {
    id: 21,
    sender: 'Credit Union',
    text: 'A large withdrawal of $2,500 was initiated from your account. If you did NOT authorize this, call our fraud dept at 555-011-9999 immediately.',
    isScam: true,
    explanation: "While it looks like a fraud alert, scammers want you to call their fake number. Always call the number on the back of your card or on the bank's official website, not one from a text.",
  },
  {
    id: 22,
    sender: 'Ride Share App',
    text: 'Your driver has arrived. Look for a blue Honda Civic, license plate XYZ-123.',
    isScam: false,
    explanation: 'This is a standard and expected notification from a ride-sharing service when you request a ride.',
  },
  {
    id: 23,
    sender: 'Charity',
    text: 'Help support victims of the recent flood. Every dollar helps. Donate now: redcross.org/donate',
    isScam: false,
    explanation: 'Reputable charities like the Red Cross do use text messages for fundraising, and linking to their official .org website is a safe practice.',
  },
  {
    id: 24,
    sender: '555-0105',
    text: 'Your phone has been infected with 5 viruses! You must install our security app to remove them: clean-my-phone-now.biz',
    isScam: true,
    explanation: 'Your phone cannot be scanned for viruses via text message. This is a lie to get you to install malicious software.',
  },
  {
    id: 25,
    sender: 'Library',
    text: 'The book "The Great Gatsby" is due tomorrow. Please return it to avoid late fees.',
    isScam: false,
    explanation: 'Many libraries offer text reminders for due dates. This is a helpful and safe service.',
  },
  {
    id: 26,
    sender: 'Netflix',
    text: 'Your Netflix account has been suspended due to payment issues. Please update your payment method here: netflix-reactivate.com',
    isScam: true,
    explanation: "This is a phishing scam. The URL is not the official Netflix domain. Always log in to your account directly through the app or official website.",
  },
  {
    id: 27,
    sender: 'Relative',
    text: "I'm at the grocery store, do we need milk?",
    isScam: false,
    explanation: "A simple, everyday message from a family member.",
  },
  {
    id: 28,
    sender: 'Jury Duty',
    text: 'You have missed your mandatory jury duty. A warrant has been issued for your arrest. Call 555-010-8765 to resolve this and pay the fine.',
    isScam: true,
    explanation: 'Courts do not issue arrest warrants via text message. This is a scare tactic to get you to call a scam number and pay a fake fine.',
  },
  {
    id: 29,
    sender: 'Your Bank',
    text: 'Our privacy policy has been updated. You can review the changes here on our official site: [bankname].com/privacy',
    isScam: false,
    explanation: 'Banks do send notifications about policy updates. As long as it directs you to their known, official website, it is safe.',
  },
  {
    id: 30,
    sender: 'Energy Company',
    text: 'URGENT: Your power will be disconnected in 30 minutes due to an unpaid bill. Pay immediately with a gift card by calling 1-888-555-FAKE to prevent shutoff.',
    isScam: true,
    explanation: 'Utility companies do not demand immediate payment via gift card. This is a high-pressure scam tactic. The request for a gift card is a major red flag.',
  },
  {
    id: 31,
    sender: 'Concert Venue',
    text: 'Your tickets for the concert tonight are ready! View them in your wallet: ticket-master.co/m/12345',
    isScam: true,
    explanation: "The URL is misspelled. It uses '.co' instead of '.com' to trick you. This fake link would steal your login details.",
  },
  {
    id: 32,
    sender: 'Local Restaurant',
    text: 'Your table for 2 at 7pm is confirmed. We look forward to seeing you tonight!',
    isScam: false,
    explanation: 'This is a standard and legitimate confirmation for a restaurant reservation you made.',
  },
  {
    id: 33,
    sender: 'Free-Vacations',
    text: 'You have been selected for a complimentary 3-night stay in Las Vegas! Your voucher code is LV2024. Call us to book your dates!',
    isScam: true,
    explanation: "Unsolicited 'free' vacation offers are almost always scams designed to lure you into high-pressure timeshare presentations or get you to pay hidden fees.",
  },
  {
    id: 34,
    sender: 'Gym',
    text: 'Reminder: Your Zumba class with Maria starts in 1 hour. See you there!',
    isScam: false,
    explanation: 'A normal, helpful reminder from a business you are a customer of.',
  },
  {
    id: 35,
    sender: '555-0106',
    text: 'We are buying houses in your neighborhood for cash. No repairs needed. Get a free, no-obligation offer today: webuyhomesfast.biz',
    isScam: true,
    explanation: "While some are legitimate, many of these are 'wholesaling' scams that use predatory contracts. The unofficial '.biz' URL is also a red flag.",
  },
  {
    id: 36,
    sender: 'HOA',
    text: 'Reminder: The monthly HOA meeting is tonight at 7 PM in the community clubhouse.',
    isScam: false,
    explanation: 'A standard notification from a Homeowners Association.',
  },
  {
    id: 37,
    sender: 'Post Office',
    text: 'A package is being held for you at the post office due to insufficient postage. You must pay $2.50 online to have it released: usps-tracking-portal.net',
    isScam: true,
    explanation: "This is a very common phishing scam. The Post Office does not operate this way, and the URL is not the official usps.gov.",
  },
  {
    id: 38,
    sender: 'Dating App',
    text: 'You have a new match! See who liked you: [app name].com/matches',
    isScam: false,
    explanation: 'This is a standard notification from a dating app you use.',
  },
  {
    id: 39,
    sender: '555-0107',
    text: 'Hey, I voted for you in the online photo contest! You should vote for me too: [link to a contest on a social media site]',
    isScam: false,
    explanation: "This is likely a legitimate message from a friend participating in an online contest. You can choose to help or ignore.",
  },
  {
    id: 40,
    sender: 'CryptoWallet',
    text: 'Your wallet has been compromised. You must re-validate your seed phrase to secure your assets. Click here: secure-crypto-wallet-verify.io',
    isScam: true,
    explanation: 'NEVER share your crypto seed phrase or enter it on a website from a link. This is a scam to steal all of your cryptocurrency.',
  },
  {
    id: 41,
    sender: 'Online Store',
    text: 'Your order #98765 has shipped! Track it here: [UPS/FedEx tracking link]',
    isScam: false,
    explanation: 'This is a standard and helpful shipping notification. As long as the link goes to the official carrier website, it is safe.',
  },
  {
    id: 42,
    sender: 'Voicemail',
    text: 'You have a new voicemail. Listen to it here: voicemail-access.ru',
    isScam: true,
    explanation: "Your phone has a built-in voicemail service; you would never need to click a link from a text. The '.ru' (Russia) domain is also a major red flag.",
  },
  {
    id: 43,
    sender: 'Local News',
    text: 'Weather Alert: A severe thunderstorm warning is in effect for your area until 5 PM.',
    isScam: false,
    explanation: 'Many local news stations offer text alerts for weather and breaking news. This is a legitimate service.',
  },
  {
    id: 44,
    sender: '555-0108',
    text: 'Did you request a password reset? If not, your account may be compromised. Click here to cancel the request: account-secure.org',
    isScam: true,
    explanation: "This is the opposite of a 2FA code. The scammer has requested a password reset for your account and wants you to click their fake 'cancel' link, which will steal your credentials.",
  },
  {
    id: 45,
    sender: 'Coworker',
    text: 'Can you send me the report from this morning? I can\'t seem to find it.',
    isScam: false,
    explanation: 'A normal work-related request from a known contact.',
  },
  {
    id: 46,
    sender: 'Student Loans',
    text: 'Great news! Due to new government programs, you are eligible for full student loan forgiveness. Apply before the deadline: student-relief-program.com',
    isScam: true,
    explanation: 'Official student loan information comes from .gov websites. Unsolicited offers of complete forgiveness are common scams.',
  },
  {
    id: 47,
    sender: 'Gas Station',
    text: 'Thanks for visiting us! As a rewards member, you just earned 10 points.',
    isScam: false,
    explanation: 'A standard notification from a customer loyalty program you signed up for.',
  },
  {
    id: 48,
    sender: 'DMV',
    text: 'Your drivers license is expiring. Renew online now to avoid late fees. Visit: dmv-renew-online.net',
    isScam: true,
    explanation: "This is a scam to steal your personal information and credit card details. Always go directly to the official DMV website for your state.",
  },
  {
    id: 49,
    sender: 'Survey',
    text: 'Complete this 30-second survey about your recent shopping experience and be entered to win $100! [link to survey]',
    isScam: false,
    explanation: 'Many companies use surveys to gather feedback. As long as it doesn\'t ask for overly personal information (like SSN or bank details), it is usually safe.',
  },
  {
    id: 50,
    sender: '555-0109',
    text: 'I am a Nigerian prince and I need your help to transfer $10 million out of my country. I will give you 20% if you help me. I just need your bank account details to start.',
    isScam: true,
    explanation: 'This is the classic "Nigerian Prince" advance-fee fraud scam. It is one of the oldest and most famous internet scams.',
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

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    setShuffledScenarios([...scenarios].sort(() => Math.random() - 0.5).slice(0, 8));
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

    