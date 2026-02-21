
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ChevronLeft, Check, AlertTriangle, ArrowRight, CheckCircle, XCircle, Lock, Volume2 } from 'lucide-react';
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
  },
  {
    id: 9,
    url: 'https://www.moe.gov.my',
    title: 'Ministry of Education Malaysia',
    body: 'Official portal for the Ministry of Education. Find information on schools, curriculum, and educational policies.',
    inputs: [],
    isSuspicious: false,
    explanation: "This is safe. 'moe.gov.my' is the official website for the Ministry of Education.",
  },
  {
    id: 10,
    url: 'https://my-passport-renewal.com',
    title: 'Online Passport Renewal',
    body: 'Renew your passport from the comfort of your home. Fast and easy. Enter all your details to begin.',
    inputs: [{ label: 'Full Name', placeholder: 'Your Name'}, { label: 'IC Number', placeholder: 'e.g., 900101-10-1234'}, { label: 'Credit Card', placeholder: '**** **** **** ****'}],
    isSuspicious: true,
    explanation: "This is suspicious. While online passport renewal exists, it's done through the official immigration department website (imi.gov.my). A '.com' address for this service is a major red flag.",
  },
  {
    id: 11,
    url: 'https://www.moh.gov.my',
    title: 'Ministry of Health Malaysia',
    body: 'The official source for health information, public health announcements, and healthcare policies in Malaysia.',
    inputs: [],
    isSuspicious: false,
    explanation: "This is safe. 'moh.gov.my' is the official website for the Ministry of Health.",
  },
  {
    id: 12,
    url: 'https://govt-grant-application.net',
    title: 'Federal Small Business Grant',
    body: 'Apply for the new Federal Small Business Grant of up to RM50,000. Application is free, just provide your business and personal bank details.',
    inputs: [{ label: 'Business Reg No', placeholder: 'e.g., 123456-A'}, { label: 'Personal Bank Account', placeholder: 'e.g., 1234567890'}],
    isSuspicious: true,
    explanation: "The '.net' domain is suspicious for a government grant. Scammers create fake grant websites to harvest banking information.",
  },
  {
    id: 13,
    url: 'https://www.epf.gov.my',
    title: 'KWSP / EPF Official Website',
    body: 'Welcome to the Employees Provident Fund official website. Log in to check your statement and manage your account.',
    inputs: [{ label: 'User ID', placeholder: 'Your ID'}, { label: 'Password', placeholder: 'Password'}],
    isSuspicious: false,
    explanation: "This is safe. 'epf.gov.my' is the correct and official domain for the EPF/KWSP.",
  },
  {
    id: 14,
    url: 'https://mygov-license-renewal.org',
    title: 'Driving License Renewal Service',
    body: 'Your driving license is expiring. Renew it online now to avoid going to JPJ. A small service fee applies.',
    inputs: [{ label: 'IC Number', placeholder: 'e.g., 900101-10-1234'}, { label: 'Credit Card Number', placeholder: 'For service fee'}],
    isSuspicious: true,
    explanation: "Suspicious. The domain is '.org', and official services are on 'gov.my'. While some third parties offer renewal services, it's safer to use the official government portal.",
  },
  {
    id: 15,
    url: 'https://www.dosm.gov.my',
    title: 'Department of Statistics Malaysia',
    body: 'The official portal for national statistics, census data, and economic indicators.',
    inputs: [],
    isSuspicious: false,
    explanation: "This is safe. 'dosm.gov.my' is the official website for the Department of Statistics.",
  },
  {
    id: 16,
    url: 'https://my-saman-diskaun.com',
    title: '50% Saman Discount',
    body: 'The government has announced a 50% discount on all traffic summons. Pay your summons through our portal to get the discount.',
    inputs: [{ label: 'IC Number', placeholder: 'e.g., 900101-10-1234'}, { label: 'Vehicle Number', placeholder: 'e.g., WXA 1234'}],
    isSuspicious: true,
    explanation: "This is a scam. While the government does occasionally offer discounts, they are claimed through official channels like MyBayar Saman, not a random '.com' website.",
  },
  {
    id: 17,
    url: 'https://www.wildlife.gov.my',
    title: 'Department of Wildlife and National Parks Peninsular Malaysia',
    body: 'Official website for PERHILITAN. Information about wildlife conservation, national parks, and related laws.',
    inputs: [],
    isSuspicious: false,
    explanation: "This is safe. 'wildlife.gov.my' is the official domain for PERHILITAN.",
  },
  {
    id: 18,
    url: 'https://unclaimed-money-gov.net',
    title: 'Check for Unclaimed Money',
    body: 'Millions in unclaimed money are held by the government. Check if you have any money waiting for you. A small search fee is required.',
    inputs: [{ label: 'IC Number', placeholder: 'e.g., 900101-10-1234'}],
    isSuspicious: true,
    explanation: "This is a scam. The official portal for checking unclaimed money in Malaysia (eGUMIS) does not charge a search fee. The '.net' domain is also a red flag.",
  },
  {
    id: 19,
    url: 'https://www.nadma.gov.my',
    title: 'National Disaster Management Agency',
    body: 'Official portal for disaster alerts, preparedness information, and management in Malaysia.',
    inputs: [],
    isSuspicious: false,
    explanation: "This is safe. 'nadma.gov.my' is the official government agency for disaster management.",
  },
  {
    id: 20,
    url: 'https://free-govt-laptop.org',
    title: 'Free Laptops for Students',
    body: 'The government is giving away free laptops to all students. Register your child now to receive one. Limited units available!',
    inputs: [{ label: 'Student Name', placeholder: 'Child\'s Name'}, { label: 'Parent IC Number', placeholder: 'e.g., 900101-10-1234'}, { label: 'Home Address', placeholder: 'Your Address'}],
    isSuspicious: true,
    explanation: "This is a phishing scam to collect personal data. Government aid programs are announced on official ministry websites, not on a '.org' site with a sense of urgency.",
  },
  {
    id: 21,
    url: 'https://www.perkeso.gov.my',
    title: 'SOCSO - Social Security Organization',
    body: 'The official portal for PERKESO. Manage your contributions, claims, and learn about social security schemes.',
    inputs: [{ label: 'IC Number', placeholder: 'e.g., 900101-10-1234'}, { label: 'Password', placeholder: 'Password'}],
    isSuspicious: false,
    explanation: "This is safe. 'perkeso.gov.my' is the official domain for SOCSO.",
  },
  {
    id: 22,
    url: 'https://gov.my-tax-relief.com',
    title: 'Special Tax Relief 2026',
    body: 'Missed out on tax relief? You can still apply for the special COVID-19 relief fund. Enter your details to see if you qualify.',
    inputs: [{ label: 'IC Number', placeholder: 'e.g., 900101-10-1234'}, { label: 'Bank Account', placeholder: 'e.g., 1234567890'}],
    isSuspicious: true,
    explanation: "The domain structure is deceptive. The real domain is 'my-tax-relief.com', not 'gov.my'. This is a phishing site.",
  },
  {
    id: 23,
    url: 'https://www.sprm.gov.my',
    title: 'Malaysian Anti-Corruption Commission (MACC)',
    body: 'Official portal of the MACC. Report corruption or learn about anti-corruption initiatives.',
    inputs: [],
    isSuspicious: false,
    explanation: "This is safe. 'sprm.gov.my' is the official domain for the MACC.",
  },
  {
    id: 24,
    url: 'http://register-voter-online.net',
    title: 'Online Voter Registration',
    body: 'Register to vote for the next election without leaving your home. Quick and simple online form.',
    inputs: [{ label: 'Full Name', placeholder: 'Your Name'}, { label: 'IC Number', placeholder: 'e.g., 900101-10-1234'}],
    isSuspicious: true,
    explanation: "This is suspicious. The site is not secure (HTTP) and is not the official Election Commission website (myspr.gov.my).",
  },
  {
    id: 25,
    url: 'https://www.kpdn.gov.my',
    title: 'Ministry of Domestic Trade and Consumer Affairs',
    body: 'Official portal for consumer rights, price controls, and domestic trade regulations.',
    inputs: [],
    isSuspicious: false,
    explanation: "This is safe. 'kpdn.gov.my' is the official ministry website.",
  },
  {
    id: 26,
    url: 'https://mygov.com/login',
    title: 'MyGOV Login',
    body: 'Welcome to the MyGOV portal. Access all government services with one login.',
    inputs: [{ label: 'Username', placeholder: 'Username'}, { label: 'Password', placeholder: 'Password'}],
    isSuspicious: true,
    explanation: "This is a subtle but important scam. The official Malaysian government portal is 'malaysia.gov.my'. 'mygov.com' is a different, unofficial site.",
  },
  {
    id: 27,
    url: 'https://www.bomba.gov.my',
    title: 'Fire and Rescue Department of Malaysia',
    body: 'Official portal of BOMBA. Fire safety tips, station directory, and emergency information.',
    inputs: [],
    isSuspicious: false,
    explanation: "This is safe. 'bomba.gov.my' is the official fire department website.",
  },
  {
    id: 28,
    url: 'https://national-census-2026.com',
    title: 'National Census 2026',
    body: 'All citizens are required to complete the census. Fill out your household information online.',
    inputs: [{ label: 'IC Number', placeholder: 'e.g., 900101-10-1234'}, { label: 'Full Address', placeholder: 'Your Address'}, { label: 'Household Income', placeholder: 'e.g., 5000'}],
    isSuspicious: true,
    explanation: "Official census activities are conducted via the Department of Statistics (dosm.gov.my). This '.com' site is a phishing attempt to collect sensitive data.",
  },
  {
    id: 29,
    url: 'https://www.rmp.gov.my',
    title: 'Royal Malaysia Police (PDRM)',
    body: 'Official portal of the PDRM. Find information, make reports, and check for updates.',
    inputs: [],
    isSuspicious: false,
    explanation: "This is safe. 'rmp.gov.my' is the official website for the Royal Malaysia Police.",
  },
  {
    id: 30,
    url: 'https://gov-financial-aid.net',
    title: 'Citizen Financial Aid',
    body: 'All citizens earning below RM4000 are eligible for a one-time payment of RM800. Apply now.',
    inputs: [{ label: 'IC Number', placeholder: 'e.g., 900101-10-1234'}, { label: 'Bank Statement', placeholder: 'Upload PDF'}],
    isSuspicious: true,
    explanation: "This is a scam. It asks you to upload a bank statement, which contains a lot of sensitive information, to an unofficial '.net' website.",
  },
  {
    id: 31,
    url: 'https://www.customs.gov.my',
    title: 'Royal Malaysian Customs Department',
    body: 'Official portal for import/export regulations, tax information, and customs procedures.',
    inputs: [],
    isSuspicious: false,
    explanation: "This is safe. 'customs.gov.my' is the official customs department website.",
  },
  {
    id: 32,
    url: 'https://free-gov-tablet-program.org',
    title: 'Free Tablets for Seniors',
    body: 'As part of the digital initiative, all senior citizens can claim a free tablet. Just pay for the shipping and handling fee of RM25.',
    inputs: [{ label: 'IC Number', placeholder: 'e.g., 450101-10-1234'}, { label: 'Credit Card', placeholder: 'For shipping fee'}],
    isSuspicious: true,
    explanation: "Scams often ask you to pay a small 'shipping' or 'processing' fee for a 'free' high-value item. This is how they steal your credit card details.",
  },
  {
    id: 33,
    url: 'https://www.parlimen.gov.my',
    title: 'Parliament of Malaysia',
    body: 'Official website of the Malaysian Parliament. Access Hansards, bills, and information about Members of Parliament.',
    inputs: [],
    isSuspicious: false,
    explanation: "This is safe. 'parlimen.gov.my' is the official website for the Parliament of Malaysia.",
  },
  {
    id: 34,
    url: 'https://official-govt-services.com',
    title: 'Official Government Services',
    body: 'Your one-stop portal for all government services. We help you renew licenses, pay summons, and more for a small fee.',
    inputs: [{ label: 'Service Needed', placeholder: 'e.g., Renew license'}, { label: 'IC Number', placeholder: 'e.g., 900101-10-1234'}],
    isSuspicious: true,
    explanation: "This site tries to impersonate an official portal but is a third-party service that charges fees for things you can do for free on official '.gov.my' websites.",
  },
  {
    id: 35,
    url: 'https://www.ssm.gov.my',
    title: 'Companies Commission of Malaysia (SSM)',
    body: 'Official portal to register a business, manage company information, and purchase company profiles.',
    inputs: [],
    isSuspicious: false,
    explanation: "This is safe. 'ssm.gov.my' is the official portal for business registration in Malaysia.",
  },
  {
    id: 36,
    url: 'https://gov.my.info/profile-update',
    title: 'National Profile Update',
    body: 'Mandatory: All citizens must update their profile in the national database. Please provide your full details.',
    inputs: [{ label: 'Full Name', placeholder: 'Your Name'}, { label: 'IC Number', placeholder: 'e.g., 900101-10-1234'}, { label: 'Mother\'s Maiden Name', placeholder: 'Your Answer'}],
    isSuspicious: true,
    explanation: "The domain 'gov.my.info' is not a real government domain. This is a phishing site trying to collect extremely sensitive personal information.",
  },
  {
    id: 37,
    url: 'https://www.myipo.gov.my',
    title: 'Intellectual Property Corporation of Malaysia',
    body: 'Official portal for trademarks, patents, and copyright information in Malaysia.',
    inputs: [],
    isSuspicious: false,
    explanation: "This is safe. 'myipo.gov.my' is the official IP portal for Malaysia.",
  },
  {
    id: 38,
    url: 'https://malaysian-government.com/lottery-winner',
    title: 'Government Lottery Winner',
    body: 'Congratulations! Your IC number has won the national lottery. Claim your prize of RM1,000,000 now!',
    inputs: [{ label: 'IC Number', placeholder: 'e.g., 900101-10-1234'}, { label: 'Bank Account', placeholder: 'For prize money'}],
    isSuspicious: true,
    explanation: 'Governments do not run lotteries like this. This is a scam to get your bank account details.',
  },
  {
    id: 39,
    url: 'https://www.mkn.gov.my',
    title: 'National Security Council (MKN)',
    body: 'Official portal for national security directives and announcements.',
    inputs: [],
    isSuspicious: false,
    explanation: "This is safe. 'mkn.gov.my' is the official MKN website.",
  },
  {
    id: 40,
    url: 'https://mygov-my.com',
    title: 'MyGov Malaysia',
    body: 'The real portal for Malaysian government services.',
    inputs: [],
    isSuspicious: true,
    explanation: "This is another typosquatting attempt. It looks very similar to the real 'malaysia.gov.my' but is a fake '.com' site.",
  },
  {
    id: 41,
    url: 'https://www.jpa.gov.my',
    title: 'Public Service Department of Malaysia (JPA)',
    body: 'Official portal for government scholarships, civil service careers, and public sector policies.',
    inputs: [],
    isSuspicious: false,
    explanation: "This is safe. 'jpa.gov.my' is the official JPA website.",
  },
  {
    id: 42,
    url: 'https://malaysia-gov.org',
    title: 'Malaysia Government Portal',
    body: 'An alternative portal for government services.',
    inputs: [],
    isSuspicious: true,
    explanation: "The '.org' domain is not used for the main government portal. This is an imposter site.",
  },
  {
    id: 43,
    url: 'https://www.mot.gov.my',
    title: 'Ministry of Transport Malaysia',
    body: 'Official portal for transport policies, agencies, and news.',
    inputs: [],
    isSuspicious: false,
    explanation: "This is safe. 'mot.gov.my' is the official website for the Ministry of Transport.",
  },
  {
    id: 44,
    url: 'https://jpj.com.my/check-summons',
    title: 'JPJ Summons Check',
    body: 'Check and pay your JPJ traffic summons here.',
    inputs: [{ label: 'Vehicle Number', placeholder: 'e.g., WXA 1234'}, { label: 'IC Number', placeholder: 'e.g., 900101-10-1234'}],
    isSuspicious: true,
    explanation: "This is a fake site. The official JPJ website is 'jpj.gov.my'. This '.com.my' site is an imposter.",
  },
  {
    id: 45,
    url: 'https://www.pmo.gov.my',
    title: 'Prime Minister\'s Office of Malaysia',
    body: 'The official website of the Prime Minister\'s Office.',
    inputs: [],
    isSuspicious: false,
    explanation: "This is safe. 'pmo.gov.my' is the official website.",
  },
  {
    id: 46,
    url: 'https://gov-portal.net',
    title: 'Government Portal',
    body: 'Log in to access all government services.',
    inputs: [{ label: 'Username', placeholder: 'Username'}, { label: 'Password', placeholder: 'Password'}],
    isSuspicious: true,
    explanation: "A generic name and a '.net' domain are big red flags. This is a phishing site.",
  },
  {
    id: 47,
    url: 'https://www.treasury.gov.my',
    title: 'Malaysian Treasury',
    body: 'Official portal for the Malaysian Treasury, under the Ministry of Finance.',
    inputs: [],
    isSuspicious: false,
    explanation: "This is safe. 'treasury.gov.my' is an official government domain.",
  },
  {
    id: 48,
    url: 'https://national-id-update.com',
    title: 'MyKAD Update',
    body: 'Your MyKAD requires an update to the new chip. Please enter your details to schedule an appointment and pre-verify.',
    inputs: [{ label: 'IC Number', placeholder: 'e.g., 900101-10-1234'}, { label: 'Full Address', placeholder: 'Your Address'}],
    isSuspicious: true,
    explanation: "MyKAD updates are handled by the National Registration Department (jpn.gov.my), not a generic '.com' site. This is a phishing attempt.",
  },
  {
    id: 49,
    url: 'https://www.mycensus.gov.my',
    title: 'Malaysia Census 2020',
    body: 'The official portal for the 2020 Malaysian Census data and publications.',
    inputs: [],
    isSuspicious: false,
    explanation: "This is safe. While the data is from 2020, this is an official '.gov.my' statistics website.",
  },
  {
    id: 50,
    url: 'https://mygov.my-login.com',
    title: 'MYGOV LOGIN',
    body: 'Secure login to MyGov services.',
    inputs: [{ label: 'Username', placeholder: 'Username'}, { label: 'Password', placeholder: 'Password'}],
    isSuspicious: true,
    explanation: "This is another subdomain trick. The real domain here is 'my-login.com', which is a phishing site, not a government one.",
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
    return (
        <FakeBrowserFrame url={currentScenario.url}>
            <div className='text-center space-y-4'>
                <h2 className='text-2xl font-bold text-primary'>{currentScenario.title}</h2>
                <div className="flex items-center gap-2">
                    <p className='text-muted-foreground flex-grow text-left'>{currentScenario.body}</p>
                    <Button variant="ghost" size="icon" onClick={() => handleSpeak(textToSpeak)} className="shrink-0 self-center" aria-label="Read content aloud">
                        <Volume2 className="h-5 w-5" />
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

    