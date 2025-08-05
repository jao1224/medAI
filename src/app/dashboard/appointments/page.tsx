

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppointmentTable } from '@/components/appointments/AppointmentTable';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { SchedulingAssistant } from '@/components/ai/SchedulingAssistant';
import { AddAppointmentDialog } from '@/components/appointments/AddAppointmentDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockAppointments } from '@/lib/mock-data';
import { Label } from '@/components/ui/label';
import type { Appointment } from '@/lib/types';
import { useUserData } from '@/hooks/use-user-data';

export default function AppointmentsPage() {
  const [selectedProfessional, setSelectedProfessional] = useState<string>('all');
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const { professionals } = useUserData();
  const searchParams = useSearchParams();
  const patientIdFromQuery = searchParams.get('patientId');
  
  const handleAppointmentAdd = (newAppointment: Appointment) => {
    setAppointments((prev) => [...prev, newAppointment]);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const professionalMatch = selectedProfessional === 'all' || appointment.profissionalId === selectedProfessional;
    const patientMatch = !patientIdFromQuery || appointment.pacienteId === patientIdFromQuery;
    return professionalMatch && patientMatch;
  });

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <div className="sm:col-span-2 grid gap-4">
          <SchedulingAssistant />
        </div>
        <Card className="sm:col-span-2">
          <CardContent className="p-0">
            <Calendar mode="single" className="p-3 w-full" />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="font-headline">Todos os Agendamentos</CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Label htmlFor="professional-filter" className="text-sm font-medium whitespace-nowrap">
                Profissional
              </Label>
              <Select
                value={selectedProfessional}
                onValueChange={setSelectedProfessional}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Selecione o Profissional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Profissionais</SelectItem>
                  {professionals.map((prof) => (
                    <SelectItem key={prof.uid} value={prof.uid}>
                      {prof.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <AddAppointmentDialog 
                onAppointmentAdd={handleAppointmentAdd}
              />
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Exportar XLSX
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AppointmentTable appointments={filteredAppointments} />
        </CardContent>
      </Card>
    </div>
  );
}
