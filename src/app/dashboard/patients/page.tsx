import { PatientTable } from "@/components/patients/PatientTable";
import { AddPatientDialog } from "@/components/patients/AddPatientDialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function PatientsPage() {
  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">All Patients</CardTitle>
                    <CardDescription>View and manage all patient records.</CardDescription>
                </div>
                 <AddPatientDialog />
            </CardHeader>
            <CardContent>
                <PatientTable />
            </CardContent>
        </Card>
    </div>
  );
}
