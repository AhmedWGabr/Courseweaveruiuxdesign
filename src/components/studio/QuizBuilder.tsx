import { useState } from 'react';
import { Plus, Trash2, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { type Chapter, type QuizQuestion } from '../../lib/mockData';

interface QuizBuilderProps {
  chapters: Chapter[];
  onNext: (data: { chaptersWithQuizzes: Chapter[] }) => void;
  onBack: () => void;
}

export function QuizBuilder({ chapters, onNext, onBack }: QuizBuilderProps) {
  const [chaptersWithQuizzes, setChaptersWithQuizzes] = useState<Chapter[]>(chapters);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });

  const selectedChapter = chaptersWithQuizzes[selectedChapterIndex];

  const handleAddQuestion = () => {
    if (newQuestion.question && newQuestion.options.every(opt => opt.trim())) {
      const updatedChapters = [...chaptersWithQuizzes];
      const quiz: QuizQuestion = {
        id: `q${Date.now()}`,
        question: newQuestion.question,
        options: newQuestion.options,
        correctAnswer: newQuestion.correctAnswer,
        explanation: newQuestion.explanation
      };

      if (!updatedChapters[selectedChapterIndex].quiz) {
        updatedChapters[selectedChapterIndex].quiz = [];
      }
      updatedChapters[selectedChapterIndex].quiz!.push(quiz);

      setChaptersWithQuizzes(updatedChapters);
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      });
      setShowQuestionForm(false);
    }
  };

  const handleDeleteQuestion = (questionId: string) => {
    const updatedChapters = [...chaptersWithQuizzes];
    if (updatedChapters[selectedChapterIndex].quiz) {
      updatedChapters[selectedChapterIndex].quiz = updatedChapters[selectedChapterIndex].quiz!.filter(
        q => q.id !== questionId
      );
      setChaptersWithQuizzes(updatedChapters);
    }
  };

  const handleAIGenerate = () => {
    alert('AI will generate quiz questions based on the chapter content!');
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h3 className="text-lg md:text-xl font-semibold">Build Chapter Quizzes</h3>
          <button
            onClick={handleAIGenerate}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI Generate Quizzes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chapter Selection */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold mb-3 text-sm text-slate-400 uppercase">Select Chapter</h4>
            <div className="space-y-2">
              {chaptersWithQuizzes.map((chapter, idx) => (
                <button
                  key={chapter.id}
                  onClick={() => setSelectedChapterIndex(idx)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedChapterIndex === idx
                      ? 'border-indigo-600 bg-indigo-600/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="font-medium text-sm mb-1">{chapter.title}</div>
                  <div className="text-xs text-slate-400">
                    {chapter.quiz?.length || 0} question{chapter.quiz?.length !== 1 ? 's' : ''}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quiz Questions */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Quiz Questions for {selectedChapter.title}</h4>
              <button
                onClick={() => setShowQuestionForm(!showQuestionForm)}
                className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>

            {showQuestionForm && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 mb-4">
                <input
                  type="text"
                  placeholder="Enter your question"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 mb-3 focus:outline-none focus:border-indigo-600"
                />

                <div className="space-y-2 mb-3">
                  {newQuestion.options.map((option, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={newQuestion.correctAnswer === idx}
                        onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: idx })}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <input
                        type="text"
                        placeholder={`Option ${idx + 1}`}
                        value={option}
                        onChange={(e) => updateOption(idx, e.target.value)}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  ))}
                </div>

                <textarea
                  placeholder="Explanation (why this answer is correct)"
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 mb-3 focus:outline-none focus:border-indigo-600"
                  rows={2}
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowQuestionForm(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddQuestion}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Add Question
                  </button>
                </div>
              </div>
            )}

            {/* Question List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {selectedChapter.quiz && selectedChapter.quiz.length > 0 ? (
                selectedChapter.quiz.map((question, idx) => (
                  <div key={question.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="text-sm font-medium mb-2">
                          {idx + 1}. {question.question}
                        </div>
                        <div className="space-y-1 mb-2">
                          {question.options.map((option, optIdx) => (
                            <div
                              key={optIdx}
                              className={`text-xs px-2 py-1 rounded ${
                                optIdx === question.correctAnswer
                                  ? 'bg-emerald-900/30 text-emerald-400'
                                  : 'text-slate-400'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}. {option}
                            </div>
                          ))}
                        </div>
                        {question.explanation && (
                          <div className="text-xs text-slate-500 italic">
                            Explanation: {question.explanation}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="text-red-400 hover:text-red-300 transition-colors ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  No quiz questions yet. Click "Add Question" to create one.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={() => onNext({ chaptersWithQuizzes })}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          Continue to Notes
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
