'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
;
import { useMeQuery } from '@/app/redux/api/authApi'; 
import AuthProvider from '@/app/AuthProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: user, error } = useMeQuery(); 
  
    
  useEffect(() => {
    if (error) {
      console.log('Error fetching user:', error);
    }

    if (!user) return;

    if (user?.type === 'admin') {
      router.replace('/dashboard/admin');
    } else {
      router.replace('/dashboard/user');
    }
  }, [user, router, error]);

  return <AuthProvider>{children}</AuthProvider>;
}
