'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  usuarioId: z.string().min(1, "Patient ID is required."),
  mensagem_usuario: z.string().min(1, "User message is required."),
  resposta_ia: z.string().min(1, "AI response is required."),
  intencao_detectada: z.enum(["agendamento", "duvida", "info", "outro"]),
  canal: z.enum(["whatsapp", "chat", "email"]),
});

export default function AiLogForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usuarioId: "",
      mensagem_usuario: "",
      resposta_ia: "",
      intencao_detectada: "agendamento",
      canal: "whatsapp",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(values);
    toast({
      title: "Log Submitted",
      description: "The AI interaction log has been successfully saved.",
    });
    form.reset();
    setIsLoading(false);
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="usuarioId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Patient ID</FormLabel>
                <FormControl>
                    <Input placeholder="paciente001" {...field} />
                </FormControl>
                <FormDescription>
                    The unique identifier for the patient.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="intencao_detectada"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Detected Intent</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an intent" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="agendamento">Scheduling</SelectItem>
                    <SelectItem value="duvida">Question</SelectItem>
                    <SelectItem value="info">Information Request</SelectItem>
                    <SelectItem value="outro">Other</SelectItem>
                    </SelectContent>
                </Select>
                 <FormDescription>
                    The intent detected by the AI agent.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <FormField
          control={form.control}
          name="mensagem_usuario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Message</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., 'I'd like to book an appointment for next week.'" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="resposta_ia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Response</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., 'Of course! We have openings on Monday at 10 AM...'" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center">
             <FormField
                control={form.control}
                name="canal"
                render={({ field }) => (
                    <FormItem className="w-1/3">
                    <FormLabel>Channel</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a channel" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="chat">Chat</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Log
            </Button>
        </div>
      </form>
    </Form>
  );
}
