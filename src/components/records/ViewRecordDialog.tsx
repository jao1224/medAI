
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ElectronicHealthRecord } from "@/lib/types";
import { format } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { EditRecordDialog } from "./EditRecordDialog";

interface ViewRecordDialogProps {
  record: ElectronicHealthRecord;
  onRecordUpdate: (record: ElectronicHealthRecord) => void;
  children: React.ReactNode;
}

const RecordDetailItem = ({ label, value }: { label: string, value: string }) => (
    <div>
        <h4 className="font-semibold text-base">{label}</h4>
        <p className="text-muted-foreground text-sm bg-muted p-3 rounded-md mt-1 whitespace-pre-wrap">{value}</p>
    </div>
);


export function ViewRecordDialog({ record, onRecordUpdate, children }: ViewRecordDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">Detalhes do Prontuário</DialogTitle>
          <DialogDescription>
            {record.tipo} de {record.pacienteNome} em {format(new Date(record.data), "PPP")}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
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
        <DialogFooter>
            <EditRecordDialog record={record} onRecordUpdate={(updatedRecord) => {
                onRecordUpdate(updatedRecord);
                setIsOpen(false); // Fecha o modal de visualização após a edição
            }}>
                <DialogTrigger asChild>
                     <Button variant="outline">
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                    </Button>
                </DialogTrigger>
            </EditRecordDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
