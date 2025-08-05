
'use client';

import { PatientTable } from "@/components/patients/PatientTable";
import { AddPatientDialog } from "@/components/patients/AddPatientDialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUserData } from '@/hooks/use-user-data';
import { useAuth } from "@/hooks/use-auth";
import { mockAppointments, mockHealthRecords } from "@/lib/mock-data";
import { useState } from "react";
import type { Appointment, ElectronicHealthRecord, User } from "@/lib/types";


export default function PatientsPage() {
  const { patients, addUser } = useUserData();
  const { hasRole, loading } = useAuth();
  const [records, setRecords] = useState<ElectronicHealthRecord[]>(mockHealthRecords);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

  const handleRecordUpdate = (updatedRecord: ElectronicHealthRecord) => {
    setRecords((prev) => 
      prev.map((record) => 
        record.id === updatedRecord.id ? updatedRecord : record
      )
    );
  };

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">Pacientes</CardTitle>
                    <CardDescription>
                        {hasRole('medico') 
                            ? "Clique em um paciente para ver seus prontuários."
                            : "Visualize e gerencie todos os registros de pacientes."
                        }
                    </CardDescription>
                </div>
                 {hasRole(['admin', 'recepcionista']) && <AddPatientDialog onPatientAdd={addUser} />}
            </CardHeader>
            <CardContent>
                <PatientTable 
                    allPatients={patients} 
                    allRecords={records}
                    allAppointments={appointments}
                    onRecordUpdate={handleRecordUpdate}
                />
            </CardContent>
        </Card>
    </div>
  );
}
