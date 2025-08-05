
"use client";

import { useState, useEffect } from "react";
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
import { Pencil } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { ElectronicHealthRecord } from "@/lib/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface EditRecordDialogProps {
  record: ElectronicHealthRecord;
  onRecordUpdate: (updatedRecord: ElectronicHealthRecord) => void;
  children: React.ReactNode;
}

const recordSchema = z.object({
    anamnese: z.string().min(1, 'Este campo é obrigatório.'),
    exameFisico: z.string().min(1, 'Este campo é obrigatório.'),
    hipoteseDiagnostica: z.string().min(1, 'Este campo é obrigatório.'),
    conduta: z.string().min(1, 'Este campo é obrigatório.'),
});

type RecordFormValues = z.infer<typeof recordSchema>;

export function EditRecordDialog({ record, onRecordUpdate, children }: EditRecordDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<RecordFormValues>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      anamnese: record.anamnese,
      exameFisico: record.exameFisico,
      hipoteseDiagnostica: record.hipoteseDiagnostica,
      conduta: record.conduta,
    }
  });

  useEffect(() => {
    if (isOpen) {
        form.reset({
            anamnese: record.anamnese,
            exameFisico: record.exameFisico,
            hipoteseDiagnostica: record.hipoteseDiagnostica,
            conduta: record.conduta,
        });
    }
  }, [isOpen, record, form]);


  if (!user || user.perfil !== 'medico') return null;

  const onSubmit = (data: RecordFormValues) => {

    const updatedRecord: ElectronicHealthRecord = {
        ...record,
        anamnese: data.anamnese,
        exameFisico: data.exameFisico,
        hipoteseDiagnostica: data.hipoteseDiagnostica,
        conduta: data.conduta,
    };

    onRecordUpdate(updatedRecord);

    toast({
      title: "Sucesso",
      description: "Prontuário atualizado com sucesso.",
    });

    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <DialogContent className="sm:max-w-lg">
        {isOpen && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Editar Prontuário</DialogTitle>
                <DialogDescription>
                  Modifique os detalhes do prontuário para o paciente {record.pacienteNome}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                <FormField
                    control={form.control}
                    name="anamnese"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anamnese</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descreva a queixa e o histórico do paciente..." {...field} rows={4}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="exameFisico"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exame Físico</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descreva os achados do exame físico..." {...field} rows={4}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="hipoteseDiagnostica"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hipótese Diagnóstica</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descreva a hipótese diagnóstica..." {...field} rows={3}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="conduta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conduta</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descreva o plano terapêutico, prescrições e encaminhamentos..." {...field} rows={4}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />

              </div>
              <DialogFooter className="pt-4">
                <Button type="submit">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
