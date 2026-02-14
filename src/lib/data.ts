import { MessageCircleWarning, ShieldAlert, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { placeholderImageMap } from "./placeholder-images";
import type { ImagePlaceholder } from "./placeholder-images";

export type Scenario = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  image: ImagePlaceholder;
  path: string;
};


export const scenarios: Scenario[] = [
  {
    id: "suspicious-sms",
    title: "Suspicious SMS",
    description: "Learn to identify and handle suspicious text messages.",
    icon: Smartphone,
    image: placeholderImageMap["scenario-sms"],
    path: "/scenarios/suspicious-sms",
  },
  {
    id: "fake-gov-website",
    title: "Fake Government Website",
    description: "Identify fake government sites asking for personal info.",
    icon: ShieldAlert,
    image: placeholderImageMap["scenario-gov"],
    path: "/scenarios/fake-gov-website",
  },
  {
    id: "social-media-quiz",
    title: "Social Media Quiz",
    description: "Understand the risks of sharing information on social media.",
    icon: MessageCircleWarning,
    image: placeholderImageMap["scenario-social"],
    path: "/scenarios/social-media-quiz",
  }
];
