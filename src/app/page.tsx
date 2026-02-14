import { scenarios } from '@/lib/data';
import ScenarioCard from '@/components/scenario-card';

export default function Home() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Welcome to ElderNet Guide
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Choose a scenario below to practice your internet safety skills in a
          safe, simulated environment.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {scenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}
      </div>
    </div>
  );
}
