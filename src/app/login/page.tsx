import { LoginForm } from '@/components/auth/LoginForm';
import { Stethoscope } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <div className="mx-auto h-12 w-12 text-primary">
                <Stethoscope className="h-full w-full" />
            </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground font-headline">
            MedAI Clinic Assistant
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome back! Please sign in to your account.
          </p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Use a mock email like 'admin@clinica.com' or 'medico@clinica.com' to log in. No password required.
        </p>
      </div>
    </div>
  );
}
