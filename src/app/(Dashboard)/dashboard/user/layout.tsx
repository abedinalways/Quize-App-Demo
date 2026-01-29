'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import Sidebar from '../sidebar/Sidebar';
import Topbar from '../topbar/Topbar';
import { useAppSelector } from '@/app/redux/hook';

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const router = useRouter();
  const role = useAppSelector(s => s.auth.user?.role);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!role) router.replace('/login');
  }, [role]);

  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:block w-55">
        <Sidebar />
      </aside>

      <Sidebar mobile open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col">
        <Topbar onMenuClick={() => setOpen(true)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
