'use client';

import { useEffect } from 'react';
import { useMeQuery } from '@/app/redux/api/authApi';
import { useAppDispatch } from '@/app/redux/hook';
import { setUser, clearUser } from '@/app/redux/authSlice';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { data, isSuccess, isError } = useMeQuery();

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data));
    }

    if (isError) {
      dispatch(clearUser());
    }
  }, [isSuccess, isError, data, dispatch]);

  return <>{children}</>;
}
