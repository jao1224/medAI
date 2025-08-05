import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentTable } from "@/components/appointments/AppointmentTable";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { SchedulingAssistant } from "@/components/ai/SchedulingAssistant";

export default function AppointmentsPage() {
  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <div className="sm:col-span-2 grid gap-4">
               <SchedulingAssistant />
            </div>
            <Card className="sm:col-span-2">
                <CardContent className="p-0">
                    <Calendar
                        mode="single"
                        className="p-3 w-full"
                    />
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline">All Appointments</CardTitle>
                 <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <FileDown className="mr-2 h-4 w-4" />
                        Export PDF
                    </Button>
                    <Button variant="outline" size="sm">
                        <FileDown className="mr-2 h-4 w-4" />
                        Export XLSX
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <AppointmentTable />
            </CardContent>
        </Card>
    </div>
  );
}
