
'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppointmentTable } from '@/components/appointments/AppointmentTable';
import { Button } from '@/components/ui/button';
import { FileDown, PlusCircle } from 'lucide-react';
import { SchedulingAssistant } from '@/components/ai/SchedulingAssistant';
import { AddAppointmentDialog } from '@/components/appointments/AddAppointmentDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockUsers } from '@/lib/mock-data';
import { Label } from '@/components/ui/label';

export default function AppointmentsPage() {
  const [selectedProfessional, setSelectedProfessional] = useState<string>('all');

  const professionals = mockUsers.filter((user) => user.perfil === 'medico');

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
          <CardTitle className="font-headline">All Appointments</CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Label htmlFor="professional-filter" className="text-sm font-medium whitespace-nowrap">
                Professional
              </Label>
              <Select
                value={selectedProfessional}
                onValueChange={setSelectedProfessional}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select Professional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Professionals</SelectItem>
                  {professionals.map((prof) => (
                    <SelectItem key={prof.uid} value={prof.uid}>
                      {prof.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <AddAppointmentDialog />
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Export XLSX
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AppointmentTable professionalId={selectedProfessional} />
        </CardContent>
      </Card>
    </div>
  );
}
