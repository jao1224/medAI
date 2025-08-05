
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Appointment, User } from "@/lib/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface AddAppointmentDialogProps {
  onAppointmentAdd: (newAppointment: Appointment) => void;
  patients: User[];
  professionals: User[];
}

const appointmentSchema = z.object({
    patientId: z.string({ required_error: "Please select a patient." }),
    professionalId: z.string({ required_error: "Please select a professional." }),
    date: z.date({ required_error: "Please select a date." }),
    time: z.string({ required_error: "Please select a time." }),
    type: z.enum(["consulta", "exame", "procedimento"], { required_error: "Please select a type." }),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export function AddAppointmentDialog({ onAppointmentAdd, patients, professionals }: AddAppointmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { user, hasRole } = useAuth();
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
  });

  const canAdd = hasRole(['admin', 'recepcionista']);
  
  if (!canAdd) return null;

  const onSubmit = (data: AppointmentFormValues) => {
    const patient = patients.find(p => p.uid === data.patientId);
    const professional = professionals.find(p => p.uid === data.professionalId);

    if (!patient || !professional) {
         toast({
            title: "Error",
            description: "Invalid patient or professional selected.",
            variant: "destructive",
        });
        return;
    }

    const [hours, minutes] = data.time.split(':');
    const appointmentDateTime = new Date(data.date);
    appointmentDateTime.setHours(parseInt(hours, 10));
    appointmentDateTime.setMinutes(parseInt(minutes, 10));

    const newAppointment: Appointment = {
        id: `appt${Date.now()}`,
        pacienteId: data.patientId,
        pacienteNome: patient.nome,
        profissionalId: data.professionalId,
        profissionalNome: professional.nome,
        data_hora: appointmentDateTime.toISOString(),
        tipo: data.type,
        status: "agendado",
        criado_por: user?.perfil === 'admin' ? 'recepcionista' : (user?.perfil || 'recepcionista'),
        confirmado: false,
        canal: "sistema",
    };

    onAppointmentAdd(newAppointment);

    toast({
      title: "Success",
      description: "New appointment created successfully.",
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
          Add Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>New Appointment</DialogTitle>
              <DialogDescription>
                Fill in the details to schedule a new appointment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a patient" />
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
                    <FormLabel>Professional</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a professional" />
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
                    <FormLabel>Date</FormLabel>
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
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
                      <FormLabel>Time</FormLabel>
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
                    <FormLabel>Type</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
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
            </div>
            <DialogFooter>
              <Button type="submit">Save Appointment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
