'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminMenu, userMenu, MenuItem } from './sidebarItems';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import OmsLogo from '@/components/reusable/icons/OmsLogo';
import ResetBankModal from '@/components/reset-bank/ResetModal';
import { useAppSelector } from '@/app/redux/hook';

interface SidebarProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  mobile?: boolean;
}

export default function Sidebar({
  open = false,
  setOpen,
  mobile = false,
}: SidebarProps) {
  const user = useAppSelector(state => state.auth.user);
  const role = user?.role;
  // console.log(role, 'ddssd')
  const pathname = usePathname();
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    if (mobile && open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobile, open]);

  if (!user) {
    return null; // Ensure Sidebar is hidden if no user is authenticated
  }

  const menu: MenuItem[] = role === 'admin' ? adminMenu : userMenu;

  const normalizePath = (path: string) => path.replace(/\/+$/, '');

  const isActive = (href: string) => {
    const currentPath = normalizePath(pathname);
    const targetPath = normalizePath(href);

    const exactMatchRoutes = ['/dashboard/admin', '/dashboard/user'];
    if (exactMatchRoutes.includes(targetPath)) {
      return currentPath === targetPath;
    }

    return currentPath.startsWith(targetPath);
  };

  const renderMenuItem = (item: MenuItem) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={() => setOpen?.(false)}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all
        ${isActive(item.href) ? 'bg-[#B79E6B] text-white font-semibold' : 'hover:bg-[#B79E6B] hover:text-white'}`}
    >
      <Image src={item.icon} width={18} height={18} alt={item.title} />
      <span>{item.title}</span>
    </Link>
  );

  // Desktop view for Sidebar
  if (!mobile) {
    return (
      <div className="h-screen w-55 background border-r flex flex-col justify-between text-white overflow-y-auto font-[manrope]">
        <div className="p-2.5">
          <Link href="/">
            <div className="flex items-center gap-2 mb-6">
              <Image
                src="/images/navbar-logo.png"
                width={40}
                height={40}
                alt="Logo"
              />
              <h1 className="relative font-bold text-3xl text-white">
                Table
                <OmsLogo />
                <span className="absolute top-6">Rounds</span>
              </h1>
            </div>
          </Link>

          <nav className="flex flex-col gap-1">
            {menu.map(item => (
              <div key={item.href}>
                {item.section && (
                  <p className="mt-4 mb-1 text-xs uppercase text-gray-300 font-semibold">
                    {item.section}
                  </p>
                )}
                {renderMenuItem(item)}
              </div>
            ))}
          </nav>
        </div>
      </div>
    );
  }

  // Mobile view for Sidebar
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-opacity-10 z-50 lg:hidden"
          onClick={() => setOpen?.(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-64 background border-r flex flex-col text-white transition-transform duration-300 z-1000 lg:hidden
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4">
          <button
            onClick={() => setOpen?.(false)}
            className="flex justify-end mb-4 w-full"
          >
            <X />
          </button>

          <nav className="flex flex-col gap-1">
            {menu.map(item => (
              <div key={item.href}>{renderMenuItem(item)}</div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
