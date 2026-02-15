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
  const optionsArray = Array.isArray(q.answer_options) ? q.answer_options : [];

  return {
    id: q.id,
    title: q.question_title ?? '',
    question: q.question_statement ?? '',
    options: optionsArray.map(o => ({
      id: o.id,
      text: o.option_text ?? '',
      percentage: 0,
    })),
    userAnswerId: null,
    correctAnswerId: null,
    explanation: null,
  };
}

export default function CreateTestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params?.testId as string | undefined;

  /**
   * 1️⃣ Load session synchronously
   */
  const session = useMemo(() => {
    if (!testId) return null;

    return safeParseJSON<{
      id: string;
      total_questions: number;
      questions: Question[];
    }>(sessionStorage.getItem(`${TEST_SESSION_KEY_PREFIX}${testId}`));
  }, [testId]);

  /**
   * 2️⃣ Hooks must always run
   */
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);

  const [markedQuestions, setMarkedQuestions] = useState<MarkedQuestion[]>(
    () =>
      safeParseJSON<MarkedQuestion[]>(
        localStorage.getItem(`${MARKED_KEY_PREFIX}${testId}`),
      ) ?? [],
  );

  /**
   * 3️⃣ Derive questions safely
   */
  const questions: QuizDetailsUI[] = useMemo(() => {
    if (!session?.questions) return [];
    return session.questions.map(toQuizDetailsUI);
  }, [session]);

  const totalQuestions = questions.length;

  
  useEffect(() => {
    if (!session || totalQuestions === 0) {
      router.replace('/dashboard/user/create-test/');
    }
  }, [session, totalQuestions, router]);

  /**
   * 5️⃣ Prepare quiz data
   */
  const data: QuizQuestionDataUI | null = useMemo(() => {
    if (!questions.length) return null;

    const quizDetails = questions[currentQuestion - 1];
    if (!quizDetails) return null;

    return {
      testProgress: {
        currentQuestion,
        totalQuestions,
        questionID: quizDetails.id,
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
    if (currentQuestion >= totalQuestions) {
      router.push(`/dashboard/test-complete/${testId}`);
      return;
    }

    setCurrentQuestion(prev => prev + 1);
  };

  const onPrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const onToggleMarkLocalOnly = () => {
    setMarkedQuestions(prev => {
      const exists = prev.some(q => q.index === currentQuestion);

      const updated = exists
        ? prev.filter(q => q.index !== currentQuestion)
        : [
            ...prev,
            {
              index: currentQuestion,
              questionId: questions[currentQuestion - 1]?.id ?? '',
              title: questions[currentQuestion - 1]?.title ?? '',
              question: questions[currentQuestion - 1]?.question ?? '',
            },
          ];

      persistMarks(updated);
      return updated;
    });
  };

  if (!data) return null;

  return (
    <QuizQuestionView
      key={data.testProgress.questionID}
      testId={testId!}
      data={data}
      markedQuestions={markedQuestions}
      onToggleMark={onToggleMarkLocalOnly}
      onJumpTo={onJumpTo}
      onNext={onNext}
      onPrevious={onPrevious}
      currentQuestion={currentQuestion}
      setQuestions={() => {}}
    />
  );
}
