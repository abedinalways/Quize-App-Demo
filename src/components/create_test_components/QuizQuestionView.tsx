'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

import QuizTopbar from './QuizTopbar';
import QuestionSidebar from './QuestionSidebar';
import QuestionCard from './QuestionCard';
import ExplanationPanel from './ExplanationPanel';

import type {
  MarkedQuestion,
  QuizDetailsUI,
  QuizQuestionDataUI,
} from '@/types/test-session';
import {
  useAnswerQuestionMutation,
  useLazyGetTestResultQuery,
  useSkipQuestionMutation,
  useToggleMarkMutation,
} from '@/app/redux/api/testSessionApi';

interface QuizQuestionViewProps {
  testId: string;
  data: QuizQuestionDataUI;
  markedQuestions: MarkedQuestion[];
  onToggleMark: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onJumpTo?: (index: number) => void;

  // for updating current question data after result fetch
  setQuestions: React.Dispatch<React.SetStateAction<QuizDetailsUI[]>>;
  currentQuestion: number;
}

export const QuizQuestionView: React.FC<QuizQuestionViewProps> = ({
  testId,
  data,
  markedQuestions,
  onToggleMark,
  onNext,
  onPrevious,
  onJumpTo,
  setQuestions,
  currentQuestion,
}) => {
  const { testProgress, quizDetails } = data;
  const { totalQuestions, questionID } = testProgress;

  const [selectedAnswerId, setSelectedAnswer] = useState<string | null>(
    () => quizDetails.userAnswerId ?? null,
  );

  const [showExplanation, setShowExplanation] = useState(false);
  const [isQuestionHidden, setIsQuestionHidden] = useState(false);

  const questionRef = useRef<HTMLDivElement>(null);
  const explanationRef = useRef<HTMLDivElement>(null);

  const [answerQuestion] = useAnswerQuestionMutation();
  const [toggleMarkApi] = useToggleMarkMutation();
  const [skipQuestionApi] = useSkipQuestionMutation();
  const [getResultTrigger] = useLazyGetTestResultQuery();

  // reset UI when question changes
  useEffect(() => {
    setShowExplanation(false);
    setIsQuestionHidden(false);

    if (questionRef.current && explanationRef.current) {
      gsap.set(questionRef.current, { flex: '1 1 0%', opacity: 1 });
      gsap.set(explanationRef.current, { flex: '1 1 0%' });
    }
  }, [currentQuestion]);

  // sync selected answer when question or backend data changes
  useEffect(() => {
    setSelectedAnswer(quizDetails.userAnswerId ?? null);
  }, [currentQuestion, quizDetails.userAnswerId]);

  const progressValue = (currentQuestion / totalQuestions) * 100;
  const isMarked = markedQuestions.some(q => q.index === currentQuestion);

  const handleAnswerChange = (value: string) => setSelectedAnswer(value);

  const handleSubmit = async () => {
    if (!selectedAnswerId) return;

    // 1) submit answer
    await answerQuestion({
      test_id: testId,
      question_id: questionID,
      answer_option_id: selectedAnswerId,
    }).unwrap();

    // 2) try fetch result (only if backend supports)
    try {
      const res = await getResultTrigger({
        test_id: testId,
        question_id: questionID,
      }).unwrap();

      setQuestions(prev => {
        const copy = [...prev];
        const idx = currentQuestion - 1;
        const existing = copy[idx];
        if (!existing) return prev;

        const percentages = res.data.answer_percentages ?? {};

        copy[idx] = {
          ...existing,
          userAnswerId: res.data.user_answer_id,
          correctAnswerId: res.data.correct_answer_id,
          explanation: res.data.explanation,
          options: existing.options.map(o => ({
            ...o,
            percentage:
              typeof percentages[o.id] === 'number'
                ? percentages[o.id]
                : (o.percentage ?? 0),
          })),
        };

        return copy;
      });

      setShowExplanation(true);
      setIsQuestionHidden(false);
    } catch {
      // If no result endpoint or fails, still show explanation panel = false
      // because we don't have correct answer/explanation from backend
      setShowExplanation(false);
    }
  };

  const handleToggleMark = async () => {
    // update local UI mark (no design change)
    onToggleMark();

    // sync backend mark state
    await toggleMarkApi({
      test_id: testId,
      question_id: questionID,
      is_marked: !isMarked,
    }).unwrap();
  };

  const handleNext = async () => {
    // If user didn't answer, consider it skipped
    if (!selectedAnswerId) {
      try {
        await skipQuestionApi({
          test_id: testId,
          question_id: questionID,
        }).unwrap();
      } catch {
        // silent fail
      }
    }
    onNext();
  };

  const handlePrevious = () => {
    onPrevious();
  };

  const handleToggleHide = () => {
    if (!showExplanation) return;

    const qEl = questionRef.current;
    const eEl = explanationRef.current;
    if (!qEl || !eEl) return;

    if (!isQuestionHidden) {
      gsap.to(qEl, {
        flex: '0 0 0%',
        opacity: 0,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => setIsQuestionHidden(true),
      });

      gsap.to(eEl, {
        flex: '1 1 100%',
        duration: 0.45,
        ease: 'power2.inOut',
      });
    } else {
      setIsQuestionHidden(false);

      gsap.to(qEl, {
        flex: '1 1 0%',
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      });

      gsap.to(eEl, {
        flex: '1 1 0%',
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  };

  // zoom
  const [zoomLevel, setZoomLevel] = useState(1);
  const MIN_ZOOM = 0.8;
  const MAX_ZOOM = 1.4;
  const STEP = 0.1;

  const handleZoomIn = () => setZoomLevel(z => Math.min(z + STEP, MAX_ZOOM));
  const handleZoomOut = () => setZoomLevel(z => Math.max(z - STEP, MIN_ZOOM));

  const isUserCorrect =
    quizDetails.correctAnswerId !== null && // Ensure correctAnswerId is not null
    selectedAnswerId !== null && // Ensure selectedAnswerId is not null
    selectedAnswerId === quizDetails.correctAnswerId; // Then compare the values

  return (
    <div className="flex flex-col space-y-4 font-[manrope]">
      <QuizTopbar
        progressValue={progressValue}
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        questionID={questionID}
        isMarked={isMarked}
        onToggleMark={handleToggleMark}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />

      <div className="background rounded-md grid grid-cols-1 md:grid-cols-12 ">
        <QuestionSidebar
          totalQuestions={totalQuestions}
          currentQuestion={currentQuestion}
          markedQuestions={markedQuestions}
          onJumpTo={onJumpTo}
        />

        <div className="col-span-11 mx-4 min-w-0">
          <div className="w-full overflow-auto">
            <div
              className="flex flex-col md:flex-row gap-6 min-w-0"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                transition: 'transform 0.2s ease',
              }}
            >
              <div
                ref={questionRef}
                className={`flex-1 min-w-0 overflow-hidden ${
                  isQuestionHidden ? 'pointer-events-none' : ''
                }`}
                style={{
                  flex: isQuestionHidden ? '0 0 0%' : '1 1 0%',
                  opacity: isQuestionHidden ? 0 : 1,
                }}
              >
                <QuestionCard
                  quizDetails={quizDetails}
                  selectedAnswerId={selectedAnswerId}
                  showExplanation={showExplanation}
                  isUserCorrect={isUserCorrect}
                  onAnswerChange={handleAnswerChange}
                  onSubmit={handleSubmit}
                  onToggleHide={handleToggleHide}
                  isQuestionHidden={isQuestionHidden}
                />
              </div>

              {showExplanation && quizDetails.explanation && (
                <div
                  ref={explanationRef}
                  className="min-w-0"
                  style={{
                    flex: isQuestionHidden ? '1 1 100%' : '1 1 0%',
                  }}
                >
                  <ExplanationPanel
                    quizDetails={{ explanation: quizDetails.explanation }}
                    isQuestionHidden={isQuestionHidden}
                    onShowQuestion={handleToggleHide}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestionView;
