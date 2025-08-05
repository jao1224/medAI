
'use client';

import { PatientTable } from "@/components/patients/PatientTable";
import { AddPatientDialog } from "@/components/patients/AddPatientDialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUserData } from '@/hooks/use-user-data';


export default function PatientsPage() {
  const { patients, addUser } = useUserData();

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">All Patients</CardTitle>
                    <CardDescription>View and manage all patient records.</CardDescription>
                </div>
                 <AddPatientDialog onPatientAdd={addUser} />
            </CardHeader>
            <CardContent>
                <PatientTable patients={patients} />
            </CardContent>
        </Card>
    </div>
  );
}
