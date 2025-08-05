"use client";

import { useState } from "react";
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
import { mockUsers } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Appointment, User } from "@/lib/types";

interface AddAppointmentDialogProps {
  onAppointmentAdd: (newAppointment: Appointment) => void;
  patients: User[];
  professionals: User[];
}

export function AddAppointmentDialog({ onAppointmentAdd, patients, professionals }: AddAppointmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();
  const { user, hasRole } = useAuth();
  
  const canAdd = hasRole(['admin', 'recepcionista']);
  
  if (!canAdd) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const patientId = formData.get("patient") as string;
    const professionalId = formData.get("professional") as string;
    const time = formData.get("time") as string;
    const type = formData.get("type") as "consulta" | "exame" | "procedimento";

    if (!patientId || !professionalId || !date || !time || !type) {
        toast({
            title: "Error",
            description: "Please fill all fields.",
            variant: "destructive",
        });
        return;
    }

    const patient = patients.find(p => p.uid === patientId);
    const professional = professionals.find(p => p.uid === professionalId);

    if (!patient || !professional) {
         toast({
            title: "Error",
            description: "Invalid patient or professional selected.",
            variant: "destructive",
        });
        return;
    }

    const [hours, minutes] = time.split(':');
    const appointmentDateTime = new Date(date);
    appointmentDateTime.setHours(parseInt(hours, 10));
    appointmentDateTime.setMinutes(parseInt(minutes, 10));

    const newAppointment: Appointment = {
        id: `appt${Date.now()}`,
        pacienteId,
        pacienteNome: patient.nome,
        profissionalId,
        profissionalNome: professional.nome,
        data_hora: appointmentDateTime.toISOString(),
        tipo,
        status: "agendado",
        criado_por: user?.perfil === 'admin' ? 'recepcionista' : (user?.perfil || 'recepcionista'), // Simplified
        confirmado: false,
        canal: "sistema",
    };

    onAppointmentAdd(newAppointment);

    toast({
      title: "Success",
      description: "New appointment created successfully.",
    });

    setIsOpen(false);
    setDate(undefined);
    (event.target as HTMLFormElement).reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Appointment</DialogTitle>
            <DialogDescription>
              Fill in the details to schedule a new appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient</Label>
              <Select name="patient">
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(p => (
                    <SelectItem key={p.uid} value={p.uid}>{p.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="professional">Professional</Label>
              <Select name="professional">
                <SelectTrigger>
                  <SelectValue placeholder="Select a professional" />
                </SelectTrigger>
                <SelectContent>
                  {professionals.map(p => (
                    <SelectItem key={p.uid} value={p.uid}>{p.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
             <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input name="time" id="time" type="time" defaultValue="09:00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select name="type">
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="consulta">Consulta</SelectItem>
                   <SelectItem value="exame">Exame</SelectItem>
                   <SelectItem value="procedimento">Procedimento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Appointment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
