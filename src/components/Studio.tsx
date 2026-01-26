import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { StudioInput } from './studio/StudioInput';
import { TranscriptEditor } from './studio/TranscriptEditor';
import { QuizBuilder } from './studio/QuizBuilder';
import { NotesEditor } from './studio/NotesEditor';
import { ProjectBuilder } from './studio/ProjectBuilder';
import { CourseReview } from './studio/CourseReview';
import { type Chapter, type TranscriptBlock } from '../lib/mockData';

type Step = 'input' | 'transcript' | 'quiz' | 'notes' | 'project' | 'review';

export function Studio() {
  const [step, setStep] = useState<Step>('input');
  const [courseData, setCourseData] = useState<{
    inputType?: 'web' | 'file';
    url?: string;
    file?: File;
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

  const steps = [
    { id: 'input', label: 'Input' },
    { id: 'transcript', label: 'Transcript' },
    { id: 'quiz', label: 'Quizzes' },
    { id: 'notes', label: 'Notes' },
    { id: 'project', label: 'Project' },
    { id: 'review', label: 'Review' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  const handleInputNext = (data: { type: 'web' | 'file'; url?: string; file?: File }) => {
    setCourseData({ ...courseData, inputType: data.type, url: data.url, file: data.file });
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
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-indigo-400" />
          The Studio
        </h1>
        <p className="text-slate-400">Weave raw video into structured knowledge</p>
      </div>

      {/* Step Indicator */}
      <div className="mb-12 overflow-x-auto">
        <div className="flex items-center justify-center gap-2 md:gap-4 min-w-max px-4">
          {steps.map((s, idx) => (
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
                  {idx < currentStepIndex ? '✓' : idx + 1}
                </div>
                <span className={`mt-2 text-xs md:text-sm whitespace-nowrap ${
                  idx === currentStepIndex ? 'text-slate-200' : 'text-slate-400'
                }`}>
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-8 md:w-16 h-0.5 mx-2 ${
                  idx < currentStepIndex ? 'bg-emerald-600' : 'bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {step === 'input' && <StudioInput onNext={handleInputNext} />}
      
      {step === 'transcript' && (
        <TranscriptEditor
          onNext={handleTranscriptNext}
          onBack={() => setStep('input')}
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
          onNext={handleNotesNext}
          onBack={() => setStep('quiz')}
        />
      )}
      
      {step === 'project' && (
        <ProjectBuilder
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
          onBack={() => setStep('project')}
        />
      )}
    </div>
  );
}
