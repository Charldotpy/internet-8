import { Landmark, MessageCircleWarning, ShieldAlert, Smartphone } from "lucide-react";

export const scenarios = [
  {
    id: "suspicious-sms",
    title: "Suspicious SMS",
    description: "Learn to identify and handle suspicious text messages.",
    icon: Smartphone,
    image: {
      id: "scenario-sms",
      url: "https://picsum.photos/seed/101/600/400",
      hint: "smartphone notifications",
    },
    path: "/scenarios/suspicious-sms",
  },
  {
    id: "online-banking",
    title: "Online Banking",
    description: "Practice safe online banking and spot fraudulent websites.",
    icon: Landmark,
    image: {
      id: "scenario-banking",
      url: "https://picsum.photos/seed/102/600/400",
      hint: "online banking",
    },
    path: "/scenarios/online-banking",
  },
  {
    id: "fake-gov-website",
    title: "Fake Government Website",
    description: "Identify fake government sites asking for personal info.",
    icon: ShieldAlert,
    image: {
      id: "scenario-gov",
      url: "https://picsum.photos/seed/103/600/400",
      hint: "government building",
    },
    path: "/scenarios/fake-gov-website",
  },
  {
    id: "social-media-quiz",
    title: "Social Media Quiz",
    description: "Understand the risks of sharing information on social media.",
    icon: MessageCircleWarning,
    image: {
      id: "scenario-social",
      url: "https://picsum.photos/seed/104/600/400",
      hint: "social media",
    },
    path: "/scenarios/social-media-quiz",
  }
];

export type Scenario = (typeof scenarios)[0];
