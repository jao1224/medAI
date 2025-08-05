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
import { runFlow } from '@genkit-ai/next/client';
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
      console.error('Falha ao redigir mensagem:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar o rascunho da mensagem.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(draft);
    toast({
      title: 'Copiado!',
      description: 'Mensagem copiada para a área de transferência.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Bot className="mr-2 h-4 w-4" />
          Rascunho com IA
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Rascunho com IA</DialogTitle>
          <DialogDescription>
            Gere uma mensagem personalizada para {appointment.pacienteNome}. O rascunho será adaptado para {appointment.canal}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {!draft && !isLoading && (
            <div className="flex justify-center">
              <Button onClick={handleGenerateDraft}>
                <Bot className="mr-2 h-4 w-4" />
                Gerar Rascunho
              </Button>
            </div>
          )}
          {isLoading && (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Gerando...</span>
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
              Copiar
            </Button>
            <Button onClick={() => setIsOpen(false)}>
              <Send className="mr-2 h-4 w-4" />
              Enviar
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
