'use client';

import { useState } from 'react';
import { PatientTable } from "@/components/patients/PatientTable";
import { AddPatientDialog } from "@/components/patients/AddPatientDialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockUsers } from '@/lib/mock-data';
import type { User } from '@/lib/types';


export default function PatientsPage() {
  const [patients, setPatients] = useState<User[]>(mockUsers.filter(u => u.perfil === 'paciente'));

  const handlePatientAdd = (newPatient: User) => {
    setPatients((prev) => [...prev, newPatient]);
  };

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">All Patients</CardTitle>
                    <CardDescription>View and manage all patient records.</CardDescription>
                </div>
                 <AddPatientDialog onPatientAdd={handlePatientAdd} />
            </CardHeader>
            <CardContent>
                <PatientTable patients={patients} />
            </CardContent>
        </Card>
    </div>
  );
}
