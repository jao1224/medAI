
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import type { ElectronicHealthRecord, User } from "@/lib/types";
import { ViewRecordDialog } from "./ViewRecordDialog";
import { DialogTrigger } from "@radix-ui/react-dialog";


interface RecordTableProps {
  records: ElectronicHealthRecord[];
  patients: User[];
  onRecordUpdate: (record: ElectronicHealthRecord) => void;
}

export function RecordTable({ records, patients, onRecordUpdate }: RecordTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Paciente</TableHead>
          <TableHead>Tipo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => {
          const patient = patients.find(p => p.uid === record.pacienteId);
          if (!patient) return null; // Should not happen with mock data
          
          return (
            <ViewRecordDialog record={record} patient={patient} onRecordUpdate={onRecordUpdate} key={record.id}>
              <DialogTrigger asChild>
                <TableRow className="cursor-pointer">
                  <TableCell>{format(new Date(record.data), "PPP")}</TableCell>
                  <TableCell className="font-medium">{record.pacienteNome}</TableCell>
                  <TableCell className="capitalize">{record.tipo}</TableCell>
                </TableRow>
              </DialogTrigger>
            </ViewRecordDialog>
          )
        })}
      </TableBody>
    </Table>
  );
}
