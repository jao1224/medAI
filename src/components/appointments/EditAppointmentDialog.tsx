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
import { Calendar as CalendarIcon, Pencil } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Appointment } from "@/lib/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUserData } from "@/hooks/use-user-data";
import { Input } from "../ui/input";

interface EditAppointmentDialogProps {
  appointment: Appointment;
  onAppointmentUpdate: (updatedAppointment: Appointment) => void;
  isReschedule: boolean;
  children: React.ReactNode;
}

const appointmentSchema = z.object({
    patientId: z.string({ required_error: "Por favor, selecione um paciente." }),
    professionalId: z.string({ required_error: "Por favor, selecione um profissional." }),
    date: z.date({ required_error: "Por favor, selecione uma data." }),
    time: z.string({ required_error: "Por favor, selecione um horário." }).min(1, 'O horário é obrigatório'),
    type: z.enum(["consulta", "exame", "procedimento"], { required_error: "Por favor, selecione um tipo." }),
    status: z.enum(["agendado", "concluido", "cancelado", "reagendado"], { required_error: "Por favor, selecione um status." }),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export function EditAppointmentDialog({ appointment, onAppointmentUpdate, isReschedule, children }: EditAppointmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { patients, professionals } = useUserData();
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
  });

  useEffect(() => {
    if (isOpen) {
        const appointmentDate = new Date(appointment.data_hora);
        form.reset({
            patientId: appointment.pacienteId,
            professionalId: appointment.profissionalId,
            date: appointmentDate,
            time: format(appointmentDate, "HH:mm"),
            type: appointment.tipo,
            status: isReschedule ? 'reagendado' : appointment.status,
        });
    }
  }, [isOpen, appointment, form, isReschedule]);

  const onSubmit = (data: AppointmentFormValues) => {
    const patient = patients.find(p => p.uid === data.patientId);
    const professional = professionals.find(p => p.uid === data.professionalId);

    if (!patient || !professional) {
         toast({
            title: "Erro",
            description: "Paciente ou profissional inválido selecionado.",
            variant: "destructive",
        });
        return;
    }

    const [hours, minutes] = data.time.split(':');
    const appointmentDateTime = new Date(data.date);
    appointmentDateTime.setHours(parseInt(hours, 10));
    appointmentDateTime.setMinutes(parseInt(minutes, 10));

    const updatedAppointment: Appointment = {
        ...appointment,
        pacienteId: data.patientId,
        pacienteNome: patient.nome,
        profissionalId: data.professionalId,
        profissionalNome: professional.nome,
        data_hora: appointmentDateTime.toISOString(),
        tipo: data.type,
        status: data.status
    };

    onAppointmentUpdate(updatedAppointment);

    toast({
      title: "Sucesso",
      description: `Agendamento ${isReschedule ? 'reagendado' : 'atualizado'} com sucesso.`,
    });

    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {isOpen && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>{isReschedule ? 'Reagendar' : 'Editar'} Agendamento</DialogTitle>
                <DialogDescription>
                  {isReschedule ? 'Escolha uma nova data e/ou hora.' : 'Modifique os detalhes para atualizar o agendamento.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paciente</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReschedule}>
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
                  name="professionalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profissional</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReschedule}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um profissional" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {professionals.map(p => (
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
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data</FormLabel>
                      <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                              variant={"outline"}
                              className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                              )}
                              >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Escolha uma data</span>}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                              <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              />
                          </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReschedule}>
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReschedule}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="agendado">Agendado</SelectItem>
                          <SelectItem value="concluido">Concluído</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                          <SelectItem value="reagendado">Reagendado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
