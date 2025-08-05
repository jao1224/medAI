'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot } from 'lucide-react';

const SchedulingAssistantContent = dynamic(
    () => import('./SchedulingAssistantContent').then(mod => mod.SchedulingAssistantContent),
    { 
        ssr: false,
        loading: () => (
             <Card className='h-full'>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                    <Bot className="h-6 w-6" />
                    Assistente de Agendamento IA
                    </CardTitle>
                    <CardDescription>
                    Receba sugestões de agendamento com IA baseadas no histórico do paciente e na disponibilidade do profissional.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }
);

export function SchedulingAssistant() {
  return <SchedulingAssistantContent />;
}
