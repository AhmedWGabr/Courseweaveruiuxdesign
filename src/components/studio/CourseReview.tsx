import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle2, ChevronLeft, Save, BookOpen, Award } from 'lucide-react';
import { type Chapter, type TranscriptBlock } from '../../lib/mockData';

interface CourseReviewProps {
  courseData: {
    transcript: TranscriptBlock[];
    chapters: Chapter[];
    summary: string;
    keyTakeaways: string[];
    deepDive: string;
    projectTitle: string;
    projectDescription: string;
    requirements: string[];
    rubric: { criterion: string; points: number }[];
  };
  isEditMode?: boolean;
  existingCourseName?: string;
  onBack: () => void;
}

export function CourseReview({ courseData, isEditMode, existingCourseName, onBack }: CourseReviewProps) {
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState(existingCourseName || 'Advanced React Patterns');
  const [isSaving, setIsSaving] = useState(false);

  const handlePublish = () => {
    setIsSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      if (isEditMode) {
        alert('Course updated successfully!');
      } else {
        alert('Course published successfully!');
      }
      navigate('/library');
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalQuizQuestions = courseData.chapters.reduce(
    (sum, chapter) => sum + (chapter.quiz?.length || 0),
    0
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Course Name Input */}
      <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-6 mb-6">
        <label className="block">
          <span className="font-semibold block mb-2">Course Name</span>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-lg text-slate-200 focus:outline-none focus:border-indigo-600"
            placeholder="Enter course name..."
          />
        </label>
      </div>

      {/* Course Overview */}
      <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          Course Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-3xl font-bold text-indigo-400 mb-1">
              {courseData.chapters.length}
            </div>
            <div className="text-sm text-slate-400">Chapters</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-3xl font-bold text-emerald-400 mb-1">
              {totalQuizQuestions}
            </div>
            <div className="text-sm text-slate-400">Quiz Questions</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-3xl font-bold text-amber-400 mb-1">
              {courseData.transcript.length}
            </div>
            <div className="text-sm text-slate-400">Transcript Blocks</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {formatTime(courseData.chapters[courseData.chapters.length - 1]?.endTime || 0)}
            </div>
            <div className="text-sm text-slate-400">Duration</div>
          </div>
        </div>

        {/* Chapters */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Video Chapters</h4>
          <div className="space-y-2">
            {courseData.chapters.map((chapter, idx) => (
              <div key={chapter.id} className="bg-slate-900 rounded-lg p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{chapter.title}</div>
                  <div className="text-xs text-slate-400">
                    {formatTime(chapter.startTime)} - {formatTime(chapter.endTime)}
                    {chapter.quiz && (
                      <span className="ml-2 text-indigo-400">
                        • {chapter.quiz.length} quiz question{chapter.quiz.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Course Summary</h4>
          <div className="bg-slate-900 rounded-lg p-4 text-sm text-slate-300">
            {courseData.summary}
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Key Takeaways</h4>
          <div className="space-y-2">
            {courseData.keyTakeaways.map((takeaway, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">{takeaway}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Capstone Project */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Capstone Project
          </h4>
          <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
            <div className="font-semibold text-amber-400 mb-2">{courseData.projectTitle}</div>
            <div className="text-sm text-slate-300 mb-3">{courseData.projectDescription}</div>
            <div className="text-xs text-slate-400">
              {courseData.requirements.length} requirements • {courseData.rubric.length} grading criteria
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
          onClick={handlePublish}
          disabled={isSaving || !courseName}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {isEditMode ? 'Updating...' : 'Publishing...'}
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {isEditMode ? 'Update Course' : 'Publish Course'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}