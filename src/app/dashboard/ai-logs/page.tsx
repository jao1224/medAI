import AiLogForm from "@/components/ai/AiLogForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AiLogsPage() {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">AI Agent Logs</CardTitle>
                    <CardDescription>
                        Log interactions from the AI agent to help improve its performance and track user intents.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AiLogForm />
                </CardContent>
            </Card>
        </div>
    )
}
