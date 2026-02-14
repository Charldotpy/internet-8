import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Wrench, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UnderConstruction() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
             <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "inline-flex items-center gap-2")}>
                <ChevronLeft className="h-4 w-4" />
                Back to Scenarios
            </Link>
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 border-2 border-dashed rounded-lg">
                <Wrench className="h-16 w-16 text-muted-foreground" />
                <h1 className="mt-6 text-3xl font-bold">Scenario Under Construction</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    This simulation is being built. Please check back later!
                </p>
                <Button asChild className="mt-6">
                    <Link href="/">Choose Another Scenario</Link>
                </Button>
            </div>
        </div>
    );
}
