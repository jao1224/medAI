'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CalendarClock, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { runFlow } from '@genkit-ai/next/client';
import { suggestAppointmentTimes, type SuggestAppointmentTimesOutput } from '@/ai/flows/suggest-appointment-times';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const mockLogData = `
- 2024-07-10: Paciente 'paciente001' solicitou agendamento para 'próxima semana'. Agente ofereceu '2024-07-15 10:00'. Paciente aceitou.
- 2024-07-11: Paciente 'paciente001' perguntou sobre limpeza dental. Agente forneceu informações e ofereceu agendamento. Paciente pediu horário no fim de semana.
- 2024-07-12: Paciente 'paciente002' solicitou consulta de urgência para dor de dente. Agente encontrou um horário para o mesmo dia.
- 2024-07-15: Paciente 'paciente001' confirmou sua consulta para hoje às 10:00.
`;

const mockAvailabilityData = `
- Dr. João Médico: Disponível de Seg-Sex 09:00-12:00, 14:00-18:00. Ocupado: 2024-08-15 09:00, 2024-08-17 11:00.
- Dra. Ana Dentista: Disponível Ter, Qui, Sex 08:00-17:00. Ocupado: 2024-08-15 10:30, 2024-08-16 14:00.
`;


export function SchedulingAssistant() {
  const [patientId, setPatientId] = useState('paciente001');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestAppointmentTimesOutput | null>(null);
  const { toast } = useToast();

  const handleSuggestTimes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      toast({ title: 'ID do paciente obrigatório', description: 'Por favor, insira o ID do paciente.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setSuggestion(null);

    try {
      const result = await runFlow(suggestAppointmentTimes, {
        patientId,
        logData: mockLogData,
        availabilityData: mockAvailabilityData,
      });
      setSuggestion(result);
    } catch (error) {
      console.error('Falha ao sugerir horários:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar sugestões.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Bot className="h-6 w-6" />
          Assistente de Agendamento IA
        </CardTitle>
        <CardDescription>
          Receba sugestões de agendamento com IA baseadas no histórico do paciente e na disponibilidade do profissional.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSuggestTimes} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientId">ID do Paciente</Label>
            <Input
              id="patientId"
              placeholder="ex: paciente001"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analisando...
              </>
            ) : (
              'Sugerir Horários'
            )}
          </Button>
        </form>
      </CardContent>
      {suggestion && (
        <CardFooter className="flex-col items-start gap-4">
          <Alert>
            <CalendarClock className="h-4 w-4" />
            <AlertTitle>Horários Sugeridos</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                {suggestion.suggestedTimes.map((time, index) => (
                  <li key={index}>{time}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
          <Alert variant="default" className="bg-muted">
              <AlertTitle>Justificativa</AlertTitle>
              <AlertDescription>
                  <p className="text-muted-foreground">{suggestion.reasoning}</p>
              </AlertDescription>
          </Alert>
        </CardFooter>
      )}
    </Card>
  );
}
