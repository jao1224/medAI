import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import type { User } from "@/lib/types";

interface PatientTableProps {
    patients: User[];
}

export function PatientTable({ patients }: PatientTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Birth Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.uid}>
            <TableCell className="font-medium">{patient.nome}</TableCell>
            <TableCell>{patient.email}</TableCell>
            <TableCell>{patient.telefone}</TableCell>
            <TableCell>
                {patient.data_nascimento ? format(new Date(patient.data_nascimento), "PPP") : '-'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
