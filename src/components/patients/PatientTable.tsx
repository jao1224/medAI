
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
import type { User, ElectronicHealthRecord, Appointment } from "@/lib/types";
import { useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { ViewPatientDialog } from './ViewPatientDialog';

interface PatientTableProps {
    allPatients: User[];
    allRecords: ElectronicHealthRecord[];
    allAppointments: Appointment[];
}

export function PatientTable({ 
    allPatients, 
    allRecords, 
    allAppointments,
}: PatientTableProps) {
  const router = useRouter();
  const { user, hasRole, loading } = useAuth();


  const handleRowClick = (patient: User) => {
    if (hasRole('medico')) {
        router.push(`/dashboard/records?patientId=${patient.uid}`);
    }
    // For other roles, the dialog will be triggered by the TableRow's onClick if they don't have medic role.
  };

  const filteredPatients = useMemo(() => {
    if (hasRole('medico') && user) {
      const doctorPatientIdsFromAppointments = new Set(
        allAppointments
          .filter(appt => appt.profissionalId === user.uid)
          .map(appt => appt.pacienteId)
      );
      
      const doctorPatientIdsFromRecords = new Set(
        allRecords
            .filter(record => record.profissionalId === user.uid)
            .map(record => record.pacienteId)
      );

      const combinedPatientIds = new Set([...doctorPatientIdsFromAppointments, ...doctorPatientIdsFromRecords]);
      return allPatients.filter(patient => combinedPatientIds.has(patient.uid) && patient.perfil === 'paciente');
    }
    return allPatients.filter(p => p.perfil === 'paciente');
  }, [allPatients, allRecords, allAppointments, user, hasRole]);

  if(loading) return <p>Carregando...</p>;

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
                className={hasRole('medico') ? "cursor-pointer" : ""}
            >
                <TableCell className="font-medium" onClick={() => handleRowClick(patient)}>
                    {hasRole('medico') ? (
                        patient.nome
                    ) : (
                        <ViewPatientDialog patient={patient}>
                            <span className="cursor-pointer text-primary underline-offset-4 hover:underline">{patient.nome}</span>
                        </ViewPatientDialog>
                    )}
                </TableCell>
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

