import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-lg text-center p-6">
        <CardHeader>
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-4 w-fit mb-4">
            <User className="h-10 w-10" />
          </div>
          <CardTitle className="font-headline mt-4 text-2xl">User Profile</CardTitle>
          <CardDescription className="text-base">
            This feature is under construction. Soon you will be able to view and edit your profile here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-muted-foreground">Coming Soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
