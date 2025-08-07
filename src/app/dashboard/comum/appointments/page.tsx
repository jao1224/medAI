

'use client';

import { useState, useMemo } from 'react';
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
import { Label } from '@/components/ui/label';
import type { Appointment } from '@/lib/types';
import { useUserData } from '@/hooks/use-user-data';
import { useAuth } from '@/hooks/use-auth';
import { format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AppointmentsPage() {
  const [selectedProfessional, setSelectedProfessional] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { professionals, appointments, setAppointments } = useUserData();
  const { user, hasRole } = useAuth();
  const searchParams = useSearchParams();
  const patientIdFromQuery = searchParams.get('patientId');
  
  const handleAppointmentAdd = (newAppointment: Appointment) => {
    setAppointments((prev) => [...prev, newAppointment]);
  };
  
  const handleAppointmentUpdate = (updatedAppointment: Appointment) => {
    setAppointments((prev) => 
      prev.map(a => a.id === updatedAppointment.id ? updatedAppointment : a)
    );
  };

  const handleAppointmentDelete = (appointmentId: string) => {
    setAppointments((prev) => prev.filter(a => a.id !== appointmentId));
  };

  // Função para verificar se uma data tem agendamentos
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(appointment => {
      const appointmentDate = parseISO(appointment.data_hora);
      return isSameDay(appointmentDate, date);
    });
  };

  // Função para obter datas com agendamentos
  const getDatesWithAppointments = () => {
    const dates = new Set<string>();
    appointments.forEach(appointment => {
      const date = parseISO(appointment.data_hora);
      dates.add(format(date, 'yyyy-MM-dd'));
    });
    return Array.from(dates).map(dateStr => new Date(dateStr));
  };

  // Filtro de agendamentos com base na data selecionada (otimizado com useMemo)
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const professionalMatch = selectedProfessional === 'all' || appointment.profissionalId === selectedProfessional;
      const patientMatch = !patientIdFromQuery || appointment.pacienteId === patientIdFromQuery;
      const doctorMatch = !hasRole('medico') || appointment.profissionalId === user?.uid;
      const dateMatch = !selectedDate || isSameDay(parseISO(appointment.data_hora), selectedDate);
      
      return professionalMatch && patientMatch && doctorMatch && dateMatch;
    });
  }, [appointments, selectedProfessional, selectedDate, patientIdFromQuery, hasRole, user?.uid]);

  // Função para lidar com a seleção de data no calendário
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  // Função para limpar o filtro de data
  const clearDateFilter = () => {
    setSelectedDate(undefined);
  };

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        {!hasRole('medico') && (
            <div className="sm:col-span-2 grid gap-4">
                <SchedulingAssistant />
            </div>
        )}
        <Card className="sm:col-span-2 h-full">
          <CardContent className="p-0 h-full">
            <div className="p-3">
              {selectedDate && (
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Agendamentos para {format(selectedDate, "PPP", { locale: ptBR })}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearDateFilter}
                  >
                    Limpar filtro
                  </Button>
                </div>
              )}
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="p-3 w-full h-full"
                classNames={{
                  month: 'flex flex-col h-full',
                  caption: 'flex justify-center pt-1 relative items-center',
                  table: 'w-full h-full',
                  row: 'flex w-full h-full',
                  day: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                  day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                  day_today: 'bg-accent text-accent-foreground',
                  day_outside: 'text-muted-foreground opacity-50',
                  day_disabled: 'text-muted-foreground opacity-50',
                  day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
                  day_hidden: 'invisible',
                }}
                modifiers={{
                  hasAppointment: getDatesWithAppointments(),
                }}
                modifiersStyles={{
                  hasAppointment: { 
                    backgroundColor: 'hsl(var(--primary) / 0.1)', 
                    color: 'hsl(var(--primary))',
                    fontWeight: 'bold'
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="font-headline">
            {selectedDate 
              ? `Agendamentos - ${format(selectedDate, "PPP", { locale: ptBR })}`
              : "Todos os Agendamentos"
            }
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            {!hasRole('medico') && (
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
            )}
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
          <AppointmentTable 
            appointments={filteredAppointments} 
            onAppointmentUpdate={handleAppointmentUpdate}
            onAppointmentDelete={handleAppointmentDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
