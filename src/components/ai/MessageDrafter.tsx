'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Appointment } from '@/lib/types';
import { runFlow } from '@genkit-ai/flow/client';
import { autoDraftMessage } from '@/ai/flows/auto-draft-messages';
import { Bot, Clipboard, Loader2, Send } from 'lucide-react';
import { format } from 'date-fns';

interface MessageDrafterProps {
  appointment: Appointment;
}

export function MessageDrafter({ appointment }: MessageDrafterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [draft, setDraft] = useState('');
  const { toast } = useToast();

  const handleGenerateDraft = async () => {
    setIsLoading(true);
    setDraft('');
    try {
      const result = await runFlow(autoDraftMessage, {
        patientName: appointment.pacienteNome,
        appointmentDateTime: format(new Date(appointment.data_hora), 'PPP p'),
        appointmentType: appointment.tipo,
        professionalName: appointment.profissionalNome,
        channel: appointment.canal,
      });
      setDraft(result.message);
    } catch (error) {
      console.error('Failed to draft message:', error);
      toast({
        title: 'Error',
        description: 'Could not generate message draft.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(draft);
    toast({
      title: 'Copied!',
      description: 'Message copied to clipboard.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Bot className="mr-2 h-4 w-4" />
          AI Draft Message
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">AI Message Drafter</DialogTitle>
          <DialogDescription>
            Generate a personalized message for {appointment.pacienteNome}. The draft will be tailored for {appointment.canal}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {!draft && !isLoading && (
            <div className="flex justify-center">
              <Button onClick={handleGenerateDraft}>
                <Bot className="mr-2 h-4 w-4" />
                Generate Draft
              </Button>
            </div>
          )}
          {isLoading && (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Generating...</span>
            </div>
          )}
          {draft && (
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={6}
              className="bg-secondary"
            />
          )}
        </div>
        {draft && (
          <DialogFooter>
            <Button variant="outline" onClick={handleCopyToClipboard}>
              <Clipboard className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <Button onClick={() => setIsOpen(false)}>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
