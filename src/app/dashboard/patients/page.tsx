
'use client';

import { PatientTable } from "@/components/patients/PatientTable";
import { AddPatientDialog } from "@/components/patients/AddPatientDialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUserData } from '@/hooks/use-user-data';
import { useAuth } from "@/hooks/use-auth";
import { mockAppointments, mockHealthRecords } from "@/lib/mock-data";
import type { ElectronicHealthRecord } from "@/lib/types";


export default function PatientsPage() {
  const { patients, addUser } = useUserData();
  const { user, hasRole } = useAuth();

  const getFilteredPatients = (records: ElectronicHealthRecord[]) => {
    if (hasRole('medico') && user) {
      const doctorPatientIdsFromAppointments = new Set(
        mockAppointments
          .filter(appt => appt.profissionalId === user.uid)
          .map(appt => appt.pacienteId)
      );
      const doctorPatientIdsFromRecords = new Set(
        records
            .filter(record => record.profissionalId === user.uid)
            .map(record => record.pacienteId)
      );

      const combinedPatientIds = new Set([...doctorPatientIdsFromAppointments, ...doctorPatientIdsFromRecords]);

      return patients.filter(patient => combinedPatientIds.has(patient.uid));
    }
    return patients;
  }

  // This page is no longer directly used in the navigation, 
  // but its logic is preserved for potential future use or modularity.
  // The functionality is now integrated into the records page.
  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">Todos os Pacientes</CardTitle>
                    <CardDescription>Visualize e gerencie todos os registros de pacientes.</CardDescription>
                </div>
                 <AddPatientDialog onPatientAdd={addUser} />
            </CardHeader>
            <CardContent>
                <PatientTable patients={getFilteredPatients(mockHealthRecords)} />
            </CardContent>
        </Card>
    </div>
  );
}
