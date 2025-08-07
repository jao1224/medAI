

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
import { DeleteAppointmentDialog } from "./DeleteAppointmentDialog";
import { MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


interface AppointmentActionsProps {
  appointment: Appointment;
  onAppointmentUpdate: (appointment: Appointment) => void;
  onAppointmentDelete: (appointmentId: string) => void;
}

export function AppointmentActions({ appointment, onAppointmentUpdate, onAppointmentDelete }: AppointmentActionsProps) {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  
  const canEdit = hasRole(['admin', 'recepcionista']);
  const canSendMessage = hasRole(['admin', 'recepcionista']) && (appointment.canal === 'whatsapp' || appointment.canal === 'email');

  const handleDeleteConfirm = () => {
    onAppointmentDelete(appointment.id);
    toast({
      title: "Agendamento Excluído",
      description: "O agendamento foi excluído com sucesso.",
    });
  }

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
            <DeleteAppointmentDialog 
              onConfirm={handleDeleteConfirm} 
            />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
