'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


import Topbar from '../topbar/Topbar';
import Sidebar from '../sidebar/Sidebar';
import { useAppSelector } from '@/app/redux/hook';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const role = useAppSelector(s => s.auth.user?.role);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (role && role !== 'admin') {
      router.replace('/login');
    }
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
