import { RecordTable } from "@/components/records/RecordTable";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function RecordsPage() {
  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">E-Health Records</CardTitle>
                <CardDescription>
                    Browse and manage all electronic health records.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <RecordTable />
            </CardContent>
        </Card>
    </div>
  );
}
