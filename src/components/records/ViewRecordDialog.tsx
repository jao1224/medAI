"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ElectronicHealthRecord } from "@/lib/types";
import { format } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";

interface ViewRecordDialogProps {
  record: ElectronicHealthRecord;
  children: React.ReactNode;
}

const RecordDetailItem = ({ label, value }: { label: string, value: string }) => (
    <div>
        <h4 className="font-semibold text-base">{label}</h4>
        <p className="text-muted-foreground text-sm bg-muted p-3 rounded-md mt-1 whitespace-pre-wrap">{value}</p>
    </div>
);


export function ViewRecordDialog({ record, children }: ViewRecordDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">Detalhes do Prontuário</DialogTitle>
          <DialogDescription>
            {record.tipo} de {record.pacienteNome} em {format(new Date(record.data), "PPP")}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
            <div className="space-y-4 py-4 pr-6">
                <div className="text-sm">
                    <div className="font-medium">Profissional</div>
                    <p className="text-muted-foreground">{record.profissionalNome}</p>
                </div>
                
                <RecordDetailItem label="Anamnese" value={record.anamnese} />
                <RecordDetailItem label="Exame Físico" value={record.exameFisico} />
                <RecordDetailItem label="Hipótese Diagnóstica" value={record.hipoteseDiagnostica} />
                <RecordDetailItem label="Conduta" value={record.conduta} />
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
