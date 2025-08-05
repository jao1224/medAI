'use server';

/**
 * @fileOverview AI flow to auto-draft personalized messages for appointment reminders and confirmations.
 * 
 * - autoDraftMessage - A function that handles the auto-drafting of personalized messages.
 * - AutoDraftMessageInput - The input type for the autoDraftMessage function.
 * - AutoDraftMessageOutput - The return type for the autoDraftMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoDraftMessageInputSchema = z.object({
  patientName: z.string().describe('The name of the patient.'),
  appointmentDateTime: z.string().describe('The date and time of the appointment (e.g., YYYY-MM-DD HH:mm).'),
  appointmentType: z.string().describe('The type of appointment (e.g., consultation, exam, procedure).'),
  professionalName: z.string().describe('The name of the doctor or dentist.'),
  channel: z.enum(['whatsapp', 'email']).describe('The communication channel (WhatsApp or email).'),
  logContext: z.string().optional().describe('Additional context from the AI agent logs.'),
});
export type AutoDraftMessageInput = z.infer<typeof AutoDraftMessageInputSchema>;

const AutoDraftMessageOutputSchema = z.object({
  message: z.string().describe('The auto-drafted personalized message.'),
});
export type AutoDraftMessageOutput = z.infer<typeof AutoDraftMessageOutputSchema>;

export async function autoDraftMessage(input: AutoDraftMessageInput): Promise<AutoDraftMessageOutput> {
  return autoDraftMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoDraftMessagePrompt',
  input: {schema: AutoDraftMessageInputSchema},
  output: {schema: AutoDraftMessageOutputSchema},
  prompt: `You are an AI assistant tasked with drafting personalized messages for appointment reminders and confirmations for a medical clinic.

  Given the following information, draft a message suitable for sending via {{channel}}.

  Patient Name: {{{patientName}}}
  Appointment Date/Time: {{{appointmentDateTime}}}
  Appointment Type: {{{appointmentType}}}
  Professional Name: {{{professionalName}}}
  {% if logContext %}Additional Context: {{{logContext}}}{% endif %}

  The message should be friendly, concise, and professional. Tailor the message based on the channel.
  For WhatsApp, keep it brief and use a conversational tone. For email, use a slightly more formal tone.
  The message should include all the necessary information, such as the date, time, and type of appointment.
`,
});

const autoDraftMessageFlow = ai.defineFlow(
  {
    name: 'autoDraftMessageFlow',
    inputSchema: AutoDraftMessageInputSchema,
    outputSchema: AutoDraftMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
