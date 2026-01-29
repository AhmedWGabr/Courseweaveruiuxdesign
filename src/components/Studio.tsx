import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Sparkles, Edit2 } from 'lucide-react';
import { StudioInput } from './studio/StudioInput';
import { TranscriptEditor } from './studio/TranscriptEditor';
import { QuizBuilder } from './studio/QuizBuilder';
import { NotesEditor } from './studio/NotesEditor';
import { ProjectBuilder } from './studio/ProjectBuilder';
import { CourseReview } from './studio/CourseReview';
import { type Chapter, type TranscriptBlock, mockCourses } from '../lib/mockData';

type Step = 'input' | 'transcript' | 'quiz' | 'notes' | 'project' | 'review';

interface ModuleStructure {
  name: string;
  videos: {
    name: string;
    path: string;
    type: 'video' | 'transcript';
    extension: string;
    size?: number;
    transcriptFile?: string;
  }[];
}

export function Studio() {
  const [searchParams] = useSearchParams();
  const editCourseId = searchParams.get('edit');
  const isEditMode = !!editCourseId;

  const [step, setStep] = useState<Step>('input');
  const [courseData, setCourseData] = useState<{
    courseId?: string;
    courseName?: string;
    inputType?: 'web' | 'file' | 'folder';
    url?: string;
    file?: File;
    modules?: ModuleStructure[];
    transcript?: TranscriptBlock[];
    chapters?: Chapter[];
    summary?: string;
    keyTakeaways?: string[];
    deepDive?: string;
    projectTitle?: string;
    projectDescription?: string;
    requirements?: string[];
    rubric?: { criterion: string; points: number }[];
  }>({});

  // Load existing course data when editing
  useEffect(() => {
    if (isEditMode && editCourseId) {
      const existingCourse = mockCourses.find(c => c.id === editCourseId);
      
      if (existingCourse) {
        // Load course data from existing course
        // In a real app, this would fetch from a database/API
        setCourseData({
          courseId: existingCourse.id,
          courseName: existingCourse.title,
          inputType: 'web',
          url: 'https://youtube.com/watch?v=existing',
          transcript: [
            {
              id: 't1',
              timestamp: '00:00',
              speaker: 'Instructor',
              text: 'Welcome to Advanced React Patterns. Today we\'ll explore compound components.',
              time: 0
            },
            {
              id: 't2',
              timestamp: '00:15',
              speaker: 'Instructor',
              text: 'Compound components allow you to create flexible, reusable component APIs.',
              time: 15
            },
            {
              id: 't3',
              timestamp: '08:00',
              speaker: 'Instructor',
              text: 'Now let\'s dive into the Context API and how it enables this pattern.',
              time: 480
            },
            {
              id: 't4',
              timestamp: '16:00',
              speaker: 'Instructor',
              text: 'Let\'s look at some real-world examples of compound components in action.',
              time: 960
            },
          ],
          chapters: [
            {
              id: 'c1',
              title: 'Introduction to Compound Components',
              startTime: 0,
              endTime: 480,
              quiz: [
                {
                  id: 'q1',
                  question: 'What is the main benefit of compound components?',
                  options: [
                    'Better performance',
                    'Flexible component APIs',
                    'Smaller bundle size',
                    'Easier styling'
                  ],
                  correctAnswer: 1,
                  explanation: 'Compound components create flexible, composable APIs that allow components to work together.'
                }
              ]
            },
            {
              id: 'c2',
              title: 'Understanding Context API',
              startTime: 480,
              endTime: 960,
              quiz: [
                {
                  id: 'q2',
                  question: 'What does the Context API provide?',
                  options: [
                    'State management',
                    'Routing',
                    'HTTP requests',
                    'Styling'
                  ],
                  correctAnswer: 0,
                  explanation: 'Context API provides a way to share state between components without prop drilling.'
                }
              ]
            },
            {
              id: 'c3',
              title: 'Real-world Examples',
              startTime: 960,
              endTime: 1440
            }
          ],
          summary: 'This module introduces compound components, a powerful React pattern that enables flexible component composition by allowing parent and child components to share state implicitly through Context API.',
          keyTakeaways: [
            'Compound components create flexible, composable APIs similar to native HTML elements',
            'Context API enables implicit state sharing between parent and child components',
            'This pattern reduces prop drilling and makes components more maintainable',
            'Real-world examples include Select/Option, Tabs, and Accordion components'
          ],
          deepDive: 'The compound component pattern leverages React\'s Context API to create a parent component that manages state and provides it to child components without explicit prop passing. This approach offers several advantages over traditional component composition.\n\nBy using this pattern, developers can create components that feel natural to use, similar to how native HTML elements work together. The parent component acts as a container that orchestrates behavior, while child components handle their own rendering logic while accessing shared state.',
          projectTitle: 'Build a Reusable Data Table Component',
          projectDescription: 'Create a flexible, accessible data table component using compound component patterns. This capstone project will test your understanding of React patterns and component architecture.',
          requirements: [
            'Use compound component pattern',
            'Support sorting and filtering',
            'Implement keyboard navigation',
            'Add loading and error states',
            'Include comprehensive TypeScript types'
          ],
          rubric: [
            { criterion: 'Correct implementation of compound components', points: 30 },
            { criterion: 'Accessibility features', points: 25 },
            { criterion: 'Code quality and TypeScript usage', points: 25 },
            { criterion: 'Testing and documentation', points: 20 }
          ]
        });

        // Skip input step when editing
        setStep('transcript');
      }
    }
  }, [isEditMode, editCourseId]);

  const steps = [
    { id: 'input', label: 'Input' },
    { id: 'transcript', label: 'Transcript' },
    { id: 'quiz', label: 'Quizzes' },
    { id: 'notes', label: 'Notes' },
    { id: 'project', label: 'Project' },
    { id: 'review', label: 'Review' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  const handleInputNext = (data: { 
    type: 'web' | 'file' | 'folder'; 
    url?: string; 
    file?: File;
    modules?: ModuleStructure[];
  }) => {
    setCourseData({ ...courseData, inputType: data.type, url: data.url, file: data.file, modules: data.modules });
    
    // If folder was selected, show a processing message
    if (data.type === 'folder' && data.modules) {
      alert(`Processing ${data.modules.length} module(s) with ${data.modules.reduce((sum, m) => sum + m.videos.length, 0)} video(s)...`);
    }
    
    setStep('transcript');
  };

  const handleTranscriptNext = (data: { transcript: TranscriptBlock[]; chapters: Chapter[] }) => {
    setCourseData({ ...courseData, transcript: data.transcript, chapters: data.chapters });
    setStep('quiz');
  };

  const handleQuizNext = (data: { chaptersWithQuizzes: Chapter[] }) => {
    setCourseData({ ...courseData, chapters: data.chaptersWithQuizzes });
    setStep('notes');
  };

  const handleNotesNext = (data: { summary: string; keyTakeaways: string[]; deepDive: string }) => {
    setCourseData({ ...courseData, ...data });
    setStep('project');
  };

  const handleProjectNext = (data: {
    projectTitle: string;
    projectDescription: string;
    requirements: string[];
    rubric: { criterion: string; points: number }[];
  }) => {
    setCourseData({ ...courseData, ...data });
    setStep('review');
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2 sm:gap-3">
          {isEditMode ? (
            <>
              <Edit2 className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-amber-400" />
              <span className="truncate">Edit Course</span>
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-indigo-400" />
              <span>The Studio</span>
            </>
          )}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-400 truncate">
          {isEditMode 
            ? `Editing: ${courseData.courseName || 'Loading...'}`
            : courseData.inputType === 'folder' 
              ? `Weave ${courseData.modules?.length || 0} modules into structured knowledge`
              : 'Weave raw video into structured knowledge'}
        </p>
      </div>

      {/* Edit Mode Banner */}
      {isEditMode && (
        <div className="max-w-3xl mx-auto mb-6 bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Edit2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-semibold text-amber-300">
                Edit Mode
              </div>
              <div className="text-sm text-slate-400">
                You're editing an existing course. All changes will update the current course.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step Indicator */}
      <div className="mb-12 overflow-x-auto">
        <div className="flex items-center justify-center gap-2 md:gap-4 min-w-max px-4">
          {steps.map((s, idx) => {
            // Skip input step in edit mode
            if (isEditMode && s.id === 'input') return null;
            
            return (
              <div key={s.id} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      idx < currentStepIndex
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : idx === currentStepIndex
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-700 text-slate-500'
                    }`}
                  >
                    {idx < currentStepIndex ? '✓' : isEditMode ? idx : idx + 1}
                  </div>
                  <span className={`mt-2 text-xs md:text-sm whitespace-nowrap ${
                    idx === currentStepIndex ? 'text-slate-200' : 'text-slate-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (!isEditMode || s.id !== 'input') && (
                  <div className={`w-8 md:w-16 h-0.5 mx-2 ${
                    idx < currentStepIndex ? 'bg-emerald-600' : 'bg-slate-700'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Folder Info Banner */}
      {courseData.inputType === 'folder' && courseData.modules && !isEditMode && (
        <div className="max-w-3xl mx-auto mb-6 bg-indigo-900/20 border border-indigo-600/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-semibold text-indigo-300">
                Processing {courseData.modules.length} module{courseData.modules.length !== 1 ? 's' : ''}
              </div>
              <div className="text-sm text-slate-400">
                {courseData.modules.reduce((sum, m) => sum + m.videos.length, 0)} videos detected from folder structure
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      {step === 'input' && !isEditMode && <StudioInput onNext={handleInputNext} />}
      
      {step === 'transcript' && courseData.transcript && (
        <TranscriptEditor
          initialTranscript={courseData.transcript}
          initialChapters={courseData.chapters || []}
          onNext={handleTranscriptNext}
          onBack={() => isEditMode ? null : setStep('input')}
        />
      )}
      
      {step === 'quiz' && courseData.chapters && (
        <QuizBuilder
          chapters={courseData.chapters}
          onNext={handleQuizNext}
          onBack={() => setStep('transcript')}
        />
      )}
      
      {step === 'notes' && (
        <NotesEditor
          initialSummary={courseData.summary}
          initialKeyTakeaways={courseData.keyTakeaways}
          initialDeepDive={courseData.deepDive}
          onNext={handleNotesNext}
          onBack={() => setStep('quiz')}
        />
      )}
      
      {step === 'project' && (
        <ProjectBuilder
          initialProjectTitle={courseData.projectTitle}
          initialProjectDescription={courseData.projectDescription}
          initialRequirements={courseData.requirements}
          initialRubric={courseData.rubric}
          onNext={handleProjectNext}
          onBack={() => setStep('notes')}
        />
      )}
      
      {step === 'review' && courseData.transcript && courseData.chapters && (
        <CourseReview
          courseData={{
            transcript: courseData.transcript,
            chapters: courseData.chapters,
            summary: courseData.summary || '',
            keyTakeaways: courseData.keyTakeaways || [],
            deepDive: courseData.deepDive || '',
            projectTitle: courseData.projectTitle || '',
            projectDescription: courseData.projectDescription || '',
            requirements: courseData.requirements || [],
            rubric: courseData.rubric || []
          }}
          isEditMode={isEditMode}
          existingCourseName={courseData.courseName}
          onBack={() => setStep('project')}
        />
      )}
    </div>
  );
}