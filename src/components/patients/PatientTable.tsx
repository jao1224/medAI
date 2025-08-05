'use client';

import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const handleRowClick = (patientId: string) => {
    router.push(`/dashboard/appointments?patientId=${patientId}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Data de Nascimento</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow 
            key={patient.uid} 
            onClick={() => handleRowClick(patient.uid)}
            className="cursor-pointer"
          >
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
