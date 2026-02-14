'use client';

import { useState, useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Bot, Loader2, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { getAiGuidance } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const initialState = {
  tip: '',
  error: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Send />}
      Ask
    </Button>
  );
}

export default function AiGuidance() {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(getAiGuidance, initialState);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when closing dialog
      formRef.current?.reset();
    }
  };

  useEffect(() => {
    if (state.tip || state.error) {
        formRef.current?.reset();
    }
  }, [state])

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
        size="icon"
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Guidance Tool"
      >
        <Bot className="h-8 w-8" />
      </Button>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>AI Safety Assistant</DialogTitle>
            <DialogDescription>
              Ask a question about internet safety, and our AI will provide a
              simple tip.
            </DialogDescription>
          </DialogHeader>
          <form ref={formRef} action={formAction} className="grid gap-4 py-4">
            <Textarea
              name="question"
              placeholder="e.g., 'How can I spot a phishing email?'"
              required
              rows={3}
            />
            <DialogFooter>
              <SubmitButton />
            </DialogFooter>
          </form>
          {state?.tip && (
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertTitle>Here's a tip!</AlertTitle>
              <AlertDescription>{state.tip}</AlertDescription>
            </Alert>
          )}
          {state?.error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
