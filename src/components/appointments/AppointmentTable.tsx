import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockAppointments } from "@/lib/mock-data";
import { format } from "date-fns";
import { AppointmentActions } from "./AppointmentActions";

interface AppointmentTableProps {
  professionalId?: string;
}

export function AppointmentTable({ professionalId }: AppointmentTableProps) {
  const appointments =
    professionalId && professionalId !== 'all'
      ? mockAppointments.filter(
          (appt) => appt.profissionalId === professionalId
        )
      : mockAppointments;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Professional</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Channel</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
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
              <AppointmentActions appointment={appt} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
