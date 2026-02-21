
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Check, X, ArrowRight, CheckCircle, XCircle, Heart, MessageCircle, Send, Bookmark, Users, Volume2 } from 'lucide-react';
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
  },
  {
    id: 9,
    platform: 'Facebook',
    profileName: 'Work From Home Jobs',
    profileImage: placeholderImageMap['social-profile-recruiter'].imageUrl,
    image: placeholderImageMap['social-post-job'].imageUrl,
    text: "Easy remote job! Process payments from home. No experience needed. Earn $2000/week. We send you checks, you deposit them and send us a portion back via wire transfer. DM to start!",
    isScam: true,
    explanation: "This is a check kiting or money mule scam. The checks they send are fake, and you will be responsible for the money you wire to them when the bank discovers the fraud.",
  },
  {
    id: 10,
    platform: 'Instagram',
    profileName: 'YourFriendFromCollege',
    profileImage: placeholderImageMap['social-profile-friend2'].imageUrl,
    image: placeholderImageMap['social-post-vacation'].imageUrl,
    text: "Had the most amazing time in Bali! Can't wait to go back. #travel #bali",
    isScam: false,
    explanation: "This is a normal vacation post from a friend. There's nothing suspicious about it.",
  },
  {
    id: 11,
    platform: 'Facebook',
    profileName: 'Global News Network',
    profileImage: placeholderImageMap['social-profile-news'].imageUrl,
    image: placeholderImageMap['social-post-breaking'].imageUrl,
    text: "BREAKING: Scientists discover a new species of deep-sea fish. Read the full story on our website.",
    isScam: false,
    explanation: "This is a standard post from a reputable news organization, directing you to their official website for more information.",
  },
  {
    id: 12,
    platform: 'Instagram',
    profileName: 'Dr. Health',
    profileImage: placeholderImageMap['social-profile-health'].imageUrl,
    image: placeholderImageMap['social-post-pills'].imageUrl,
    text: "Tired of modern medicine? My all-natural supplement cures everything from joint pain to memory loss in just one week. Click the link in my bio to order. Not sold in stores!",
    isScam: true,
    explanation: "Claims of a 'miracle cure' for a wide range of ailments are a huge red flag for a health scam. Always consult a real doctor before taking any supplements.",
  },
  {
    id: 13,
    platform: 'Facebook DM',
    profileName: 'A Stranger',
    profileImage: placeholderImageMap['social-profile-john'].imageUrl,
    image: null,
    text: "I like your profile picture. You have a beautiful smile. Where are you from?",
    isScam: false,
    explanation: "While unsolicited messages from strangers can sometimes be the start of a scam, this message itself is not inherently a scam. It's a common way people try to connect. You should still be cautious about what information you share.",
  },
  {
    id: 14,
    platform: 'Facebook',
    profileName: 'Pawsitive Pet Shelter',
    profileImage: placeholderImageMap['social-profile-pet-shelter'].imageUrl,
    image: placeholderImageMap['social-post-puppy'].imageUrl,
    text: "This is Milo! He's a 3-month-old terrier mix looking for his forever home. He loves cuddles and chasing toys. Visit our shelter to meet him! #AdoptDontShop",
    isScam: false,
    explanation: "This is a legitimate post from an animal shelter. They are providing information and inviting you to their physical location, which is safe.",
  },
  {
    id: 15,
    platform: 'Instagram DM',
    profileName: 'celeb_official_account',
    profileImage: placeholderImageMap['social-profile-celebrity'].imageUrl,
    image: null,
    text: "Hey, it's me! Thanks for being such a loyal fan. As a thank you, I'm giving $1000 to my first 100 fans who message me back. Just send me your CashApp tag!",
    isScam: true,
    explanation: "This is an impersonation scam. A real celebrity would not contact you directly to give you money. The account is likely fake, even if it looks real.",
  },
  {
    id: 16,
    platform: 'Instagram',
    profileName: 'GamerGod42',
    profileImage: placeholderImageMap['social-profile-gamer'].imageUrl,
    image: placeholderImageMap['social-post-game'].imageUrl,
    text: "Just beat the final boss in Elden Ring! What a journey. 150 hours well spent. #gaming #eldenring",
    isScam: false,
    explanation: "This is a typical post from a fellow gamer sharing their accomplishments. It's a safe and normal part of the online community.",
  },
  {
    id: 17,
    platform: 'Facebook',
    profileName: 'LuxeCar Official',
    profileImage: placeholderImageMap['social-profile-car-brand'].imageUrl,
    image: placeholderImageMap['social-post-car'].imageUrl,
    text: "The new 2026 LuxeCar GT has arrived. Experience the pinnacle of performance and luxury. Visit your local dealer for a test drive.",
    isScam: false,
    explanation: "This is a standard advertisement from a verified brand page. It encourages you to visit a physical dealership, which is a legitimate sales process.",
  },
  {
    id: 18,
    platform: 'Instagram',
    profileName: 'Foodie Adeline',
    profileImage: placeholderImageMap['social-profile-foodie'].imageUrl,
    image: placeholderImageMap['social-post-food'].imageUrl,
    text: "Tried the new cafe downtown. This avocado toast was divine! 10/10 would recommend. #foodblogger #cafe",
    isScam: false,
    explanation: "This is a normal post from a food blogger or enthusiast sharing their opinion. It is safe.",
  },
  {
    id: 19,
    platform: 'Facebook',
    profileName: 'SmartPhone Inc.',
    profileImage: placeholderImageMap['social-profile-phone-brand'].imageUrl,
    image: placeholderImageMap['social-post-phone'].imageUrl,
    text: "We're giving away 100 of our new SmartPhone X to celebrate our anniversary! To enter: 1. Like this post. 2. Share it. 3. Comment why you need a new phone. Winners will be announced next week!",
    isScam: false,
    explanation: "This is a common and often legitimate marketing tactic used by brands to increase engagement. The entry methods don't require personal information, so it's safe to participate.",
  },
  {
    id: 20,
    platform: 'Facebook',
    profileName: 'Which Disney Princess Are You?',
    profileImage: placeholderImageMap['social-profile-quiz'].imageUrl,
    image: placeholderImageMap['social-post-quiz'].imageUrl,
    text: "Take our fun quiz! Answer a few simple questions like 'What was your mother's maiden name?' and 'What was the name of your first pet?' to find out which princess you are!",
    isScam: true,
    explanation: "This is a data harvesting scam disguised as a fun quiz. The questions it asks are common security questions for bank accounts and other services. Never share this information publicly.",
  },
  {
    id: 21,
    platform: 'Facebook',
    profileName: 'Your Grandma',
    profileImage: placeholderImageMap['social-profile-grandma'].imageUrl,
    image: placeholderImageMap['social-post-baby'].imageUrl,
    text: "Look at my beautiful new great-grandchild! So proud!",
    isScam: false,
    explanation: "A typical post from a family member sharing happy news. This is safe.",
  },
  {
    id: 22,
    platform: 'Instagram DM',
    profileName: 'your_friend_anna',
    profileImage: placeholderImageMap['social-profile-anna'].imageUrl,
    image: null,
    text: 'Hey! Are you free to chat? I have a question about that photo you posted.',
    isScam: false,
    explanation: 'This is a normal message from a friend. It is safe to reply.',
  },
  {
    id: 23,
    platform: 'Instagram',
    profileName: 'petals_and_plots',
    profileImage: placeholderImageMap['social-profile-gardener'].imageUrl,
    image: placeholderImageMap['social-post-garden'].imageUrl,
    text: 'My rose garden is finally in full bloom! The hard work paid off. #gardening #roses',
    isScam: false,
    explanation: 'A safe and normal post from a hobbyist sharing their garden.',
  },
  {
    id: 24,
    platform: 'Facebook',
    profileName: 'Lost & Found',
    profileImage: placeholderImageMap['social-profile-lost-item'].imageUrl,
    image: placeholderImageMap['social-post-lost-wallet'].imageUrl,
    text: 'I found a wallet near the library with an ID for "Robert Smith". If this is you, message me with the address on the ID to confirm and I can get it back to you.',
    isScam: false,
    explanation: 'This is a good samaritan trying to return a lost item. Their method of asking for confirmation before returning it is a secure and sensible approach.',
  },
  {
    id: 25,
    platform: 'Facebook',
    profileName: 'TechSupport247',
    profileImage: placeholderImageMap['social-profile-tech-support'].imageUrl,
    image: placeholderImageMap['social-post-virus-warning'].imageUrl,
    text: "Your computer has been detected broadcasting viruses on our network! Your IP address is public. You MUST call our support line at 1-800-FAKE-SPT immediately to purchase our removal tool or your internet will be disconnected.",
    isScam: true,
    explanation: 'This is a tech support scam. They use scare tactics and fake technical jargon to panic you into calling them and paying for unnecessary or fake services.',
  },
  {
    id: 26,
    platform: 'Instagram DM',
    profileName: 'BrandAmbassadorSearch',
    profileImage: placeholderImageMap['social-profile-recruiter'].imageUrl,
    image: null,
    text: "We love your style! We want to offer you a brand ambassador deal. You'll get free products and get paid to post. To start, you just need to buy our 'starter kit' for a small fee of $50.",
    isScam: true,
    explanation: "Legitimate brand ambassador programs do not require you to pay them. This is a scam to get you to pay the 'starter kit' fee.",
  },
  {
    id: 27,
    platform: 'Facebook',
    profileName: 'Your Friend',
    profileImage: placeholderImageMap['social-profile-friend2'].imageUrl,
    image: null,
    text: 'Help me win a contest by liking this photo!',
    isScam: false,
    explanation: 'A common and harmless request from a friend. It is safe to help them out.',
  },
  {
    id: 28,
    platform: 'Instagram',
    profileName: 'TravelWithTom',
    profileImage: placeholderImageMap['social-profile-john'].imageUrl,
    image: placeholderImageMap['social-post-vacation'].imageUrl,
    text: "I'm giving away two round-trip tickets to Hawaii! Just click the link in my bio, complete a short survey, and provide your credit card details for a $1 verification fee.",
    isScam: true,
    explanation: "This is a scam to steal your credit card information. The 'small verification fee' is a common trick.",
  },
  {
    id: 29,
    platform: 'Facebook',
    profileName: 'Local Restaurant',
    profileImage: placeholderImageMap['social-profile-foodie'].imageUrl,
    image: placeholderImageMap['social-post-food'].imageUrl,
    text: 'This week only! Show this post to your server to get a free appetizer with any main course purchase.',
    isScam: false,
    explanation: 'This is a legitimate promotion from a local business. It is safe.',
  },
  {
    id: 30,
    platform: 'Instagram DM',
    profileName: 'Your Aunt Carol',
    profileImage: placeholderImageMap['social-profile-aunt'].imageUrl,
    image: null,
    text: "Hi sweetie, I saw this great investment opportunity for cryptocurrency and the man said if we sign up together we get a bonus. You should check it out: crypto-for-sure.com",
    isScam: true,
    explanation: "Your aunt's account has likely been hacked. The scammer is now using it to try and lure her friends and family into an investment scam.",
  },
  {
    id: 31,
    platform: 'Facebook',
    profileName: 'Police Department',
    profileImage: placeholderImageMap['social-profile-community'].imageUrl,
    image: null,
    text: 'Traffic Advisory: A major accident has closed all lanes on the main highway. Please use alternate routes.',
    isScam: false,
    explanation: 'This is a legitimate public service announcement from a local authority.',
  },
  {
    id: 32,
    platform: 'Instagram',
    profileName: 'ShopLuxe Fashion',
    profileImage: placeholderImageMap['social-profile-recruiter'].imageUrl,
    image: placeholderImageMap['social-post-job'].imageUrl,
    text: "We accidentally sent you a duplicate order worth $500! Please send it back to our 'returns manager' at this address. We'll send you a gift card for your trouble!",
    isScam: true,
    explanation: 'This is a reshipping scam. The items were bought with stolen credit cards, and they are tricking you into being an accomplice by shipping the stolen goods to them.',
  },
  {
    id: 33,
    platform: 'Facebook',
    profileName: 'Your Neighbor',
    profileImage: placeholderImageMap['social-profile-john'].imageUrl,
    image: null,
    text: 'Hey, I\'m going out of town for the weekend. Could you grab my mail for me?',
    isScam: false,
    explanation: 'A normal request from a neighbor. This is safe.',
  },
  {
    id: 34,
    platform: 'Instagram',
    profileName: 'MysticMeg',
    profileImage: placeholderImageMap['social-profile-health'].imageUrl,
    image: null,
    text: 'I am a psychic and I have had a vision about you. Your financial future is in peril, but I can help. For $100, I will perform a cleansing ritual to remove the curse.',
    isScam: true,
    explanation: 'This is a fortune-teller scam that preys on peoples fears and superstitions to get money from them.',
  },
  {
    id: 35,
    platform: 'Facebook',
    profileName: 'Political Candidate',
    profileImage: placeholderImageMap['social-profile-recruiter'].imageUrl,
    image: null,
    text: 'Thank you for your support. Please consider donating to my campaign to help us reach our goal!',
    isScam: false,
    explanation: 'This is a standard fundraising request from a political campaign you likely follow or have supported in the past.',
  },
  {
    id: 36,
    platform: 'Instagram DM',
    profileName: 'A Stranger',
    profileImage: placeholderImageMap['social-profile-gamer'].imageUrl,
    image: null,
    text: 'I accidentally reported your account for fraud! You need to talk to the Instagram admin "Steve" to get it fixed or your account will be deleted. His profile is @admin_steve_official',
    isScam: true,
    explanation: "This is a scam to get you to contact a fake 'admin', who will then try to steal your password or get you to pay a fee to 'unlock' your account. Instagram support does not work this way.",
  },
  {
    id: 37,
    platform: 'Facebook',
    profileName: 'Local Charity',
    profileImage: placeholderImageMap['social-profile-charity'].imageUrl,
    image: placeholderImageMap['social-post-charity'].imageUrl,
    text: 'Our annual food drive is this Saturday! Please drop off non-perishable items at our downtown location between 9am and 5pm. Thank you for your support!',
    isScam: false,
    explanation: 'A legitimate post from a local charity organizing a community event.',
  },
  {
    id: 38,
    platform: 'Instagram',
    profileName: 'Hacker',
    profileImage: placeholderImageMap['social-profile-crypto'].imageUrl,
    image: null,
    text: "I have hacked your account and I have compromising photos of you. If you don't send me $500 in Bitcoin, I will send them to all your followers.",
    isScam: true,
    explanation: 'This is a sextortion scam. Most of the time, the hacker has nothing and is bluffing. Do not pay them. Report the account and block them.',
  },
  {
    id: 39,
    platform: 'Facebook',
    profileName: 'DIY Crafts',
    profileImage: placeholderImageMap['social-profile-baker'].imageUrl,
    image: placeholderImageMap['social-post-cake'].imageUrl,
    text: 'Check out this tutorial on how to make your own candles! Full video on our YouTube channel.',
    isScam: false,
    explanation: 'A normal post from a content creator, sharing their hobby and directing you to their other social media.',
  },
  {
    id: 40,
    platform: 'Instagram DM',
    profileName: 'your_friend_anna',
    profileImage: placeholderImageMap['social-profile-anna'].imageUrl,
    image: null,
    text: 'Can you vote for my daughter in this cute baby contest? [link to shady website]',
    isScam: true,
    explanation: "Your friend's account is likely hacked. The link is probably a phishing link to steal information or spread malware. Verify with your friend through another method (like a phone call).",
  },
  {
    id: 41,
    platform: 'Facebook',
    profileName: 'College Alumni Group',
    profileImage: placeholderImageMap['social-profile-community'].imageUrl,
    image: null,
    text: 'Reminder: Our 10-year reunion is next month! Buy your tickets at the link in the group description.',
    isScam: false,
    explanation: 'A legitimate announcement within a private group you are a member of.',
  },
  {
    id: 42,
    platform: 'Instagram',
    profileName: 'FreebieFinds',
    profileImage: placeholderImageMap['social-profile-quiz'].imageUrl,
    image: placeholderImageMap['social-post-phone'].imageUrl,
    text: 'We are testing a new phone and need product testers! You get to keep the phone. Sign up at the link in our bio. You will need to provide a credit card for shipping insurance.',
    isScam: true,
    explanation: "This is a scam. Any 'free' offer that requires your credit card details, even for 'shipping' or 'insurance', is designed to either bill you for recurring charges or steal your information.",
  },
  {
    id: 43,
    platform: 'Facebook DM',
    profileName: 'A Stranger',
    profileImage: placeholderImageMap['social-profile-john'].imageUrl,
    image: null,
    text: 'Is this you in this video? [malicious link]',
    isScam: true,
    explanation: 'A classic phishing attempt. The link does not lead to a video but to a site that will try to steal your login credentials.',
  },
  {
    id: 44,
    platform: 'Instagram',
    profileName: 'Local Artist',
    profileImage: placeholderImageMap['social-profile-gardener'].imageUrl,
    image: placeholderImageMap['social-post-garden'].imageUrl,
    text: 'Finished a new painting! Prints are available on my Etsy shop. Link in bio.',
    isScam: false,
    explanation: 'A normal post from a small business or artist promoting their work on a legitimate marketplace like Etsy.',
  },
  {
    id: 45,
    platform: 'Facebook',
    profileName: 'GetFit Quick',
    profileImage: placeholderImageMap['social-profile-health'].imageUrl,
    image: placeholderImageMap['social-post-pills'].imageUrl,
    text: 'Lose 30 pounds in 30 days with our new diet pill! No exercise required. Endorsed by Dr. Oz!',
    isScam: true,
    explanation: 'Health scams often make unrealistic promises. Also, fake celebrity endorsements are common. Always be skeptical of "miracle" weight loss products.',
  },
  {
    id: 46,
    platform: 'Instagram DM',
    profileName: 'Your Boss',
    profileImage: placeholderImageMap['social-profile-recruiter'].imageUrl,
    image: null,
    text: "I need you to do me a favor. I'm in a meeting and can't do it myself. I need you to buy five $100 Google Play gift cards and scratch off the back and send me the codes. I'll reimburse you when I get back to the office.",
    isScam: true,
    explanation: "This is a gift card scam. A scammer is impersonating your boss. The request for gift cards is always a scam because they are untraceable.",
  },
  {
    id: 47,
    platform: 'Facebook',
    profileName: 'Your Cousin',
    profileImage: placeholderImageMap['social-profile-friend2'].imageUrl,
    image: null,
    text: 'Just got engaged! So excited!',
    isScam: false,
    explanation: 'A normal life update from a family member. Safe.',
  },
  {
    id: 48,
    platform: 'Instagram',
    profileName: 'TechGiveaways',
    profileImage: placeholderImageMap['social-profile-gamer'].imageUrl,
    image: placeholderImageMap['social-post-console'].imageUrl,
    text: 'We are giving away a free PS5. All you have to do is send $5 shipping fee to our PayPal account to enter. [paypal link]',
    isScam: true,
    explanation: "Legitimate giveaways do not require you to pay for shipping to enter. This is an advance-fee scam.",
  },
  {
    id: 49,
    platform: 'Facebook',
    profileName: 'Your Child\'s School',
    profileImage: placeholderImageMap['social-profile-community'].imageUrl,
    image: null,
    text: 'Parent-teacher conferences are next week. Please sign up for a slot using the link we emailed to you.',
    isScam: false,
    explanation: 'A legitimate and expected announcement from your child\'s school.',
  },
  {
    id: 50,
    platform: 'Instagram DM',
    profileName: 'Instagram Support',
    profileImage: placeholderImageMap['social-profile-tech-support'].imageUrl,
    image: null,
    text: 'Your account has been reported for copyright violation. You must fill out this appeal form within 24 hours or your account will be permanently deleted. [link to a fake form]',
    isScam: true,
    explanation: "This is a phishing scam. Instagram will not contact you via DM like this. The link leads to a fake login page designed to steal your password.",
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

    