
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { RecordTable } from "@/components/records/RecordTable";
import { AddRecordDialog } from '@/components/records/AddRecordDialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ElectronicHealthRecord } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { AddPatientDialog } from '@/components/patients/AddPatientDialog';
import { useUserData } from '@/hooks/use-user-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText } from 'lucide-react';

export default function RecordsPage() {
  const { user, hasRole, loading } = useAuth();
  const { patients, addUser, records: allRecords, setRecords, appointments } = useUserData();
  const searchParams = useSearchParams();
  const patientIdFromQuery = searchParams.get('patientId');

  const handleRecordAdd = (newRecord: ElectronicHealthRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
  };

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

  // Restrict access to non-medical staff
  if (!hasRole('medico')) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <Alert className="max-w-lg text-center">
            <AlertTitle className="font-headline text-xl flex items-center justify-center gap-2">
              <FileText className="h-6 w-6" />
              Acesso Restrito
            </AlertTitle>
            <AlertDescription className="mt-2">
              Apenas profissionais de saúde (médicos) podem visualizar os prontuários eletrônicos.
            </AlertDescription>
          </Alert>
        </div>
    );
  }

  const patient = patientIdFromQuery 
    ? patients.find(p => p.uid === patientIdFromQuery)
    : null;

  const filteredRecords = allRecords.filter(record => {
    // Doctor can only see their own records.
    const doctorMatch = record.profissionalId === user?.uid;
    const patientMatch = !patientIdFromQuery || record.pacienteId === patientIdFromQuery;
    return doctorMatch && patientMatch;
  });

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">Prontuários Eletrônicos</CardTitle>
                    <CardDescription>
                        {patient?.nome
                            ? `Exibindo prontuários para ${patient.nome}.`
                            : "Navegue e gerencie todos os seus prontuários eletrônicos de saúde."
                        }
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    <AddPatientDialog onPatientAdd={addUser} />
                    <AddRecordDialog 
                      onRecordAdd={handleRecordAdd} 
                      appointments={appointments}
                      records={allRecords}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <RecordTable 
                  records={filteredRecords} 
                  onRecordUpdate={handleRecordUpdate} 
                  patients={patients}
                />
            </CardContent>
        </Card>
    </div>
  );
}
