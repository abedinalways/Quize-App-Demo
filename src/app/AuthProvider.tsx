'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMeQuery } from '@/app/redux/api/authApi';
import { useAppDispatch } from '@/app/redux/hook';
import { setUser, clearUser } from '@/app/redux/authSlice';

export default function AuthProvider({ children }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data, isError, isSuccess } = useMeQuery();

  useEffect(() => {
    if (data) {
      dispatch(setUser(data));

      // ✅ Redirect AFTER user is set
      if (data.role === 'admin') {
        router.replace('/dashboard/admin');
      } else {
        router.replace('/dashboard/user');
      }
    }

    if (isError) {
      dispatch(clearUser());
    }
  }, [data, isError]);

  return <>{children}</>;
}
