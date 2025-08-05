
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
import { useMemo, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { ViewPatientDialog } from './ViewPatientDialog';
import { PatientRecordsDialog } from './PatientRecordsDialog';

interface PatientTableProps {
    allPatients: User[];
    allRecords: ElectronicHealthRecord[];
    allAppointments: Appointment[];
    onRecordUpdate: (record: ElectronicHealthRecord) => void;
}

export function PatientTable({ 
    allPatients, 
    allRecords, 
    allAppointments,
    onRecordUpdate,
}: PatientTableProps) {
  const { user, hasRole, loading } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);

  const handleRowClick = (patient: User) => {
    setSelectedPatient(patient);
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
    <>
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
                  onClick={() => handleRowClick(patient)}
                  className="cursor-pointer"
              >
                  <TableCell className="font-medium">
                    <span className="text-primary underline-offset-4 hover:underline">{patient.nome}</span>
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
      
      {selectedPatient && (
        hasRole('medico') ? (
            <PatientRecordsDialog
                patient={selectedPatient}
                records={allRecords.filter(r => r.pacienteId === selectedPatient.uid && r.profissionalId === user?.uid)}
                isOpen={!!selectedPatient}
                onOpenChange={(isOpen) => {
                    if(!isOpen) setSelectedPatient(null);
                }}
                onRecordUpdate={onRecordUpdate}
            />
        ) : (
            <ViewPatientDialog 
                patient={selectedPatient}
                isOpen={!!selectedPatient}
                onOpenChange={(isOpen) => {
                    if(!isOpen) setSelectedPatient(null);
                }}
            />
        )
      )}
    </>
  );
}
