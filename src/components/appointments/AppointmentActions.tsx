'use client';
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { Appointment } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { MessageDrafter } from "@/components/ai/MessageDrafter";
import { EditAppointmentDialog } from "./EditAppointmentDialog";
import { MoreHorizontal, Trash2, CalendarOff, CalendarClock, Bot } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DeleteAppointmentDialog } from "./DeleteAppointmentDialog";
import { CancelAppointmentDialog } from "./CancelAppointmentDialog";
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
    } else {
      console.error("onAppointmentDelete não é uma função.");
    }
  }

  const handleCancel = () => {
    if (typeof onAppointmentUpdate === 'function') {
      onAppointmentUpdate({ ...appointment, status: 'cancelado' });
      toast({
        title: "Agendamento Cancelado",
        description: "O status do agendamento foi alterado para cancelado."
      });
    } else {
        console.error("onAppointmentUpdate não é uma função.");
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
                isReschedule={false}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Bot className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
            </EditAppointmentDialog>
            <EditAppointmentDialog 
                appointment={appointment} 
                onAppointmentUpdate={onAppointmentUpdate}
                isReschedule={true}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <CalendarClock className="mr-2 h-4 w-4" />
                Reagendar
              </DropdownMenuItem>
            </EditAppointmentDialog>
            <CancelAppointmentDialog onConfirm={handleCancel}>
                <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                >
                    <CalendarOff className="mr-2 h-4 w-4" />
                    Cancelar
                </DropdownMenuItem>
            </CancelAppointmentDialog>
            <DropdownMenuSeparator />
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
