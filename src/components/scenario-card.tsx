import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { Scenario } from '@/lib/data';
import {
  Card,
  CardContent,
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
      <div className="relative h-40">
        <Image
          src={scenario.image.imageUrl}
          alt={scenario.title}
          fill
          className="object-cover"
          data-ai-hint={scenario.image.imageHint}
        />
      </div>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icon className="h-6 w-6" />
          </div>
          <CardTitle>{scenario.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{scenario.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={scenario.path}>
            Start Simulation <ArrowRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
