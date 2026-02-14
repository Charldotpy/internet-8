import { Minus, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { type TextSize, textSizes } from './app-layout';

type TextSizeControlProps = {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
};

export default function TextSizeControl({
  textSize,
  setTextSize,
}: TextSizeControlProps) {
  const currentIndex = textSizes.indexOf(textSize);
  
  const handleIncrease = () => {
    if (currentIndex < textSizes.length - 1) {
      setTextSize(textSizes[currentIndex + 1]);
    }
  };

  const handleDecrease = () => {
    if (currentIndex > 0) {
      setTextSize(textSizes[currentIndex - 1]);
    }
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border p-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDecrease}
        disabled={currentIndex === 0}
        aria-label="Decrease text size"
        className="h-8 w-8"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums">
        {textSize.toUpperCase()}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleIncrease}
        disabled={currentIndex === textSizes.length - 1}
        aria-label="Increase text size"
        className="h-8 w-8"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
