'use client';

import Image from 'next/image';
import { Menu } from 'lucide-react';

import { NotificationButton } from '@/components/topbar/NotificationButton';

import { useMeQuery } from '@/app/redux/api/authApi';


interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps = {}) {
  // const user = useAppSelector(state => state.auth.user);
  // const role = user?.role;
  
  const { data: user, error } = useMeQuery(); 
  
  // const profileHref =
  //   role === 'admin'
  //     ? '/dashboard/admin/manage-settings'
  //     : '/dashboard/my-profile';

  return (
    <header className="sticky top-0 z-1000 bg-white border-b flex items-center justify-between gap-3 px-4 sm:px-6 h-15">
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      )}

      <div className="flex items-center gap-3 ml-auto">
        <NotificationButton />

        <Image
          src="/images/dashboard/topbar/message.png"
          width={20}
          height={20}
          alt="Messages"
        />

        {/* <Link href={profileHref}> */}
        <Image
          src={user?.avatar || '/images/default-avatar.png'}
          width={36}
          height={36}
          alt=""
          className="rounded-full"
        />
        {/* </Link> */}

        <span className="hidden sm:block font-semibold text-gray-700">
          {user?.name}
        </span>
      </div>
    </header>
  );
}
