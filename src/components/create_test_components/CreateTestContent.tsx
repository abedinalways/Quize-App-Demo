'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CustomCheckbox } from '../ui/CustomCheckbox';
import { Switch } from '../ui/CustomSwitch';

import { useStartTestMutation } from '@/app/redux/api/startTestApi';

const TOPICS: string[] = [
  'Anesthesia/Medicine',
  'Dentoalveolar',
  'Reconstruction',
  'Cancer',
  'Implants',
  'TMJ',
  'Cleft/Craniofacial',
  'Orthognathic',
  'Trauma',
  'Cosmetics',
  'Pathology',
];

const DIFFICULTY_LEVELS = ['Intern', 'Senior', 'Boards'] as const;

type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export function CreateTestContent() {
  const router = useRouter();

  const [selectedTopics, setSelectedTopics] = useState<string[]>(TOPICS);
  const [testMode, setTestMode] = useState<'Timed' | 'Untimed'>('Untimed');
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyLevel>('Intern');

  const [selectedStatus, setSelectedStatus] = useState<string[]>(['Used']);
  const [numQuestions, setNumQuestions] = useState<string>('');

  const [startTest, { isLoading }] = useStartTestMutation();

  const handleTopicToggle = (topic: string, checked: boolean) => {
    setSelectedTopics(prev =>
      checked ? [...prev, topic] : prev.filter(t => t !== topic),
    );
  };

  const handleStatusToggle = (status: string, checked: boolean) => {
    setSelectedStatus(prev =>
      checked ? [...prev, status] : prev.filter(s => s !== status),
    );
  };

  const handleDifficultySelect = (level: DifficultyLevel) => {
    setSelectedDifficulty(level);
  };

  const handleStartTest = async () => {
    try {
      if (!numQuestions || selectedTopics.length === 0) return;

      const payload = {
        total_questions: Number(numQuestions),

        test_mode: selectedStatus
          .filter(s => s === 'Used' || s === 'Unused')
          .map(s => s.toLowerCase()),

        difficulty: selectedDifficulty,

        topic: selectedTopics.map(t =>
          t.replace('/', '_').replace(/\s+/g, '_'),
        ),
      };

      const res = await startTest(payload).unwrap();

      const testSession = {
        id: res.data.id,
        total_questions: res.data.total_questions,
        questions: res.data.questions,
      };

      sessionStorage.setItem(
        `TEST_SESSION_${res.data.id}`,
        JSON.stringify(testSession),
      );

      router.push(`/dashboard/user/create-test/${res.data.id}`);
    } catch (error) {
      console.error('Failed to start test', error);
    }
  };

  return (
    <div className="flex-1 max-w-5xl space-y-4 pt-2 test-container text-[#4b5563]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2">
        <h2 className="md:text-[48px] text-3xl text-[#01281e] leading-[130%] font-bold">
          Create Test
        </h2>
      </div>

      <p className="text-sm md:text-[18px] text-[#444950] leading-[160%] font-normal">
        Configure your test parameters and get started
      </p>

      <div className="space-y-4 w-[280px] md:w-[720px] xl:w-[914px]">
        {/* Question Count */}
        <div className="space-y-4 bg-white p-4 rounded-[12px] border border-[#e9e9e9] custom-shadow">
          <h3 className="text-xl md:text-2xl text-[#444950] font-bold">
            Question Count
          </h3>
          <p>Set the number of questions for your test</p>
          <Select value={numQuestions} onValueChange={setNumQuestions}>
            <SelectTrigger className="w-full sm:w-[180px] h-[61px] bg-[#f7f7f3] p-4 rounded-[8px] cursor-pointer">
              <SelectValue placeholder="Select number" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 50 }, (_, i) => i + 1).map(num => (
                <SelectItem key={num} value={String(num)}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Test Mode */}
        <div className="space-y-4 bg-white p-4 rounded-[12px] border border-[#e9e9e9] custom-shadow">
          <h3 className="text-xl md:text-2xl text-[#444950] font-bold">
            Test Mode
          </h3>

          <div className="flex items-center gap-4">
            <Label>Timed</Label>
            <Switch
              checked={testMode === 'Timed'}
              onCheckedChange={v => setTestMode(v ? 'Timed' : 'Untimed')}
            />
            <Label>Untimed</Label>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            {[
              'Used',
              'Unused',
              'Correct',
              'Incorrect',
              'Omitted',
              'Marked',
            ].map(status => (
              <div
                key={status}
                className="flex items-center space-x-2 bg-[#f8f8f4] px-4 py-2 rounded-[8px]"
              >
                <CustomCheckbox
                  checked={selectedStatus.includes(status)}
                  onCheckedChange={c => handleStatusToggle(status, Boolean(c))}
                />
                <Label>{status}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="space-y-4 bg-white p-4 rounded-[12px] border border-[#e9e9e9] custom-shadow">
          <h3 className="text-xl md:text-[24px] font-bold text-[#444950]">
            Difficulty
          </h3>

          <div className="flex flex-wrap gap-4">
            {DIFFICULTY_LEVELS.map(level => {
              const isSelected = selectedDifficulty === level;

              return (
                <div
                  key={level}
                  className="flex items-center gap-2 bg-[#f8f8f4] px-4 py-2 rounded-[8px] cursor-pointer"
                  onClick={() => handleDifficultySelect(level)}
                >
                  <CustomCheckbox checked={isSelected} />
                  <span>{level}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Topics */}
        <div className="space-y-4 bg-white p-4 rounded-[12px] border border-[#e9e9e9] custom-shadow">
          <h3 className="text-xl md:text-[24px] font-bold text-[#444950]">
            Topic
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOPICS.map(topic => {
              const isSelected = selectedTopics.includes(topic);

              return (
                <div
                  key={topic}
                  className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer ${
                    isSelected
                      ? 'bg-[#f7f7f3] border-gray-400'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleTopicToggle(topic, !isSelected)}
                >
                  <CustomCheckbox checked={isSelected} />
                  <Label>{topic}</Label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-4">
          <button
            onClick={handleStartTest}
            disabled={isLoading}
            className="bg-[#01503b] text-white px-6 py-3 rounded-[8px] cursor-pointer"
          >
            {isLoading ? 'Starting...' : 'Start Test'}
          </button>
        </div>
      </div>
    </div>
  );
}
