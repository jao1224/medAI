
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
import { Button } from '../ui/button';
import { Pencil } from 'lucide-react';
import { EditPatientDialog } from './EditPatientDialog';
import { useUserData } from '@/hooks/use-user-data';

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
  const { updateUser } = useUserData();
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);

  const handleRowClick = (patient: User) => {
    setSelectedPatient(patient);
  };

  const handlePatientUpdate = (updatedPatient: User) => {
    updateUser(updatedPatient);
  }
  
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
            <TableHead>Plano de Saúde</TableHead>
            <TableHead>Data de Nascimento</TableHead>
            {hasRole(['admin', 'recepcionista']) && <TableHead className="text-right">Ações</TableHead>}
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
                    {patient.nome}
                  </TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.telefone}</TableCell>
                  <TableCell>{patient.plano_saude || '-'}</TableCell>
                  <TableCell>
                      {patient.data_nascimento ? format(new Date(patient.data_nascimento), "PPP") : '-'}
                  </TableCell>
                   {hasRole(['admin', 'recepcionista']) && (
                    <TableCell className="text-right">
                        <EditPatientDialog patient={patient} onPatientUpdate={handlePatientUpdate}>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Editar Paciente</span>
                            </Button>
                        </EditPatientDialog>
                    </TableCell>
                  )}
              </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {selectedPatient && (
        hasRole(['admin', 'recepcionista']) ? (
            <ViewPatientDialog 
                patient={selectedPatient}
                isOpen={!!selectedPatient}
                onOpenChange={(isOpen) => {
                    if(!isOpen) setSelectedPatient(null);
                }}
            />
        ) : (
            <PatientRecordsDialog
                patient={selectedPatient}
                records={allRecords.filter(r => r.pacienteId === selectedPatient.uid && r.profissionalId === user?.uid)}
                isOpen={!!selectedPatient}
                onOpenChange={(isOpen) => {
                    if(!isOpen) setSelectedPatient(null);
                }}
                onRecordUpdate={onRecordUpdate}
            />
        )
      )}
    </>
  );
}
