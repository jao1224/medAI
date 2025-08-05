
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Mail, Phone, ShieldCheck } from 'lucide-react';

interface PatientRecordsDialogProps {
  patient: User;
  records: ElectronicHealthRecord[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onRecordUpdate: (record: ElectronicHealthRecord) => void;
}

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string }) => (
    <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{value || 'Não informado'}</span>
    </div>
);

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
};

export function PatientRecordsDialog({ patient, records, isOpen, onOpenChange, onRecordUpdate }: PatientRecordsDialogProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
           <div className="flex items-center gap-4">
               <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://placehold.co/64x64.png`} alt={patient.nome} data-ai-hint="profile avatar" />
                    <AvatarFallback className="text-xl">{getInitials(patient.nome)}</AvatarFallback>
                </Avatar>
                <div>
                    <DialogTitle className="font-headline text-2xl mb-1">{patient.nome}</DialogTitle>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-muted-foreground">
                        <DetailItem icon={Mail} label="Email" value={patient.email} />
                        <DetailItem icon={Phone} label="Telefone" value={patient.telefone} />
                        <DetailItem icon={ShieldCheck} label="Plano de Saúde" value={patient.plano_saude} />
                    </div>
                </div>
           </div>
          <DialogDescription className="mt-2">
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
