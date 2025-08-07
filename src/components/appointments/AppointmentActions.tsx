

'use client';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { Appointment } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { MessageDrafter } from "@/components/ai/MessageDrafter";
import { EditAppointmentDialog } from "./EditAppointmentDialog";
import { MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DeleteAppointmentDialog } from "./DeleteAppointmentDialog";


interface AppointmentActionsProps {
  appointment: Appointment;
  onAppointmentUpdate: (appointment: Appointment) => void;
  onAppointmentDelete: (appointmentId: string) => void;
}

export function AppointmentActions({ appointment, onAppointmentUpdate, onAppointmentDelete }: AppointmentActionsProps) {
  const { hasRole } = useAuth();
  
  const canEdit = hasRole(['admin', 'recepcionista']);
  const canSendMessage = hasRole(['admin', 'recepcionista']) && (appointment.canal === 'whatsapp' || appointment.canal === 'email');

  const handleDelete = () => {
    if (typeof onAppointmentDelete === 'function') {
      onAppointmentDelete(appointment.id);
    } else {
      console.error("onAppointmentDelete não é uma função.");
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
            <DeleteAppointmentDialog onConfirm={handleDelete}>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DeleteAppointmentDialog>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
