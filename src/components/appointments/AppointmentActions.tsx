

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
import { MoreHorizontal, Trash2 } from "lucide-react";
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

  const handleDelete = () => {
    if (typeof onAppointmentDelete === 'function') {
      onAppointmentDelete(appointment.id);
      toast({
        title: "Agendamento Excluído",
        description: "O agendamento foi removido com sucesso.",
      });
    } else {
        console.error("onAppointmentDelete is not a function");
    }
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
            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
              onSelect={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
