import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { Scenario } from '@/lib/data';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ScenarioCardProps = {
  scenario: Scenario;
};

export default function ScenarioCard({ scenario }: ScenarioCardProps) {
  const Icon = scenario.icon;
  return (
    <Card className="flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="relative h-40 p-6 flex flex-col justify-end">
        <Image
          src={scenario.image.url}
          alt={scenario.title}
          fill
          className="object-cover -z-10"
          data-ai-hint={scenario.image.hint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 -z-10"></div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/80 backdrop-blur-sm border border-primary-foreground/20">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-primary-foreground">{scenario.title}</CardTitle>
        </div>
      </CardHeader>
      <div className="p-6 pt-4 flex-grow">
        <CardDescription>{scenario.description}</CardDescription>
      </div>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full">
          <Link href={scenario.path}>
            Start Simulation <ArrowRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
