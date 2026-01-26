import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Play, CheckCircle2, XCircle, FileText, MessageSquare, Award, Book, Pause } from 'lucide-react';
import { mockCourses, type QuizQuestion } from '../lib/mockData';
import { QuizModal } from './QuizModal';

type Tab = 'lesson' | 'notes' | 'quiz' | 'project';

export function Classroom() {
  const { courseId } = useParams();
  const course = mockCourses.find((c) => c.id === courseId);
  const [activeTab, setActiveTab] = useState<Tab>('lesson');
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [mentorMessages, setMentorMessages] = useState<Array<{ role: 'user' | 'mentor'; text: string }>>([
    { role: 'mentor', text: 'Hello! I\'m here to help you with your capstone project. What questions do you have about the requirements?' }
  ]);
  const [mentorInput, setMentorInput] = useState('');
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentChapterQuiz, setCurrentChapterQuiz] = useState<QuizQuestion[] | null>(null);
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set());

  // Simulate video time progression
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 1;
        
        // Check if we've reached the end of a chapter
        const currentModule = course?.modules[currentModuleIndex];
        if (currentModule?.chapters) {
          const currentChapter = currentModule.chapters[currentChapterIndex];
          if (currentChapter && newTime >= currentChapter.endTime) {
            // Pause video
            setIsPlaying(false);
            
            // Show quiz if chapter has one and hasn't been completed
            if (currentChapter.quiz && !completedChapters.has(currentChapter.id)) {
              setCurrentChapterQuiz(currentChapter.quiz);
              setShowQuizModal(true);
            } else {
              // Move to next chapter if available
              if (currentChapterIndex < currentModule.chapters.length - 1) {
                setCurrentChapterIndex(currentChapterIndex + 1);
                setIsPlaying(true);
              }
            }
          }
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, currentChapterIndex, course, currentModuleIndex, completedChapters]);

  // Early returns for error cases
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Course not found</h2>
          <Link to="/" className="text-indigo-400 hover:text-indigo-300">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Check if modules exist before accessing
  if (!course.modules || course.modules.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No modules found</h2>
          <p className="text-slate-400 mb-4">This course doesn't have any modules yet.</p>
          <Link to="/" className="text-indigo-400 hover:text-indigo-300">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentModule = course.modules[currentModuleIndex];

  // If currentModule doesn't exist (invalid index), show message
  if (!currentModule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Module not found</h2>
          <p className="text-slate-400 mb-4">The requested module doesn't exist.</p>
          <Link to="/" className="text-indigo-400 hover:text-indigo-300">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const quizModule = course.modules.find(m => m.type === 'quiz');
  const currentQuiz = quizModule?.quiz?.[currentQuestionIndex];

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answerIndex });
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
  };

  const calculateQuizScore = () => {
    if (!quizModule?.quiz) return 0;
    const correct = quizModule.quiz.filter(
      (q) => quizAnswers[q.id] === q.correctAnswer
    ).length;
    return Math.round((correct / quizModule.quiz.length) * 100);
  };

  const sendMentorMessage = () => {
    if (!mentorInput.trim()) return;
    
    setMentorMessages([
      ...mentorMessages,
      { role: 'user', text: mentorInput },
      { 
        role: 'mentor', 
        text: 'That\'s a great question! Let me guide you through the requirements. Remember, the goal is to demonstrate your understanding of the concepts, not just complete the task. What specific aspect would you like to explore?' 
      }
    ]);
    setMentorInput('');
  };

  const handleChapterClick = (chapterIndex: number, startTime: number) => {
    setCurrentChapterIndex(chapterIndex);
    setCurrentTime(startTime);
    setIsPlaying(true);
  };

  const handleQuizComplete = () => {
    const currentModule = course?.modules[currentModuleIndex];
    if (currentModule?.chapters) {
      const currentChapter = currentModule.chapters[currentChapterIndex];
      if (currentChapter) {
        setCompletedChapters(prev => new Set(prev).add(currentChapter.id));
      }
    }
    
    setShowQuizModal(false);
    setCurrentChapterQuiz(null);
    
    // Move to next chapter if available
    if (currentModule?.chapters && currentChapterIndex < currentModule.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#0F1115] border-b border-slate-800 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-semibold text-sm md:text-base">{course.title}</h1>
              <p className="text-xs md:text-sm text-slate-400">
                Module {currentModuleIndex + 1} of {course.modules.length}: {currentModule.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs md:text-sm text-slate-400">
              Progress: {course.progress}%
            </div>
            <div className="w-24 md:w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Module List */}
        <aside className="w-full lg:w-80 bg-[#0F1115] border-b lg:border-b-0 lg:border-r border-slate-800 lg:h-[calc(100vh-73px)] overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase mb-3">
              Course Modules
            </h2>
            <div className="space-y-2">
              {course.modules.map((module, idx) => (
                <button
                  key={module.id}
                  onClick={() => {
                    setCurrentModuleIndex(idx);
                    if (module.type === 'video') setActiveTab('lesson');
                    if (module.type === 'quiz') setActiveTab('quiz');
                    if (module.type === 'project') setActiveTab('project');
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    currentModuleIndex === idx
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        module.completed
                          ? 'bg-emerald-600'
                          : currentModuleIndex === idx
                          ? 'bg-white/20'
                          : 'bg-slate-700'
                      }`}
                    >
                      {module.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-xs">{idx + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm mb-1 truncate">
                        {module.title}
                      </div>
                      <div className="text-xs opacity-75">
                        {module.type === 'video' && `Video • ${module.duration}`}
                        {module.type === 'quiz' && 'Knowledge Check'}
                        {module.type === 'project' && 'Capstone Project'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Tabs */}
          <div className="bg-[#0F1115] border-b border-slate-800 px-6">
            <div className="flex gap-1">
              {currentModule.type === 'video' && (
                <>
                  <button
                    onClick={() => setActiveTab('lesson')}
                    className={`px-6 py-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${
                      activeTab === 'lesson'
                        ? 'border-indigo-600 text-white'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    Lesson
                  </button>
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`px-6 py-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${
                      activeTab === 'notes'
                        ? 'border-indigo-600 text-white'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    AI Notes
                  </button>
                </>
              )}
              {currentModule.type === 'quiz' && (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="px-6 py-3 font-medium border-b-2 border-indigo-600 text-white flex items-center gap-2"
                >
                  <Book className="w-4 h-4" />
                  Knowledge Check
                </button>
              )}
              {currentModule.type === 'project' && (
                <button
                  onClick={() => setActiveTab('project')}
                  className="px-6 py-3 font-medium border-b-2 border-indigo-600 text-white flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  Capstone Project
                </button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 md:p-6">
            {/* Lesson Tab */}
            {activeTab === 'lesson' && currentModule.type === 'video' && (
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
                  {/* Video Player */}
                  <div className="lg:col-span-3">
                    {/* Video Container */}
                    <div className="bg-slate-900 rounded-xl aspect-video flex items-center justify-center mb-4 relative overflow-hidden group">
                      <Play className="w-12 h-12 md:w-20 md:h-20 text-slate-600" />
                      
                      {/* Video Controls Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                          {/* Progress Bar */}
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-white font-mono">
                              {formatTime(currentTime)}
                            </span>
                            <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden cursor-pointer">
                              <div
                                className="h-full bg-indigo-600 rounded-full transition-all"
                                style={{
                                  width: `${currentModule.chapters
                                    ? (currentTime / currentModule.chapters[currentModule.chapters.length - 1]?.endTime) * 100
                                    : 0}%`
                                }}
                              />
                            </div>
                            <span className="text-xs text-white font-mono">
                              {currentModule.chapters
                                ? formatTime(currentModule.chapters[currentModule.chapters.length - 1]?.endTime || 0)
                                : '0:00'}
                            </span>
                          </div>
                          
                          {/* Play/Pause Button */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
                            >
                              {isPlaying ? (
                                <Pause className="w-5 h-5 text-white" />
                              ) : (
                                <Play className="w-5 h-5 text-white ml-0.5" />
                              )}
                            </button>
                            <div className="text-sm text-white">
                              {currentModule.chapters?.[currentChapterIndex]?.title || 'Loading...'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Chapter Markers */}
                      {currentModule.chapters && (
                        <div className="absolute bottom-20 left-0 right-0 px-4">
                          <div className="relative h-1">
                            {currentModule.chapters.map((chapter, idx) => (
                              <div
                                key={chapter.id}
                                className="absolute w-2 h-2 bg-indigo-400 rounded-full -translate-y-0.5 cursor-pointer hover:scale-150 transition-transform"
                                style={{
                                  left: `${(chapter.startTime / currentModule.chapters![currentModule.chapters!.length - 1].endTime) * 100}%`
                                }}
                                title={chapter.title}
                                onClick={() => handleChapterClick(idx, chapter.startTime)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold mb-2">{currentModule.title}</h2>
                    <p className="text-sm md:text-base text-slate-400 mb-6">
                      Click on chapters or timestamps to navigate through the video
                    </p>

                    {/* Chapters List */}
                    {currentModule.chapters && (
                      <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-4 md:p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <Book className="w-5 h-5 text-indigo-400" />
                          Video Chapters
                        </h3>
                        <div className="space-y-2">
                          {currentModule.chapters.map((chapter, idx) => (
                            <button
                              key={chapter.id}
                              onClick={() => handleChapterClick(idx, chapter.startTime)}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                currentChapterIndex === idx
                                  ? 'border-indigo-600 bg-indigo-600/10'
                                  : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    completedChapters.has(chapter.id)
                                      ? 'bg-emerald-600'
                                      : currentChapterIndex === idx
                                      ? 'bg-indigo-600'
                                      : 'bg-slate-800'
                                  }`}
                                >
                                  {completedChapters.has(chapter.id) ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                  ) : (
                                    <span className="text-sm font-medium">{idx + 1}</span>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium mb-1">{chapter.title}</div>
                                  <div className="text-sm text-slate-400 flex items-center gap-3">
                                    <span>{formatTime(chapter.startTime)}</span>
                                    <span>•</span>
                                    <span>{formatTime(chapter.endTime - chapter.startTime)} duration</span>
                                    {chapter.quiz && (
                                      <>
                                        <span>•</span>
                                        <span className="text-indigo-400">Quiz included</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Transcript & Notes Sidebar */}
                  <div className="lg:col-span-1">
                    <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-4 max-h-[600px] overflow-y-auto sticky top-4">
                      <h3 className="font-semibold mb-4 text-sm text-slate-400 uppercase">
                        Interactive Transcript
                      </h3>
                      <div className="space-y-3">
                        {currentModule.transcript?.map((block) => (
                          <button
                            key={block.id}
                            onClick={() => setCurrentTime(block.time)}
                            className={`w-full text-left p-3 rounded-lg hover:bg-slate-800/50 transition-colors border-l-2 ${
                              currentTime >= block.time && currentTime < (block.time + 15)
                                ? 'border-indigo-600 bg-slate-800/30'
                                : 'border-slate-700'
                            }`}
                          >
                            <div className="text-xs text-indigo-400 font-mono mb-1">
                              {block.timestamp}
                            </div>
                            <p className="text-xs md:text-sm text-slate-300">{block.text}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Core Concepts */}
                    <div className="mt-4 bg-amber-900/20 border border-amber-600/50 rounded-xl p-4">
                      <h4 className="font-semibold text-amber-400 text-sm mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Core Concepts
                      </h4>
                      <ul className="space-y-1 text-xs md:text-sm text-slate-300">
                        <li>• Compound Component Pattern</li>
                        <li>• Context API for State Sharing</li>
                        <li>• Implicit vs Explicit Props</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quiz Modal */}
            {showQuizModal && currentChapterQuiz && currentModule.chapters && (
              <QuizModal
                isOpen={showQuizModal}
                onClose={() => setShowQuizModal(false)}
                quiz={currentChapterQuiz}
                chapterTitle={currentModule.chapters[currentChapterIndex].title}
                onComplete={handleQuizComplete}
              />
            )}

            {/* AI Notes Tab */}
            {activeTab === 'notes' && currentModule.type === 'video' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">AI-Generated Notes</h2>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm">
                      Save to PDF
                    </button>
                  </div>

                  {/* TL;DR */}
                  <div className="mb-8 p-4 bg-indigo-900/20 border border-indigo-600/30 rounded-lg">
                    <h3 className="font-semibold text-indigo-400 mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      TL;DR
                    </h3>
                    <p className="text-slate-300">
                      This module introduces compound components, a powerful React pattern that enables flexible component composition by allowing parent and child components to share state implicitly through Context API.
                    </p>
                  </div>

                  {/* Key Takeaways */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Key Takeaways</h3>
                    <ul className="space-y-3">
                      {[
                        'Compound components create flexible, composable APIs similar to native HTML elements',
                        'Context API enables implicit state sharing between parent and child components',
                        'This pattern reduces prop drilling and makes components more maintainable',
                        'Real-world examples include Select/Option, Tabs, and Accordion components'
                      ].map((takeaway, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-300">{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Deep Dive */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Deep Dive</h3>
                    <div className="space-y-4 text-slate-300 leading-relaxed">
                      <p>
                        {currentModule.summary}
                      </p>
                      <p>
                        The compound component pattern leverages React's Context API to create a parent component that manages state and provides it to child components without explicit prop passing. This approach offers several advantages over traditional component composition.
                      </p>
                      <p>
                        By using this pattern, developers can create components that feel natural to use, similar to how native HTML elements work together. The parent component acts as a container that orchestrates behavior, while child components handle their own rendering logic while accessing shared state.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quiz Tab */}
            {activeTab === 'quiz' && currentModule.type === 'quiz' && (
              <div className="max-w-3xl mx-auto">
                {!quizSubmitted ? (
                  <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-8">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">
                          Question {currentQuestionIndex + 1} of {quizModule?.quiz?.length || 0}
                        </span>
                        <span className="text-sm text-slate-400">
                          {Object.keys(quizAnswers).length} answered
                        </span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all"
                          style={{
                            width: `${((currentQuestionIndex + 1) / (quizModule?.quiz?.length || 1)) * 100}%`
                          }}
                        />
                      </div>
                    </div>

                    {currentQuiz && (
                      <>
                        <h3 className="text-2xl font-semibold mb-6">
                          {currentQuiz.question}
                        </h3>

                        <div className="space-y-3 mb-8">
                          {currentQuiz.options.map((option, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleQuizAnswer(currentQuiz.id, idx)}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                quizAnswers[currentQuiz.id] === idx
                                  ? 'border-indigo-600 bg-indigo-600/10'
                                  : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    quizAnswers[currentQuiz.id] === idx
                                      ? 'border-indigo-600'
                                      : 'border-slate-600'
                                  }`}
                                >
                                  {quizAnswers[currentQuiz.id] === idx && (
                                    <div className="w-3 h-3 rounded-full bg-indigo-600" />
                                  )}
                                </div>
                                <span>{option}</span>
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="flex gap-4">
                          {currentQuestionIndex > 0 && (
                            <button
                              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                            >
                              Previous
                            </button>
                          )}
                          {currentQuestionIndex < (quizModule?.quiz?.length || 0) - 1 ? (
                            <button
                              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                              className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                            >
                              Next Question
                            </button>
                          ) : (
                            <button
                              onClick={submitQuiz}
                              disabled={Object.keys(quizAnswers).length !== quizModule?.quiz?.length}
                              className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
                            >
                              Submit Quiz
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-8">
                    <div className="text-center mb-8">
                      <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
                        calculateQuizScore() >= 70 ? 'bg-emerald-600' : 'bg-amber-600'
                      }`}>
                        <span className="text-4xl font-bold">{calculateQuizScore()}%</span>
                      </div>
                      <h2 className="text-3xl font-bold mb-2">
                        {calculateQuizScore() >= 70 ? 'Great Job!' : 'Keep Learning!'}
                      </h2>
                      <p className="text-slate-400">
                        You scored {calculateQuizScore()}% on this quiz
                      </p>
                    </div>

                    {/* Answer Review */}
                    <div className="space-y-4">
                      {quizModule?.quiz?.map((question, idx) => {
                        const userAnswer = quizAnswers[question.id];
                        const isCorrect = userAnswer === question.correctAnswer;

                        return (
                          <div
                            key={question.id}
                            className={`p-4 rounded-lg border-2 ${
                              isCorrect
                                ? 'border-emerald-600 bg-emerald-900/20'
                                : 'border-red-600 bg-red-900/20'
                            }`}
                          >
                            <div className="flex items-start gap-3 mb-3">
                              {isCorrect ? (
                                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                              ) : (
                                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                              )}
                              <div className="flex-1">
                                <p className="font-medium mb-2">{question.question}</p>
                                <p className="text-sm text-slate-400 mb-2">
                                  Your answer: {question.options[userAnswer]}
                                </p>
                                {!isCorrect && (
                                  <p className="text-sm text-emerald-400 mb-2">
                                    Correct answer: {question.options[question.correctAnswer]}
                                  </p>
                                )}
                                <p className="text-sm text-slate-300">{question.explanation}</p>
                              </div>
                            </div>
                            {!isCorrect && question.videoTimestamp !== undefined && (
                              <button className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-2">
                                <Play className="w-4 h-4" />
                                Review this topic in the video
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                        setCurrentQuestionIndex(0);
                      }}
                      className="w-full mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                      Retake Quiz
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Project Tab */}
            {activeTab === 'project' && currentModule.type === 'project' && currentModule.project && (
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                  {/* Project Brief */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-4 md:p-6 h-full">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl md:text-2xl font-bold">{currentModule.project.title}</h2>
                          <p className="text-sm text-amber-400">Capstone Project</p>
                        </div>
                      </div>
                      <p className="text-sm md:text-base text-slate-300 mb-6">
                        {currentModule.project.description}
                      </p>

                      <h3 className="font-semibold mb-3 text-sm md:text-base">Requirements</h3>
                      <ul className="space-y-2 mb-6">
                        {currentModule.project.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-5 h-5 border-2 border-slate-600 rounded mt-0.5 flex-shrink-0" />
                            <span className="text-sm md:text-base text-slate-300">{req}</span>
                          </li>
                        ))}
                      </ul>

                      <h3 className="font-semibold mb-3 text-sm md:text-base">Grading Rubric</h3>
                      <div className="space-y-2">
                        {currentModule.project.rubric.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                            <span className="text-sm md:text-base text-slate-300 flex-1">{item.criterion}</span>
                            <span className="text-indigo-400 font-medium text-sm md:text-base ml-2">{item.points} pts</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Mentor */}
                  <div className="lg:col-span-1">
                    <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-4 h-[500px] lg:h-[700px] flex flex-col">
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
                        <MessageSquare className="w-5 h-5 text-indigo-400" />
                        <h3 className="font-semibold text-sm md:text-base">AI Mentor</h3>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                        {mentorMessages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                msg.role === 'user'
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-800 text-slate-200'
                              }`}
                            >
                              <p className="text-xs md:text-sm">{msg.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={mentorInput}
                          onChange={(e) => setMentorInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMentorMessage()}
                          placeholder="Ask about requirements..."
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-600"
                        />
                        <button
                          onClick={sendMentorMessage}
                          className="px-3 md:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm"
                        >
                          Send
                        </button>
                      </div>

                      <p className="text-xs text-slate-500 mt-2">
                        AI Mentor is context-aware and won't write code for you
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}