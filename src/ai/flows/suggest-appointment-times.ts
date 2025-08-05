// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview AI-powered appointment time suggestion agent.
 *
 * - suggestAppointmentTimes - A function that suggests optimal appointment times based on historical data.
 * - SuggestAppointmentTimesInput - The input type for the suggestAppointmentTimes function.
 * - SuggestAppointmentTimesOutput - The return type for the suggestAppointmentTimes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAppointmentTimesInputSchema = z.object({
  patientId: z.string().describe('The ID of the patient.'),
  logData: z.string().describe('Logs of past appointment scheduling data, intent and resolutions.'),
  availabilityData: z.string().describe('Current professional availability for the upcoming week.'),
});

export type SuggestAppointmentTimesInput = z.infer<
  typeof SuggestAppointmentTimesInputSchema
>;

const SuggestAppointmentTimesOutputSchema = z.object({
  suggestedTimes: z
    .array(z.string())
    .describe(
      'A list of suggested appointment times based on AI analysis of provided logs and availability.'
    ),
  reasoning:
    z.string()
    .describe(
      'The AI reasoning behind the suggested appointment times, based on log data and availability.'
    ),
});

export type SuggestAppointmentTimesOutput = z.infer<
  typeof SuggestAppointmentTimesOutputSchema
>;

export async function suggestAppointmentTimes(
  input: SuggestAppointmentTimesInput
): Promise<SuggestAppointmentTimesOutput> {
  return suggestAppointmentTimesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAppointmentTimesPrompt',
  input: {schema: SuggestAppointmentTimesInputSchema},
  output: {schema: SuggestAppointmentTimesOutputSchema},
  prompt: `You are an AI assistant that analyzes historical appointment scheduling logs, along with current availability data, to suggest optimal appointment times for patients. 

Analyze the following appointment scheduling logs and user intent to understand patient preferences and common appointment reasons:

Logs: {{{logData}}}

Also, consider the current availability of medical professionals:

Availability: {{{availabilityData}}}

Based on this information, suggest the three most optimal appointment times for the patient. The returned object should include suggestedTimes as array of date strings and a short, human-readable reasoning field as to how you came to your decision.

Patient ID: {{{patientId}}}`,
});

const suggestAppointmentTimesFlow = ai.defineFlow(
  {
    name: 'suggestAppointmentTimesFlow',
    inputSchema: SuggestAppointmentTimesInputSchema,
    outputSchema: SuggestAppointmentTimesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
