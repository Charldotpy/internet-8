import { Minus, Plus } from 'lucide-react';
import { Button } from './ui/button';
import type { TextSize } from './app-layout';

type TextSizeControlProps = {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
};

export default function TextSizeControl({
  textSize,
  setTextSize,
}: TextSizeControlProps) {
  const handleIncrease = () => {
    if (textSize === 'sm') setTextSize('md');
    else if (textSize === 'md') setTextSize('lg');
  };

  const handleDecrease = () => {
    if (textSize === 'lg') setTextSize('md');
    else if (textSize === 'md') setTextSize('sm');
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border p-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDecrease}
        disabled={textSize === 'sm'}
        aria-label="Decrease text size"
        className="h-8 w-8"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums">
        A
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleIncrease}
        disabled={textSize === 'lg'}
        aria-label="Increase text size"
        className="h-8 w-8"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
