
'use client';

import { PatientTable } from "@/components/patients/PatientTable";
import { AddPatientDialog } from "@/components/patients/AddPatientDialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUserData } from '@/hooks/use-user-data';
import { useAuth } from "@/hooks/use-auth";
import { mockAppointments, mockHealthRecords } from "@/lib/mock-data";
import type { User, ElectronicHealthRecord, UserProfile } from "@/lib/types";
import { useState } from "react";


export default function PatientsPage() {
  const { patients, addUser } = useUserData();
  const { user, hasRole, loading } = useAuth();
  const [records, setRecords] = useState<ElectronicHealthRecord[]>(mockHealthRecords);

  if (loading) {
    return <div>Carregando...</div>
  }

  const userRoles: UserProfile[] = user?.perfil ? [user.perfil] : [];

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">Pacientes</CardTitle>
                    <CardDescription>
                        {hasRole('medico') 
                            ? "Pacientes com agendamentos ou prontuários vinculados a você."
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
                    allAppointments={mockAppointments}
                    currentUser={user}
                    userRoles={userRoles}
                />
            </CardContent>
        </Card>
    </div>
  );
}
