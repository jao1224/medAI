
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { UserNav } from '@/components/dashboard/UserNav';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserDataProvider } from '@/hooks/use-user-data';
import { PanelLeft, Stethoscope } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserDataProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
          <div className="flex h-16 items-center border-b px-6">
              <Stethoscope className="h-6 w-6 text-primary" />
              <span className="ml-2 font-headline font-semibold">MedAI Clinic</span>
          </div>
          <SidebarNav />
        </aside>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                 <div className="flex h-16 items-center border-b px-6">
                  <Stethoscope className="h-6 w-6 text-primary" />
                  <span className="ml-2 font-headline font-semibold">MedAI Clinic</span>
                </div>
                <SidebarNav />
              </SheetContent>
            </Sheet>
            <div className="relative ml-auto flex-1 md:grow-0">
               {/* Header can have breadcrumbs or search */}
            </div>
            <UserNav />
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              {children}
          </main>
        </div>
      </div>
    </UserDataProvider>
  );
}
