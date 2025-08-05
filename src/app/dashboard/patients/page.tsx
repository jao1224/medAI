
'use client';

import { PatientTable } from "@/components/patients/PatientTable";
import { AddPatientDialog } from "@/components/patients/AddPatientDialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUserData } from '@/hooks/use-user-data';
import { useAuth } from "@/hooks/use-auth";
import { mockAppointments, mockHealthRecords } from "@/lib/mock-data";


export default function PatientsPage() {
  const { patients, addUser } = useUserData();
  const { user, hasRole } = useAuth();

  const getFilteredPatients = () => {
    if (hasRole('medico') && user) {
      const doctorPatientIdsFromAppointments = new Set(
        mockAppointments
          .filter(appt => appt.profissionalId === user.uid)
          .map(appt => appt.pacienteId)
      );
      const doctorPatientIdsFromRecords = new Set(
        mockHealthRecords
            .filter(record => record.profissionalId === user.uid)
            .map(record => record.pacienteId)
      );

      const combinedPatientIds = new Set([...doctorPatientIdsFromAppointments, ...doctorPatientIdsFromRecords]);

      return patients.filter(patient => combinedPatientIds.has(patient.uid));
    }
    return patients;
  }

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
                <PatientTable patients={getFilteredPatients()} />
            </CardContent>
        </Card>
    </div>
  );
}
