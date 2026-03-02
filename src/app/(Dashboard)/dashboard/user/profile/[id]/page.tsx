'use client';

import { useState, use } from 'react';
import { ProfileTab } from '@/types/profile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs';
import { useGetProfileDataQuery } from '@/app/redux/api/getProfileApi';


export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  const { data, isLoading, error } = useGetProfileDataQuery(id);

  const apiData = data?.data; 
  console.log(apiData, 'amar data')

  if (isLoading)
    return <div className="p-10 text-center">Loading profile...</div>;

  if (error || !apiData)
    return (
      <div className="p-10 text-center text-red-500">
        Error loading profile.
      </div>
    );

  const formattedData = {
    user: {
      name: apiData.name,
      email: apiData.email,
      id: apiData.id,
      avatar: apiData.avatar
        ? apiData.avatar.startsWith('http')
          ? apiData.avatar
          : `${apiData.avatar}`
        : '/images/settings/img01.png',
      title: apiData.training_practice || 'Medical Professional',
      location: apiData.address || 'Location not set',
      jobArea: apiData.current_practice || 'General Practice',
      joiningDate: 'March 2025',
      details: apiData.bio || 'No bio available.',
      followers: apiData.followers ?? 0,
      following: apiData.followings ?? 0,
    },
    education: apiData.educations ?? [],
    experience: apiData.experiences ?? [],
    publications: apiData.publications ?? [],
    skills: apiData.skills ?? [],
    questionBank: {
      completion: 0,
      ranking: 0,
      correctRate: 0,
      bestTopic: '',
    },
  };

  return (
    <div>
      <div className="w-full rounded-2xl background h-[383px]" />

      <div className="profile-container">
        <div className="-mt-60">
          <ProfileHeader user={formattedData.user} />
        </div>

        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          data={formattedData }
        />
      </div>
    </div>
  );
}
