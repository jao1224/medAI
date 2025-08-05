
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ViewRecordDialog } from "@/components/records/ViewRecordDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogTrigger } from "@/components/ui/dialog";
import type { User, ElectronicHealthRecord } from "@/lib/types";
import { format } from "date-fns";

interface PatientRecordsDialogProps {
  patient: User;
  records: ElectronicHealthRecord[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onRecordUpdate: (record: ElectronicHealthRecord) => void;
}

export function PatientRecordsDialog({ patient, records, isOpen, onOpenChange, onRecordUpdate }: PatientRecordsDialogProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Prontuários de {patient.nome}</DialogTitle>
          <DialogDescription>
            Lista de todos os registros médicos e consultas do paciente.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Profissional</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {records.length > 0 ? (
                        records.map((record) => (
                            <ViewRecordDialog record={record} onRecordUpdate={onRecordUpdate} key={record.id}>
                                <DialogTrigger asChild>
                                    <TableRow className="cursor-pointer">
                                        <TableCell>{format(new Date(record.data), "PPP")}</TableCell>
                                        <TableCell className="capitalize">{record.tipo}</TableCell>
                                        <TableCell>{record.profissionalNome}</TableCell>
                                    </TableRow>
                                </DialogTrigger>
                            </ViewRecordDialog>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                Nenhum prontuário encontrado para este paciente.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
