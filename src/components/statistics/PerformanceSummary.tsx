import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import AnimatedProgressCircle from './AnimatedProgressCircle';
import StatIcon from '../ui/StatIcon';
import QuestionIcon from '../reusable/icons/QuestionIcon';
import { useGetStatisticsQuery } from '@/app/redux/api/StatisTicsApi';






export default function PerformanceSummary() {
  const { data, isLoading } = useGetStatisticsQuery();

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground text-center">
        Loading statistics...
      </div>
    );
  }

  if (!data || !data.data) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        No performance data available
      </div>
    );
  }

  // Accessing the nested 'data' object from the API response
  const { performance: p, question_bank: qb } = data.data;

  return (
    <section className="grid gap-6 mt-6 font-[manrope]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Performance Card */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full text-green-700 text-xs">
                <StatIcon />
              </span>
              Your Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6">
            {/* Updated value to correct_percentage_avg */}
            <AnimatedProgressCircle
              value={p.correct_percentage_avg}
              color="green"
            />
            <div className="space-y-3 text-[20px] flex-1 items-center">
              <div className="flex items-center justify-between bg-[#ecfdf5] p-6 rounded-[8px]">
                <span className="text-gray-600">Total Correct</span>
                <span className="font-semibold text-green-700">
                  {p.total_correct}
                </span>
              </div>
              <div className="flex items-center justify-between bg-[#fef2f2] px-[24px] py-[24px] rounded-[8px]">
                <span className="text-gray-600">Total Incorrect</span>
                <span className="font-semibold text-red-600">
                  {p.total_incorrect}
                </span>
              </div>
              <div className="flex items-center justify-between card-bg px-[24px] py-[24px] rounded-[8px]">
                <span className="text-gray-600">Total Omitted</span>
                <span className="font-semibold text-gray-700">
                  {p.total_omitted}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Bank Card */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs">
                <QuestionIcon />
              </span>
              Question Bank Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            {/* Updated value to progress_percentage */}
            <AnimatedProgressCircle
              value={qb.progress_percentage}
              color="brown"
            />
            <div className="space-y-[12px] text-[20px] flex-1 items-center">
              <div className="flex items-center justify-between card-bg01 px-[24px] py-[24px] rounded-[8px]">
                <span className="text-gray-600">Used Questions</span>
                <span className="font-semibold text-amber-700">
                  {qb.used_questions}
                </span>
              </div>
              <div className="flex items-center justify-between card-bg px-[24px] py-[24px] rounded-[8px]">
                <span className="text-gray-600">Unused Questions</span>
                <span className="font-semibold text-gray-700">
                  {qb.unused_questions}
                </span>
              </div>
              <div className="flex items-center justify-between bg-[#ecfdf5] px-[24px] py-[24px] rounded-[8px]">
                <span className="text-gray-600">Total Questions</span>
                <span className="font-semibold text-gray-900">
                  {qb.total_questions}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
