import { useState, useEffect, useRef } from 'react';

export interface QuizQuestion {
  id: string;
  type: string;
  question: string;
  options: string[];
  correctAnswer: string;
  timeLimit: number;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
  timeTaken: number;
}

export const useGamifiedQuiz = (questions: QuizQuestion[], title?: string) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifiedScore, setVerifiedScore] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentIndex];
  const isFinished = currentIndex >= questions.length;

  useEffect(() => {
    if (isFinished || isSubmitting) return;

    setTimeLeft(15);
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isFinished, isSubmitting]);

  const handleTimeout = () => {
    handleAnswer('', 15); // Empty string for selected answer to indicate timeout
  };

  const handleAnswer = (selectedAnswer: string, timeTaken: number = 15 - timeLeft) => {
    if (timerRef.current) clearInterval(timerRef.current);

    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion?.id || `q-${currentIndex}`,
        selectedAnswer,
        timeTaken,
      },
    ]);

    // Update streak optimistically on frontend (backend verifies truth)
    const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak >= 2) {
        try {
          new Audio('/streak.mp3').play().catch(() => {});
        } catch(e) {}
      }
    } else {
      setStreak(0);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(questions.length); // Trigger isFinished = true immediately!
    }
  };

  useEffect(() => {
    if (isFinished && !isSubmitting && verifiedScore === null) {
      const finishAndSubmit = async () => {
        setIsSubmitting(true);

        // Calculate fallback score and stats
        let calculatedScore = 0;
        let correctCount = 0;
        let wrongCount = 0;
        const questionMap = new Map(questions.map((q) => [q.id, q]));
        userAnswers.forEach((ans) => {
          const q = questionMap.get(ans.questionId);
          if (q && q.correctAnswer === ans.selectedAnswer) {
            calculatedScore += 10;
            correctCount++;
          } else {
            wrongCount++;
          }
        });

        const localId = 'local-' + Date.now();
        try {
          const existingHistoryStr = localStorage.getItem('my_quiz_history');
          const existingHistory = existingHistoryStr ? JSON.parse(existingHistoryStr) : [];
          const newEntry = {
            id: localId,
            title: title || 'Gamified Chapter Quiz',
            score: calculatedScore,
            correctCount,
            wrongCount,
            totalQuestions: questions.length,
            createdAt: new Date().toISOString(),
            questions,
            userAnswers,
          };
          localStorage.setItem('my_quiz_history', JSON.stringify([newEntry, ...existingHistory]));
        } catch (e) {
          console.error('Failed to save local history', e);
        }

        try {
          const tokenStr = localStorage.getItem('auth-storage');
          const token = tokenStr ? JSON.parse(tokenStr)?.state?.token : null;
          const headers: any = {
            'Content-Type': 'application/json',
          };
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
          
          const res = await fetch('http://localhost:4001/api/v1/quiz/validate-score', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              title: title || 'Gamified Chapter Quiz',
              originalQuestions: questions,
              answers: userAnswers,
            }),
          });
          const data = await res.json();
          if (data.success) {
            setVerifiedScore(data.verifiedScore);
            try {
              const existingHistoryStr = localStorage.getItem('my_quiz_history');
              if (existingHistoryStr) {
                const history = JSON.parse(existingHistoryStr);
                const updated = history.map((item: any) =>
                  item.id === localId ? { ...item, score: data.verifiedScore } : item
                );
                localStorage.setItem('my_quiz_history', JSON.stringify(updated));
              }
            } catch (e) {}
          }
        } catch (err) {
          // If fetch fails or backend offline, gracefully proceed to local result screen
        } finally {
          setIsSubmitting(false);
        }
      };
      finishAndSubmit();
    }
  }, [isFinished, questions, title]);

  const resetQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentIndex(0);
    setStreak(0);
    setTimeLeft(15);
    setUserAnswers([]);
    setIsSubmitting(false);
    setVerifiedScore(null);
  };

  return {
    currentIndex,
    currentQuestion,
    streak,
    timeLeft,
    userAnswers,
    isSubmitting,
    isFinished,
    verifiedScore,
    handleAnswer,
    resetQuiz,
  };
};

