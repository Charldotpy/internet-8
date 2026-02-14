'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import AiGuidance from '@/components/ai-guidance';

export const textSizes = ['sm', 'md', 'lg', 'xl', '2xl'] as const;
export type TextSize = (typeof textSizes)[number];
const fontSizes: Record<TextSize, number> = { sm: 14, md: 16, lg: 18, xl: 20, '2xl': 22 };


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [textSize, setTextSize] = useState<TextSize>('md');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedSize = localStorage.getItem('textSize') as TextSize | null;
    if (storedSize && (textSizes as readonly string[]).includes(storedSize)) {
      setTextSize(storedSize);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      document.documentElement.style.fontSize = `${fontSizes[textSize]}px`;
      localStorage.setItem('textSize', textSize);
    }
  }, [textSize, isMounted]);

  if (!isMounted) {
    // Render a basic structure or loader to avoid flash of unstyled content and hydration issues.
    return (
        <div className="min-h-screen bg-background" />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-300">
      <Header textSize={textSize} setTextSize={setTextSize} />
      <main className="container mx-auto px-4 py-8">{children}</main>
      <AiGuidance />
    </div>
  );
}
