
"use client";

import { useState, useEffect } from "react";
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
import type { User } from "@/lib/types";

interface EditPatientDialogProps {
  patient: User;
  onPatientUpdate: (updatedPatient: User) => void;
  children: React.ReactNode;
}

export function EditPatientDialog({ patient, onPatientUpdate, children }: EditPatientDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const dob = formData.get("dob") as string;
    const healthPlan = formData.get("healthPlan") as string;
    const cpf = formData.get("cpf") as string;
    const endereco = formData.get("endereco") as string;

    if (!name || !email) {
        toast({
            title: "Erro",
            description: "Nome e email são obrigatórios.",
            variant: "destructive",
        });
        return;
    }

    const updatedPatient: User = {
        ...patient,
        nome: name,
        email: email,
        cpf: cpf,
        telefone: phone,
        data_nascimento: dob,
        plano_saude: healthPlan,
        endereco: endereco,
    };

    onPatientUpdate(updatedPatient);

    toast({
      title: "Sucesso",
      description: "Paciente atualizado com sucesso.",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
            <DialogDescription>
              Modifique os detalhes abaixo para editar o paciente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input name="name" id="name" defaultValue={patient.nome} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input name="email" id="email" type="email" defaultValue={patient.email} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telefone
              </Label>
              <Input name="phone" id="phone" type="tel" defaultValue={patient.telefone} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dob" className="text-right">
                Data de Nasc.
              </Label>
              <Input name="dob" id="dob" type="date" defaultValue={patient.data_nascimento} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cpf" className="text-right">
                CPF
              </Label>
              <Input name="cpf" id="cpf" defaultValue={patient.cpf} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endereco" className="text-right">
                Endereço
              </Label>
              <Input name="endereco" id="endereco" defaultValue={patient.endereco} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="healthPlan" className="text-right">
                Plano de Saúde
              </Label>
              <Input name="healthPlan" id="healthPlan" defaultValue={patient.plano_saude} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
