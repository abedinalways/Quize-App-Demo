'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import Btn from '../reusable/button/Btn';
import Link from 'next/link';
import { useDiscoverProfilesQuery } from '@/app/redux/api/discoverApi';

const FindColleagues = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const { data, isLoading } = useDiscoverProfilesQuery({
    page: 1,
    limit: showAll ? 20 : 6,
    search: searchQuery,
  });

  const colleagues = data?.data ?? [];

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`
      : name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white border rounded-xl shadow-sm p-4">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Find Colleagues</h2>
        <Button
          onClick={() => setShowAll(!showAll)}
          className="bg-[#01503b] text-white"
        >
          {showAll ? 'Show Less' : 'View All Surgeons'}
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by name or practice"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && <p>Loading...</p>}

      {!isLoading && colleagues.length === 0 && (
        <p className="text-center text-gray-500">No colleagues found</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {colleagues.map(colleague => (
          <Card key={colleague.id} className="p-4">
            <Link href={`/dashboard/profile/${colleague.id}`}>
              <div className="flex gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={colleague.avatar} />
                  <AvatarFallback>{getInitials(colleague.name)}</AvatarFallback>
                </Avatar>

                <div>
                  <h4 className="font-semibold">{colleague.name}</h4>
                  <p className="text-sm text-gray-600">
                    {colleague.training_practice}
                  </p>
                </div>
              </div>
            </Link>

            {showAll && (
              <div className="mt-4 flex gap-2">
                <Btn
                  href="/dashboard/messages"
                  className="flex-1 bg-[#01503b] text-white"
                >
                  Message
                </Btn>
                <Btn className="flex-1 border text-[#01503b]">Follow</Btn>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FindColleagues;
