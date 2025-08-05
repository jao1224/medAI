
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ElectronicHealthRecord } from "@/lib/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUserData } from "@/hooks/use-user-data";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';

interface AddRecordDialogProps {
  onRecordAdd: (newRecord: ElectronicHealthRecord) => void;
}

const recordSchema = z.object({
    patientId: z.string({ required_error: "Por favor, selecione um paciente." }),
    type: z.enum(["consulta", "exame", "procedimento"], { required_error: "Por favor, selecione um tipo." }),
    description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
});

type RecordFormValues = z.infer<typeof recordSchema>;

export function AddRecordDialog({ onRecordAdd }: AddRecordDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { patients } = useUserData();
  
  const form = useForm<RecordFormValues>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      patientId: undefined,
      type: undefined,
      description: "",
    }
  });

  if (!user || user.perfil !== 'medico') return null;

  const onSubmit = (data: RecordFormValues) => {
    const patient = patients.find(p => p.uid === data.patientId);

    if (!patient) {
         toast({
            title: "Erro",
            description: "Paciente inválido selecionado.",
            variant: "destructive",
        });
        return;
    }

    const now = new Date();

    const newRecord: ElectronicHealthRecord = {
        id: `rec${Date.now()}`,
        pacienteId: data.patientId,
        pacienteNome: patient.nome,
        profissionalId: user.uid,
        profissionalNome: user.nome,
        data: now.toISOString(),
        tipo: data.type,
        descricao: data.description,
        criado_em: now.toISOString(),
    };

    onRecordAdd(newRecord);

    toast({
      title: "Sucesso",
      description: "Novo prontuário adicionado com sucesso.",
    });

    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        form.reset();
      }
    }}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Prontuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {isOpen && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Novo Prontuário</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes para adicionar um novo registro.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paciente</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um paciente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {patients.map(p => (
                            <SelectItem key={p.uid} value={p.uid}>{p.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Registro</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="consulta">Consulta</SelectItem>
                          <SelectItem value="exame">Exame</SelectItem>
                          <SelectItem value="procedimento">Procedimento</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descreva os detalhes do atendimento..." {...field} rows={5}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

              </div>
              <DialogFooter>
                <Button type="submit">Salvar Prontuário</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
