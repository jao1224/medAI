
'use client';

import { useState } from 'react';
import { RecordTable } from "@/components/records/RecordTable";
import { AddRecordDialog } from '@/components/records/AddRecordDialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockHealthRecords } from '@/lib/mock-data';
import type { ElectronicHealthRecord } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { AddPatientDialog } from '@/components/patients/AddPatientDialog';
import { useUserData } from '@/hooks/use-user-data';

export default function RecordsPage() {
  const [records, setRecords] = useState<ElectronicHealthRecord[]>(mockHealthRecords);
  const { user, hasRole, loading } = useAuth();
  const { addUser } = useUserData();

  const handleRecordAdd = (newRecord: ElectronicHealthRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
  };
  
  if (loading) {
    return <div>Carregando...</div>
  }

  const filteredRecords = hasRole('medico') && user 
    ? records.filter(record => record.profissionalId === user.uid)
    : records;

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">Prontuários Eletrônicos</CardTitle>
                    <CardDescription>
                        Navegue e gerencie todos os prontuários eletrônicos de saúde.
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    {hasRole('medico') && <AddPatientDialog onPatientAdd={addUser} />}
                    {hasRole('medico') && <AddRecordDialog onRecordAdd={handleRecordAdd} />}
                </div>
            </CardHeader>
            <CardContent>
                <RecordTable records={filteredRecords} />
            </CardContent>
        </Card>
    </div>
  );
}
