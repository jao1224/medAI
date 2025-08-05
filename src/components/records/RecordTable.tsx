
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
import type { ElectronicHealthRecord } from "@/lib/types";
import { ViewRecordDialog } from "./ViewRecordDialog";
import { DialogTrigger } from "@radix-ui/react-dialog";


interface RecordTableProps {
  records: ElectronicHealthRecord[];
  onRecordUpdate: (record: ElectronicHealthRecord) => void;
}

export function RecordTable({ records, onRecordUpdate }: RecordTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Paciente</TableHead>
          <TableHead>Profissional</TableHead>
          <TableHead>Tipo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <ViewRecordDialog record={record} onRecordUpdate={onRecordUpdate} key={record.id}>
            <DialogTrigger asChild>
              <TableRow className="cursor-pointer">
                <TableCell>{format(new Date(record.data), "PPP")}</TableCell>
                <TableCell className="font-medium">{record.pacienteNome}</TableCell>
                <TableCell>{record.profissionalNome}</TableCell>
                <TableCell className="capitalize">{record.tipo}</TableCell>
              </TableRow>
            </DialogTrigger>
          </ViewRecordDialog>
        ))}
      </TableBody>
    </Table>
  );
}
