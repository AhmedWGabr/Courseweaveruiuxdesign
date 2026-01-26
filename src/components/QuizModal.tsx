import { useState } from 'react';
import { X, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { type QuizQuestion } from '../lib/mockData';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: QuizQuestion[];
  chapterTitle: string;
  onComplete: () => void;
}

export function QuizModal({ isOpen, onClose, quiz, chapterTitle, onComplete }: QuizModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  if (!isOpen) return null;

  const currentQuestion = quiz[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.length - 1;
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleNext = () => {
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }

    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleComplete = () => {
    onComplete();
    // Reset state
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectAnswers(0);
  };

  const score = Math.round(((correctAnswers + (isCorrect ? 1 : 0)) / quiz.length) * 100);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0F1115] border border-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#0F1115] border-b border-slate-800 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Chapter Quiz</h2>
            <p className="text-sm text-slate-400">{chapterTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showResult ? (
            <>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">
                    Question {currentQuestionIndex + 1} of {quiz.length}
                  </span>
                  <span className="text-sm text-slate-400">
                    {correctAnswers} correct
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / quiz.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedAnswer(idx)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedAnswer === null
                        ? 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'
                        : selectedAnswer === idx
                        ? idx === currentQuestion.correctAnswer
                          ? 'border-emerald-600 bg-emerald-900/20'
                          : 'border-red-600 bg-red-900/20'
                        : idx === currentQuestion.correctAnswer
                        ? 'border-emerald-600 bg-emerald-900/20'
                        : 'border-slate-700 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === null
                            ? 'border-slate-600'
                            : selectedAnswer === idx
                            ? idx === currentQuestion.correctAnswer
                              ? 'border-emerald-600'
                              : 'border-red-600'
                            : idx === currentQuestion.correctAnswer
                            ? 'border-emerald-600'
                            : 'border-slate-600'
                        }`}
                      >
                        {selectedAnswer !== null && idx === currentQuestion.correctAnswer && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        )}
                        {selectedAnswer === idx && idx !== currentQuestion.correctAnswer && (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <span className="flex-1">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Explanation */}
              {selectedAnswer !== null && (
                <div
                  className={`p-4 rounded-lg border mb-6 animate-slideDown ${
                    isCorrect
                      ? 'bg-emerald-900/20 border-emerald-600/30'
                      : 'bg-amber-900/20 border-amber-600/30'
                  }`}
                >
                  <p className={`font-semibold mb-2 ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isCorrect ? '✓ Correct!' : '✗ Not quite'}
                  </p>
                  <p className="text-sm text-slate-300">{currentQuestion.explanation}</p>
                </div>
              )}

              {/* Next Button */}
              {selectedAnswer !== null && (
                <button
                  onClick={handleNext}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {isLastQuestion ? 'See Results' : 'Next Question'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </>
          ) : (
            /* Results */
            <div className="text-center">
              <div
                className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center ${
                  score >= 70 ? 'bg-emerald-600' : 'bg-amber-600'
                }`}
              >
                <span className="text-5xl font-bold">{score}%</span>
              </div>
              <h3 className="text-3xl font-bold mb-2">
                {score >= 70 ? 'Excellent Work!' : 'Good Effort!'}
              </h3>
              <p className="text-slate-400 mb-8">
                You got {correctAnswers + (isCorrect ? 1 : 0)} out of {quiz.length} questions correct
              </p>
              <button
                onClick={handleComplete}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Continue Learning
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
