"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye } from "lucide-react";
import type { ElectronicHealthRecord } from "@/lib/types";
import { ViewRecordDialog } from "./ViewRecordDialog";

interface RecordActionsProps {
  record: ElectronicHealthRecord;
}

export function RecordActions({ record }: RecordActionsProps) {
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <ViewRecordDialog record={record}>
             <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalhes
            </DropdownMenuItem>
        </ViewRecordDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
