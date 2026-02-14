import Link from 'next/link';
import { ShieldCheck, Menu } from 'lucide-react';
import TextSizeControl from './text-size-control';
import { Button } from './ui/button';
import type { TextSize } from './app-layout';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

type HeaderProps = {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
};

export default function Header({ textSize, setTextSize }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">
            ElderNet Guide
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" asChild>
              <Link href="/">Scenarios</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/progress">My Progress</Link>
            </Button>
            <TextSizeControl textSize={textSize} setTextSize={setTextSize} />
          </nav>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4 pt-8">
                  <Button variant="ghost" asChild className="justify-start text-lg">
                    <Link href="/">Scenarios</Link>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start text-lg">
                    <Link href="/progress">My Progress</Link>
                  </Button>
                  <div className="pt-4">
                    <p className="text-muted-foreground mb-2">Text Size</p>
                    <TextSizeControl textSize={textSize} setTextSize={setTextSize} />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
