'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/comum');
  }, [router]);

  return null; // Renderiza nada enquanto redireciona
}
