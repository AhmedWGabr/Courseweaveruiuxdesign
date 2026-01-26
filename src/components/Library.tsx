import { Link } from 'react-router';
import { Play, Pause, CheckCircle2, Clock } from 'lucide-react';
import { mockCourses } from '../lib/mockData';

export function Library() {
  const lastCourse = mockCourses.find((c) => c.status === 'In Progress');

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Library</h1>
        <p className="text-slate-400">All your courses in one place</p>
      </div>

      {/* Quick Actions */}
      {lastCourse && (
        <div className="mb-8">
          <Link
            to={`/classroom/${lastCourse.id}`}
            className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 md:px-6 py-3 md:py-4 rounded-xl transition-colors font-medium text-sm md:text-base"
          >
            <Play className="w-4 h-4 md:w-5 md:h-5" />
            Resume: {lastCourse.title}
          </Link>
        </div>
      )}

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {mockCourses.map((course) => (
          <Link
            key={course.id}
            to={`/classroom/${course.id}`}
            className="group bg-[#0F1115] rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-600 transition-all"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {course.duration}
                </span>
                {course.status === 'In Progress' && (
                  <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">
                    In Progress
                  </span>
                )}
                {course.status === 'Completed' && (
                  <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Completed
                  </span>
                )}
                {course.status === 'Paused' && (
                  <span className="text-xs bg-amber-600 text-white px-2 py-1 rounded flex items-center gap-1">
                    <Pause className="w-3 h-3" />
                    Paused
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-base md:text-lg mb-3 group-hover:text-indigo-400 transition-colors">
                {course.title}
              </h3>

              {/* Progress Thread */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-slate-300 font-medium">{course.progress}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}