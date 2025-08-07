import ReportsDashboard from '@/components/reports/ReportsDashboard';

export default function ReportsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline mb-4">
                Relatórios de Desempenho
            </h1>
            <ReportsDashboard />
        </div>
    );
}
