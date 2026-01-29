'use client';



import { StatsCard } from '@/components/admin/StatsCard';
import { UserVerification } from '@/components/admin/UserVerification';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { useGetPendingUsersQuery, useGetRecentActivitiesQuery } from '@/app/redux/api/adminApi';

export default function AdminDashboardPage() {
  const { data: users = [] } = useGetPendingUsersQuery();
  const { data: activities = [] } = useGetRecentActivitiesQuery();

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>

      <StatsCard />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <UserVerification
            users={users}
            onAction={(user, action) => {
              // TODO: Implement the approve/reject logic here
              console.log(`User ${user.id} ${action}`);
            }}
          />
        </div>
        <RecentActivity activities={activities} />
      </div>
    </div>
  );
}
