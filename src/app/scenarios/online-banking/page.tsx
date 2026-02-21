
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Landmark, ChevronLeft, Check, X, ArrowRight, CheckCircle, XCircle, Volume2 } from 'lucide-react';
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
  },
  // New Scenarios
  {
    id: 9,
    type: 'notification',
    text: "Your account balance is below $100.",
    isScam: false,
    explanation: "This is a helpful low-balance alert that many banks offer."
  },
  {
    id: 10,
    type: 'email',
    sender: 'rewards@net-bank.com',
    subject: 'Claim Your Cash Back Reward!',
    text: "You've earned $25 in cash back rewards! Click here to log in and redeem: net-bank.rewards-portal.com",
    isScam: true,
    explanation: "Scammers create fake rewards portals to steal your login credentials. Always access your rewards through the bank's official website."
  },
  {
    id: 11,
    type: 'notification',
    text: "A new device has been registered to your online banking profile. If this was not you, please contact us.",
    isScam: false,
    explanation: "This is a legitimate and important security notification. If you didn't add a new device, you should contact your bank immediately (using their official number)."
  },
  {
    id: 12,
    type: 'offer',
    text: "Invest in our new high-yield crypto portfolio and get guaranteed 20% returns in 30 days! Limited time offer!",
    isScam: true,
    explanation: "Banks are typically very conservative. Promises of 'guaranteed' high returns, especially with cryptocurrency, are a major red flag for an investment scam."
  },
  {
    id: 13,
    type: 'login',
    url: 'https://www.net-bank.com/login?session=12345',
    text: "You are logging into your bank. The URL is https://www.net-bank.com/login?session=12345. Is this safe?",
    isScam: false,
    explanation: "The core domain `net-bank.com` is correct and it uses HTTPS. The extra text after the domain is a session ID and is normal.",
  },
  {
    id: 14,
    type: 'email',
    sender: 'ceo@net-bank.com',
    subject: 'Urgent and Confidential Request',
    text: "I need you to process a wire transfer immediately for a sensitive acquisition. I can't talk on the phone. Please reply for the details. This is time-sensitive.",
    isScam: true,
    explanation: "This is a 'CEO fraud' or 'business email compromise' scam. Scammers impersonate executives to create urgency and bypass normal procedures. A real CEO would never make such a request this way.",
  },
  {
    id: 15,
    type: 'notification',
    text: "Your new debit card has been shipped and should arrive in 5-7 business days.",
    isScam: false,
    explanation: "If you recently requested a new card, this is a normal and helpful notification.",
  },
  {
    id: 16,
    type: 'email',
    sender: 'it.department@net-bank-support.org',
    subject: 'Scheduled Maintenance: Please Verify Your Account',
    text: "We are performing system upgrades this weekend. To ensure your account is not deactivated, please log in and verify your credentials now at the link below.",
    isScam: true,
    explanation: "The email address domain is unofficial, and the request to log in via a link due to 'maintenance' is a common phishing tactic.",
  },
  {
    id: 17,
    type: 'notification',
    text: "The interest rate on your savings account has increased to 1.5% APY.",
    isScam: false,
    explanation: "This is a standard informational update from a bank about your account terms.",
  },
  {
    id: 18,
    type: 'offer',
    text: "You are eligible for mortgage refinancing at a record-low rate! There are no fees to apply. See your new rate now: fast-refi-netbank.com",
    isScam: true,
    explanation: "This is a phishing attempt to collect a lot of personal financial data. The URL is not the official bank site. Always initiate refinancing through official channels.",
  },
  {
    id: 19,
    type: 'login',
    url: 'http://www.net-bank.com',
    text: "The address in your browser is http://www.net-bank.com. Is this safe to log into?",
    isScam: true,
    explanation: "This is NOT safe. The 'http' (instead of 'https') means the connection is not encrypted. Never enter personal information on a non-HTTPS site.",
  },
  {
    id: 20,
    type: 'email',
    sender: 'service@net-bank.com',
    subject: 'A large file is waiting for you',
    text: "You have received a large, encrypted document from your financial advisor. Please download it from our secure portal and log in to view.",
    isScam: true,
    explanation: "Unsolicited emails with attachments or download links, even if they seem to be from a bank, are a common way to deliver malware.",
  },
  {
    id: 21,
    type: 'notification',
    text: 'A check you deposited has cleared.',
    isScam: false,
    explanation: 'A standard and helpful notification about your account activity.',
  },
  {
    id: 22,
    type: 'email',
    sender: 'customer.care@net-bank.com',
    subject: 'We need to speak with you',
    text: 'We have an important matter to discuss regarding your account. Please call us back at 1-888-555-SCAM.',
    isScam: true,
    explanation: 'Scammers use vague but urgent-sounding emails to get you to call a fraudulent number. Always call the number on the back of your card.',
  },
  {
    id: 23,
    type: 'notification',
    text: "A recurring payment of $14.99 to 'Streaming Service' is scheduled for tomorrow.",
    isScam: false,
    explanation: 'This is a helpful reminder about an upcoming automatic payment.',
  },
  {
    id: 24,
    type: 'offer',
    text: 'Switch to our new Platinum credit card and get a 50,000 point bonus! You can upgrade your account instantly inside the app.',
    isScam: false,
    explanation: 'Banks regularly market new products to their existing customers. Since the offer directs you to the official app, it is safe.',
  },
  {
    id: 25,
    type: 'email',
    sender: 'fraud.prevention@net-bank.co',
    subject: 'Fraud Alert - Unusual Transaction',
    text: 'We blocked a transaction of $500 in a foreign country. Was this you? Click YES or NO below.',
    isScam: true,
    explanation: "The email domain is '.co' instead of '.com'. Scammers often use these subtle differences. Clicking either 'YES' or 'NO' could lead to a malicious site or download.",
  },
  {
    id: 26,
    type: 'notification',
    text: 'Your e-statement is ready. Please log in to your account to view it.',
    isScam: false,
    explanation: 'This is a standard notification. It correctly advises you to log in to your account through normal means, not via a link.',
  },
  {
    id: 27,
    type: 'login',
    url: 'https://www.nett-bank.com',
    text: "The URL is https://www.nett-bank.com. Notice the extra 't'. Is this safe?",
    isScam: true,
    explanation: "This is a typosquatting attack. The extra 't' in 'nett-bank' means it's a fraudulent site designed to look like the real one.",
  },
  {
    id: 28,
    type: 'notification',
    text: 'You have successfully logged out of your online banking session.',
    isScam: false,
    explanation: 'A standard security notification confirming your session has ended.',
  },
  {
    id: 29,
    type: 'sms',
    sender: '1-800-BANKING',
    text: 'Your debit card has been deactivated. To reactivate, please reply with your full card number, expiration date, and CVV.',
    isScam: true,
    explanation: 'A bank will NEVER ask for your full card number, expiration date, and CVV via text. This is a direct attempt to steal your card information.',
  },
  {
    id: 30,
    type: 'email',
    sender: 'support@net-bank.com',
    subject: 'We\'ve updated our app!',
    text: 'Our new and improved mobile app is here. Download the update from the official Apple App Store or Google Play Store today!',
    isScam: false,
    explanation: 'This is safe. It directs you to the official, secure app stores to get the update, not a third-party link.',
  },
  {
    id: 31,
    type: 'notification',
    text: 'Your request to change your address has been received.',
    isScam: false,
    explanation: 'This is a legitimate security confirmation. If you did not request an address change, you should contact the bank immediately.',
  },
  {
    id: 32,
    type: 'offer',
    text: 'You have unclaimed funds! The government has authorized us to release $1,200 to you. A small processing fee of $25 is required. Click to claim.',
    isScam: true,
    explanation: "This is an advance-fee scam. Any offer that requires you to pay a fee to receive a larger sum of money is a scam.",
  },
  {
    id: 33,
    type: 'notification',
    text: 'A transfer of $100 to "John Smith" was successful.',
    isScam: false,
    explanation: 'A standard notification confirming a peer-to-peer payment you initiated.',
  },
  {
    id: 34,
    type: 'email',
    sender: 'survey@net-bank.com',
    subject: 'Tell us how we\'re doing and win $50!',
    text: 'Complete our 2-minute customer satisfaction survey. As a thank you, you will be entered into a drawing for a $50 gift card.',
    isScam: false,
    explanation: 'Many banks conduct legitimate surveys to gather feedback. As long as it does not ask for sensitive account details, it is safe to participate.',
  },
  {
    id: 35,
    type: 'sms',
    sender: '555-123-4567',
    text: 'Your Zelle payment of $300 to "Crypto Seller" has been flagged. Please reply YES to approve or NO to cancel.',
    isScam: true,
    explanation: 'Scammers send fake payment notifications and hope you reply "NO". They will then call you, pretending to be the bank, and trick you into sending them money "to reverse the charge".',
  },
  {
    id: 36,
    type: 'notification',
    text: 'Your credit card payment is due in 3 days.',
    isScam: false,
    explanation: 'A standard, helpful payment reminder from your bank.',
  },
  {
    id: 37,
    type: 'login',
    url: '123.45.67.89/net-bank/login.html',
    text: "The URL in your browser is an IP address: 123.45.67.89/net-bank/login.html. Is this safe?",
    isScam: true,
    explanation: "Legitimate bank websites will always use a domain name (like net-bank.com), not a raw IP address. This is a sign of a phishing site.",
  },
  {
    id: 38,
    type: 'offer',
    text: 'As a valued customer, we are offering you a free credit report analysis. Please schedule an appointment with one of our bankers.',
    isScam: false,
    explanation: 'This is a legitimate service offered by many banks. It directs you to make an appointment, which is a safe and normal process.',
  },
  {
    id: 39,
    type: 'email',
    sender: 'security@net-bank.com',
    subject: 'Your security questions have been changed',
    text: 'The security questions for your online account were updated. If you did not make this change, please contact us immediately.',
    isScam: false,
    explanation: 'This is a critical and legitimate security alert. You should verify its legitimacy by contacting your bank via official channels if you did not make this change.',
  },
  {
    id: 40,
    type: 'sms',
    sender: '555-987-6543',
    text: 'A wire transfer requires your approval. Please log in to approve: net-bank.com.us/wires',
    isScam: true,
    explanation: "The domain is '.com.us', which is not a standard bank domain. This is an attempt to look legitimate while being a phishing site.",
  },
  {
    id: 41,
    type: 'notification',
    text: 'A new message is available in your secure message center.',
    isScam: false,
    explanation: 'This is a safe notification. Banks use secure message centers on their websites to communicate sensitive information, and will notify you to log in and check it.',
  },
  {
    id: 42,
    type: 'email',
    sender: 'support@net-bank.com',
    subject: 'Your account is overdrawn',
    text: 'Your checking account is overdrawn. An overdraft fee of $35 has been charged. Please log in to review your account.',
    isScam: false,
    explanation: 'This is a standard overdraft notification. It correctly advises you to log in through normal means to check your account.',
  },
  {
    id: 43,
    type: 'offer',
    text: 'Open a new savings account and we will deposit a $200 bonus after you meet the minimum balance requirements. Learn more on our website.',
    isScam: false,
    explanation: 'This is a very common and legitimate promotional offer from a bank.',
  },
  {
    id: 44,
    type: 'email',
    sender: 'alerts@net-bank.com',
    subject: 'We noticed you logged in from a new browser',
    text: 'We saw a login from Chrome on Windows. If this was you, you can ignore this message.',
    isScam: false,
    explanation: 'This is a common security feature to alert you to new login activity.',
  },
  {
    id: 45,
    type: 'login',
    url: 'https://net-bank.com.login-portal.com',
    text: 'Is the URL https://net-bank.com.login-portal.com safe to use?',
    isScam: true,
    explanation: "This is a subdomain trick. The real domain is 'login-portal.com', not 'net-bank.com'. This is a common way to create deceptive phishing URLs.",
  },
  {
    id: 46,
    type: 'notification',
    text: 'Your request for a stop payment on check #1234 has been processed.',
    isScam: false,
    explanation: 'A standard confirmation for a service you requested.',
  },
  {
    id: 47,
    type: 'email',
    sender: 'support@net-bank.com',
    subject: 'Action Required: Your e-statements are ready',
    text: 'You have new documents. A PDF is attached to this email for your convenience.',
    isScam: true,
    explanation: 'Legitimate banks will not send statements or sensitive documents as email attachments due to security risks. They will ask you to log in to their website to view them.',
  },
  {
    id: 48,
    type: 'offer',
    text: 'Get 5% cash back on all gas and grocery purchases this month. No activation required!',
    isScam: false,
    explanation: 'This is a common type of promotional offer for credit card rewards.',
  },
  {
    id: 49,
    type: 'sms',
    sender: 'NetBank',
    text: 'Your One-Time Passcode is 987123. Do not share this with anyone. We will never call you to ask for this code.',
    isScam: false,
    explanation: 'This is a standard and legitimate 2-factor authentication message. It also provides a helpful security tip.',
  },
  {
    id: 50,
    type: 'email',
    sender: 'inheritance.dept@net-bank.com',
    subject: 'You are the beneficiary of a large inheritance',
    text: 'We are contacting you because you have been named the beneficiary of a $5 million estate. Please provide your personal information and a small legal fee to begin the claims process.',
    isScam: true,
    explanation: 'This is an advance-fee or inheritance scam. Legitimate legal processes are not handled this way, and any request for a fee to unlock a larger sum of money is a scam.',
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
      sessionStorage.setItem(`results-${scenarioId}`, JSON.stringify(answers));
      router.push(`/scenarios/${scenarioId}/summary`);
    }
  };

  const renderScenarioContent = () => {
    const content = (
      <>
        {currentScenario.type === 'email' && (
          <div className="text-left text-sm p-4 border rounded-lg bg-card">
            <div className="flex justify-between text-muted-foreground">
              <p>From: {currentScenario.sender}</p>
              <p>Subject: {currentScenario.subject}</p>
            </div>
            <hr className="my-2"/>
            <p className="mt-4 text-base">“{currentScenario.text}”</p>
          </div>
        )}
        {currentScenario.type === 'login' && (
             <Alert variant='default'>
                <AlertTitle>Check the URL</AlertTitle>
                <AlertDescription>
                    <p className='text-base mb-2'>“{currentScenario.text}”</p>
                    <div className="font-mono bg-muted p-2 rounded-md text-center">
                        {currentScenario.url}
                    </div>
                </AlertDescription>
            </Alert>
        )}
        {(currentScenario.type !== 'email' && currentScenario.type !== 'login') && (
            <div className="bg-card text-card-foreground p-4 rounded-xl shadow-md">
                <p className="text-base sm:text-lg">“{currentScenario.text}”</p>
            </div>
        )}
      </>
    );

    return (
        <div className="flex items-center gap-2">
            <div className="flex-grow">{content}</div>
            <Button variant="ghost" size="icon" onClick={() => handleSpeak(currentScenario.text)} className="shrink-0" aria-label="Read message aloud">
                <Volume2 className="h-5 w-5" />
            </Button>
        </div>
    );
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

    