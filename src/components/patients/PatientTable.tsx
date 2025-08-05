
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
import type { User, ElectronicHealthRecord, Appointment, UserProfile } from "@/lib/types";
import { useMemo } from 'react';

interface PatientTableProps {
    allPatients: User[];
    allRecords: ElectronicHealthRecord[];
    allAppointments: Appointment[];
    currentUser: User | null;
    userRoles: UserProfile[];
}

export function PatientTable({ 
    allPatients, 
    allRecords, 
    allAppointments,
    currentUser, 
    userRoles 
}: PatientTableProps) {
  const router = useRouter();

  const handleRowClick = (patientId: string) => {
    router.push(`/dashboard/appointments?patientId=${patientId}`);
  };

  const filteredPatients = useMemo(() => {
    if (userRoles.includes('medico') && currentUser) {
      const doctorPatientIdsFromAppointments = new Set(
        allAppointments
          .filter(appt => appt.profissionalId === currentUser.uid)
          .map(appt => appt.pacienteId)
      );
      
      const doctorPatientIdsFromRecords = new Set(
        allRecords
            .filter(record => record.profissionalId === currentUser.uid)
            .map(record => record.pacienteId)
      );

      const combinedPatientIds = new Set([...doctorPatientIdsFromAppointments, ...doctorPatientIdsFromRecords]);
      return allPatients.filter(patient => combinedPatientIds.has(patient.uid) && patient.perfil === 'paciente');
    }
    return allPatients.filter(p => p.perfil === 'paciente');
  }, [allPatients, allRecords, allAppointments, currentUser, userRoles]);

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
        {filteredPatients.map((patient) => (
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
