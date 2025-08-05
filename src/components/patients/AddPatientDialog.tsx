"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";
import type { User } from "@/lib/types";

interface AddPatientDialogProps {
  onPatientAdd: (newPatient: User) => void;
}


export function AddPatientDialog({ onPatientAdd }: AddPatientDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const dob = formData.get("dob") as string;

    if (!name || !email) {
        toast({
            title: "Erro",
            description: "Nome e email são obrigatórios.",
            variant: "destructive",
        });
        return;
    }

    const newPatient: User = {
        uid: `paciente${Date.now()}`,
        nome: name,
        email: email,
        telefone: phone,
        data_nascimento: dob,
        perfil: "paciente",
        criado_em: new Date().toISOString(),
    };

    onPatientAdd(newPatient);

    toast({
      title: "Sucesso",
      description: "Novo paciente adicionado com sucesso.",
    });
    setIsOpen(false);
    (event.target as HTMLFormElement).reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Paciente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Paciente</DialogTitle>
            <DialogDescription>
              Preencha os detalhes abaixo para adicionar um novo paciente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input name="name" id="name" defaultValue="Pedro Almeida" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input name="email" id="email" type="email" defaultValue="pedro@example.com" className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telefone
              </Label>
              <Input name="phone" id="phone" type="tel" defaultValue="11987654321" className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dob" className="text-right">
                Data de Nasc.
              </Label>
              <Input name="dob" id="dob" type="date" defaultValue="1995-02-10" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar Paciente</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
