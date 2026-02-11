'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import QuizQuestionView from '@/components/create_test_components/QuizQuestionView';

import type {
  MarkedQuestion,
  QuizDetailsUI,
  QuizQuestionDataUI,
  Question,
} from '@/types/test-session';

const TEST_SESSION_KEY_PREFIX = 'TEST_SESSION_';
const MARKED_KEY_PREFIX = 'MARKED_QUESTIONS_';

function safeParseJSON<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function toQuizDetailsUI(q: Question): QuizDetailsUI {
  return {
    title: q.question_title,
    question: q.question_statement,
    options: q.answer_options.map(o => ({
      id: o.id,
      text: o.option_text,
      percentage: 0,
    })),
    userAnswerId: null,
    correctAnswerId: null,
    explanation: null,
  };
}

export default function CreateTestPage() {
  const router = useRouter();
  const params = useParams<{ testId: string }>();
  const testId = params?.testId;

  const [questions, setQuestions] = useState<QuizDetailsUI[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [markedQuestions, setMarkedQuestions] = useState<MarkededQuestion[]>(
    [],
  );

  useEffect(() => {
    if (!testId) return;

    // load test session data stored from /test response
    const session = safeParseJSON<{
      id: string;
      total_questions: number;
      questions: Question[];
    }>(sessionStorage.getItem(`${TEST_SESSION_KEY_PREFIX}${testId}`));

    if (!session?.questions?.length) {
      // fallback: if user refreshes and sessionStorage is empty
      // you must implement a GET endpoint to fetch test by id
      // for now redirect back safely
      router.push('/dashboard/user/create-test');
      return;
    }

    setQuestions(session.questions.map(toQuizDetailsUI));

    // marked state load
    const savedMarks = safeParseJSON<MarkedQuestion[]>(
      localStorage.getItem(`${MARKED_KEY_PREFIX}${testId}`),
    );
    setMarkedQuestions(Array.isArray(savedMarks) ? savedMarks : []);
  }, [router, testId]);

  const totalQuestions = questions.length;

  const data: QuizQuestionDataUI | null = useMemo(() => {
    if (!totalQuestions) return null;
    const quizDetails = questions[currentQuestion - 1];
    return {
      testProgress: {
        currentQuestion,
        totalQuestions,
        questionID: String(
          quizDetails?.title ? currentQuestion : currentQuestion,
        ),
      },
      quizDetails,
    };
  }, [currentQuestion, questions, totalQuestions]);

  const persistMarks = (updated: MarkedQuestion[]) => {
    if (!testId) return;
    localStorage.setItem(
      `${MARKED_KEY_PREFIX}${testId}`,
      JSON.stringify(updated),
    );
  };

  const onJumpTo = (index: number) => {
    if (index < 1 || index > totalQuestions) return;
    setCurrentQuestion(index);
  };

  const onNext = () => {
    if (currentQuestion === totalQuestions) {
      router.push('/dashboard/test-complete');
      return;
    }
    setCurrentQuestion(prev => prev + 1);
  };

  const onPrevious = () => {
    if (currentQuestion > 1) setCurrentQuestion(prev => prev - 1);
  };

  const onToggleMarkLocalOnly = () => {
    // UI mark state (we will call backend mark inside QuizQuestionView)
    setMarkedQuestions(prev => {
      const exists = prev.some(q => q.index === currentQuestion);

      const updated = exists
        ? prev.filter(q => q.index !== currentQuestion)
        : [
            ...prev,
            {
              index: currentQuestion,
              title: questions[currentQuestion - 1]?.title ?? '',
              question: questions[currentQuestion - 1]?.question ?? '',
            },
          ];

      persistMarks(updated);
      return updated;
    });
  };

  if (!data) {
    return null; 
  }

  return (
    <QuizQuestionView
      testId={testId}
      data={data}
      markedQuestions={markedQuestions}
      onToggleMark={onToggleMarkLocalOnly}
      onJumpTo={onJumpTo}
      onNext={onNext}
      onPrevious={onPrevious}
      setQuestions={setQuestions}
      currentQuestion={currentQuestion}
    />
  );
}
