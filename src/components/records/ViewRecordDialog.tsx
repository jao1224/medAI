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

interface ViewRecordDialogProps {
  record: ElectronicHealthRecord;
  children: React.ReactNode;
}

export function ViewRecordDialog({ record, children }: ViewRecordDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Prontuário</DialogTitle>
          <DialogDescription>
            {record.tipo} para {record.pacienteNome} em {format(new Date(record.data), "PPP")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
            <div className="font-medium">Profissional</div>
            <p className="text-muted-foreground">{record.profissionalNome}</p>

            <div className="font-medium">Descrição</div>
            <p className="text-muted-foreground bg-muted p-3 rounded-md">{record.descricao}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
