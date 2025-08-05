'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CalendarClock, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { runFlow } from '@genkit-ai/flow/client';
import { suggestAppointmentTimes, type SuggestAppointmentTimesOutput } from '@/ai/flows/suggest-appointment-times';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const mockLogData = `
- 2024-07-10: Patient 'paciente001' requested an appointment for 'next week'. Agent offered '2024-07-15 10:00'. Patient accepted.
- 2024-07-11: Patient 'paciente001' asked about teeth cleaning. Agent provided info and offered booking. Patient asked for a weekend slot.
- 2024-07-12: Patient 'paciente002' requested an urgent consultation for a toothache. Agent found a slot for the same day.
- 2024-07-15: Patient 'paciente001' confirmed their appointment for today at 10:00.
`;

const mockAvailabilityData = `
- Dr. João Médico: Available Mon-Fri 09:00-12:00, 14:00-18:00. Booked: 2024-08-15 09:00, 2024-08-17 11:00.
- Dra. Ana Dentista: Available Tue, Thu, Fri 08:00-17:00. Booked: 2024-08-15 10:30, 2024-08-16 14:00.
`;


export function SchedulingAssistant() {
  const [patientId, setPatientId] = useState('paciente001');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestAppointmentTimesOutput | null>(null);
  const { toast } = useToast();

  const handleSuggestTimes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      toast({ title: 'Patient ID required', description: 'Please enter a patient ID.', variant: 'destructive' });
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
      console.error('Failed to suggest times:', error);
      toast({
        title: 'Error',
        description: 'Could not generate suggestions.',
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
          AI Scheduling Assistant
        </CardTitle>
        <CardDescription>
          Get AI-powered appointment suggestions based on patient history and professional availability.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSuggestTimes} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientId">Patient ID</Label>
            <Input
              id="patientId"
              placeholder="e.g., paciente001"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Suggest Times'
            )}
          </Button>
        </form>
      </CardContent>
      {suggestion && (
        <CardFooter className="flex-col items-start gap-4">
          <Alert>
            <CalendarClock className="h-4 w-4" />
            <AlertTitle>Suggested Times</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                {suggestion.suggestedTimes.map((time, index) => (
                  <li key={index}>{time}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
          <Alert variant="default" className="bg-muted">
              <AlertTitle>Reasoning</AlertTitle>
              <AlertDescription>
                  <p className="text-muted-foreground">{suggestion.reasoning}</p>
              </AlertDescription>
          </Alert>
        </CardFooter>
      )}
    </Card>
  );
}
