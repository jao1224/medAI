
'use client';

import { useState } from 'react';
import { RecordTable } from "@/components/records/RecordTable";
import { AddRecordDialog } from '@/components/records/AddRecordDialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockHealthRecords } from '@/lib/mock-data';
import type { ElectronicHealthRecord } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

export default function RecordsPage() {
  const [records, setRecords] = useState<ElectronicHealthRecord[]>(mockHealthRecords);
  const { hasRole } = useAuth();

  const handleRecordAdd = (newRecord: ElectronicHealthRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
  };

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
                {hasRole('medico') && <AddRecordDialog onRecordAdd={handleRecordAdd} />}
            </CardHeader>
            <CardContent>
                <RecordTable records={records} />
            </CardContent>
        </Card>
    </div>
  );
}
