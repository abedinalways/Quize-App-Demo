'use client';

import { useState, useMemo } from 'react';
import {
  useGetQuestionsQuery,
  useDeleteQuestionMutation,
} from '@/app/redux/api/allQuestionApi';

import QuestionsTable, {
  Question as TableQuestion,
} from '@/components/question-manager/QuestionsTable';

import StatsCard from '@/components/question-manager/StatsCard';
import { toast } from 'sonner';

export default function QuestionManagerPage() {
  const [search, setSearch] = useState('');
  const [page] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading } = useGetQuestionsQuery({
    page,
    limit,
    search,
  });

  const [deleteQuestion] = useDeleteQuestionMutation();

 

  const questions: TableQuestion[] =
    data?.data.map(q => ({
      id: q.question_id,
      text: q.question_title,
      topic: q.topic ?? [],
      difficulty: q.difficulty,
      attempts: 0,
      correct: 0,
    })) ?? [];

  

  const handleDelete = async (q: TableQuestion) => {
    try {
      await deleteQuestion(q.id).unwrap();
      toast.success('Question deleted successfully');
    } catch {
      toast.error('Failed to delete question');
    }
  };



  if (isLoading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="font-[manrope]">
      <div className="mb-8">
        <h2 className="text-[#01281e] text-[32px] md:text-[48px] font-bold">
          Question Manager
        </h2>
        <p className="text-[#6b7280] text-[14px] md:text-[18px]">
          Edit previously created questions
        </p>
      </div>

      
      <StatsCard totalQuestions={data?.meta?.total ?? 0} totalTopics={11} />

      <QuestionsTable
        data={questions}
        search={search}
        setSearch={setSearch}
        onDelete={handleDelete}
      />
    </div>
  );
}
