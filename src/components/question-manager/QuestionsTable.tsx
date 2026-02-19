'use client';

import { useMemo, useState } from 'react';
import DeleteIcon from '../reusable/icons/DeleteIcon';
import EditIconAdmin from '../reusable/icons/EditIconAdmin';

export type Question = {
  id: string;
  text: string;
  topic: string[];
  difficulty: string;
  attempts: number;
  correct: number;
};

type Props = {
  data: Question[];
  search: string;
  setSearch: (value: string) => void;
  onEdit?: (question: Question) => void;
  onDelete?: (question: Question) => void;
};

export default function QuestionsTable({
  data,
  search,
  setSearch,
  onEdit,
  onDelete,
}: Props) {
  const [sortKey, setSortKey] = useState<'difficulty' | 'id' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredData = useMemo(() => {
    let result = data.filter(
      q =>
        q.text.toLowerCase().includes(search.toLowerCase()) ||
        q.id.toLowerCase().includes(search.toLowerCase()),
    );

    if (sortKey) {
      result = [...result].sort((a, b) => {
        const valueA = a[sortKey];
        const valueB = b[sortKey];

        if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, search, sortKey, sortOrder]);

  const handleSort = (key: 'difficulty' | 'id') => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-white rounded-[10px] shadow-sm p-5 mt-8">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold text-[#01281e] text-[20px]">Questions</h3>

        <div className="flex gap-3">
          <input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-[#01503b] text-white h-[89px]">
            <tr>
              <th
                className="px-4 py-3 cursor-pointer"
                onClick={() => handleSort('id')}
              >
                Question ID
              </th>
              <th className="px-4 py-3">Question Stem</th>
              <th className="px-4 py-3">Topic</th>
              <th
                className="px-4 py-3 cursor-pointer"
                onClick={() => handleSort('difficulty')}
              >
                Difficulty
              </th>
              <th className="px-4 py-3 text-center">Attempts</th>
              <th className="px-4 py-3 text-center">% Correct</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((question, index) => (
              <tr
                key={question.id}
                className={index % 2 ? 'bg-[#f9fafb]' : 'bg-white'}
              >
                <td className="px-4 py-4 text-center">{question.id}</td>
                <td className="px-4 py-4  text-center">{question.text}</td>
                <td className="px-4 py-4 text-center">
                  <div className="flex justify-center  gap-3 flex-wrap">
                    {question.topic?.map(t => (
                      <span key={t} className='rounded-sm px-3 py-2 bg-green-900 text-white'>{t}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 text-center">{question.difficulty}</td>
                <td className="px-4 py-4 text-center">{question.attempts}</td>
                <td className="px-4 py-4 text-center">{question.correct}</td>
                <td className="px-4 py-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onEdit?.(question)}
                      className="cursor-pointer"
                    >
                      <EditIconAdmin />
                    </button>
                    <button
                      onClick={() => onDelete?.(question)}
                      className="cursor-pointer"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500">
                  No questions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
