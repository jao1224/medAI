import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AppointmentActions } from "./AppointmentActions";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import type { Appointment } from "@/lib/types";


interface AppointmentTableProps {
  appointments: Appointment[];
  onAppointmentUpdate: (appointment: Appointment) => void;
  onAppointmentDelete: (appointmentId: string) => void;
}

export function AppointmentTable({ appointments, onAppointmentUpdate, onAppointmentDelete }: AppointmentTableProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paciente</TableHead>
            <TableHead>Profissional</TableHead>
            <TableHead>Data e Hora</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Canal</TableHead>
            <TableHead>
              <span className="sr-only">Ações</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appt) => (
            <TableRow key={appt.id}>
              <TableCell className="font-medium">{appt.pacienteNome}</TableCell>
              <TableCell>{appt.profissionalNome}</TableCell>
              <TableCell>{format(new Date(appt.data_hora), "PPP p")}</TableCell>
              <TableCell className="capitalize">{appt.tipo}</TableCell>
              <TableCell>
                <Badge variant={appt.status === "cancelado" ? "destructive" : appt.status === "concluido" ? "secondary" : "default"} className="capitalize">
                  {appt.status}
                </Badge>
              </TableCell>
              <TableCell className="capitalize">{appt.canal}</TableCell>
              <TableCell>
                <AppointmentActions 
                  appointment={appt} 
                  onAppointmentUpdate={onAppointmentUpdate} 
                  onAppointmentDelete={onAppointmentDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
