
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "@/lib/types";
import { format } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Mail, Phone, Home, Cake, ShieldCheck } from 'lucide-react';

interface ViewPatientDialogProps {
  patient: User;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string }) => (
    <div className="flex items-start gap-4">
        <Icon className="h-5 w-5 text-muted-foreground mt-1" />
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">{value || 'Não informado'}</p>
        </div>
    </div>
);


export function ViewPatientDialog({ patient, isOpen, onOpenChange }: ViewPatientDialogProps) {

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
                <AvatarImage src={`https://placehold.co/64x64.png`} alt={patient.nome} data-ai-hint="profile avatar" />
                <AvatarFallback className="text-xl">{getInitials(patient.nome)}</AvatarFallback>
            </Avatar>
            <div>
                <DialogTitle className="font-headline text-2xl">{patient.nome}</DialogTitle>
                <DialogDescription>
                    Detalhes do paciente
                </DialogDescription>
            </div>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6 py-4 pr-6">
                <DetailItem icon={Mail} label="Email" value={patient.email} />
                <DetailItem icon={Phone} label="Telefone" value={patient.telefone} />
                <DetailItem icon={Cake} label="Data de Nascimento" value={patient.data_nascimento ? format(new Date(patient.data_nascimento), "PPP") : undefined} />
                <DetailItem icon={Home} label="Endereço" value={patient.endereco} />
                <DetailItem icon={ShieldCheck} label="Plano de Saúde" value={patient.plano_saude} />
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
