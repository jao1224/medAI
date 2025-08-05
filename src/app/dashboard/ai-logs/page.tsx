import AiLogForm from "@/components/ai/AiLogForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AiLogsPage() {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Logs do Agente de IA</CardTitle>
                    <CardDescription>
                        Registre as interações do agente de IA para ajudar a melhorar seu desempenho e rastrear as intenções do usuário.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AiLogForm />
                </CardContent>
            </Card>
        </div>
    )
}
