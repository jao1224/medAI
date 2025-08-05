'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';


const appointmentChartData = [
  { month: 'Janeiro', consulta: 186, exame: 80, procedimento: 40 },
  { month: 'Fevereiro', consulta: 305, exame: 200, procedimento: 100 },
  { month: 'Março', consulta: 237, exame: 120, procedimento: 80 },
  { month: 'Abril', consulta: 73, exame: 190, procedimento: 50 },
  { month: 'Maio', consulta: 209, exame: 130, procedimento: 90 },
  { month: 'Junho', consulta: 214, exame: 140, procedimento: 60 },
];

const appointmentChartConfig = {
  consulta: { label: 'Consulta', color: 'hsl(var(--primary))' },
  exame: { label: 'Exame', color: 'hsl(var(--secondary))' },
  procedimento: { label: 'Procedimento', color: 'hsl(var(--accent))' },
} satisfies ChartConfig;

const revenueChartData = [
    { professional: 'Dr. João', revenue: 12450 },
    { professional: 'Dra. Ana', revenue: 21800 },
    { professional: 'Dr. Pedro', revenue: 8500 },
    { professional: 'Dra. Sofia', revenue: 15300 },
];

const revenueChartConfig = {
    revenue: { label: 'Receita', color: 'hsl(var(--primary))'},
} satisfies ChartConfig;


export default function ReportsDashboard({ isDashboard = false }: { isDashboard?: boolean }) {
  return (
    <div className={cn("grid gap-4 md:gap-8", isDashboard ? "" : "md:grid-cols-2")}>
       <Card className={cn(isDashboard && "lg:col-span-3")}>
        <CardHeader>
          <CardTitle className="font-headline">Volume de Agendamentos</CardTitle>
          <CardDescription>Janeiro - Junho 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={appointmentChartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={appointmentChartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="consulta" fill="var(--color-consulta)" radius={4} />
              <Bar dataKey="exame" fill="var(--color-exame)" radius={4} />
              <Bar dataKey="procedimento" fill="var(--color-procedimento)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {!isDashboard && (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Receita por Profissional</CardTitle>
                <CardDescription>Acumulado do Ano</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={revenueChartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={revenueChartData} layout="vertical">
                    <CartesianGrid horizontal={false} />
                    <YAxis
                        dataKey="professional"
                        type="category"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        width={80}
                    />
                    <XAxis dataKey="revenue" type="number" hide />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={5} />
                </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
      )}

    </div>
  );
}
