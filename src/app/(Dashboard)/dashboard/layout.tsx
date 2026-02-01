'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/redux/hook';
import { useMeQuery } from '@/app/redux/api/authApi'; // Ensure you're using the correct query here
import AuthProvider from '@/app/AuthProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: user, error } = useMeQuery(); 

  // Debugging: Check if the user data is correctly fetched
  console.log('User from useMeQuery:', user);

  useEffect(() => {
    if (error) {
      console.log('Error fetching user:', error);
    }

    if (!user) return;

    if (user.role === 'admin') {
      router.replace('/dashboard/admin');
    } else {
      router.replace('/dashboard/user');
    }
  }, [user, router, error]);

  return <AuthProvider>{children}</AuthProvider>;
}
