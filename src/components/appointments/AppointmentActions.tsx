
'use client';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Appointment } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { MessageDrafter } from "@/components/ai/MessageDrafter";
import { EditAppointmentDialog } from "./EditAppointmentDialog";
import { CancelAppointmentDialog } from "./CancelAppointmentDialog";
import { MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


interface AppointmentActionsProps {
  appointment: Appointment;
  onAppointmentUpdate: (appointment: Appointment) => void;
  onAppointmentCancel: (appointmentId: string) => void;
}

export function AppointmentActions({ appointment, onAppointmentUpdate, onAppointmentCancel }: AppointmentActionsProps) {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  
  const canEdit = hasRole(['admin', 'recepcionista']);
  const canSendMessage = hasRole(['admin', 'recepcionista']) && (appointment.canal === 'whatsapp' || appointment.canal === 'email');

  const handleCancel = () => {
    onAppointmentCancel(appointment.id);
    toast({
      title: "Agendamento Cancelado",
      description: "O agendamento foi cancelado com sucesso.",
    });
  };

  if (!canEdit && !canSendMessage) {
    return null;
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        {canSendMessage && <MessageDrafter appointment={appointment} />}
        {canEdit && (
          <>
            <EditAppointmentDialog 
                appointment={appointment} 
                onAppointmentUpdate={onAppointmentUpdate} 
            />
            <CancelAppointmentDialog onConfirm={handleCancel} />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
