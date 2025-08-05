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
  usuarioId: z.string().min(1, "O ID do paciente é obrigatório."),
  mensagem_usuario: z.string().min(1, "A mensagem do usuário é obrigatória."),
  resposta_ia: z.string().min(1, "A resposta da IA é obrigatória."),
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
      title: "Log Enviado",
      description: "O log de interação da IA foi salvo com sucesso.",
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
                <FormLabel>ID do Paciente</FormLabel>
                <FormControl>
                    <Input placeholder="paciente001" {...field} />
                </FormControl>
                <FormDescription>
                    O identificador único do paciente.
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
                <FormLabel>Intenção Detectada</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione uma intenção" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="agendamento">Agendamento</SelectItem>
                    <SelectItem value="duvida">Dúvida</SelectItem>
                    <SelectItem value="info">Pedido de Informação</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                </Select>
                 <FormDescription>
                    A intenção detectada pelo agente de IA.
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
              <FormLabel>Mensagem do Usuário</FormLabel>
              <FormControl>
                <Textarea placeholder="ex: 'Gostaria de marcar uma consulta para a próxima semana.'" {...field} />
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
              <FormLabel>Resposta da IA</FormLabel>
              <FormControl>
                <Textarea placeholder="ex: 'Claro! Temos horários disponíveis na segunda-feira às 10h...'" {...field} />
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
                    <FormLabel>Canal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um canal" />
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
                Salvar Log
            </Button>
        </div>
      </form>
    </Form>
  );
}
