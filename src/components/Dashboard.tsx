import { Link } from 'react-router';
import { Plus, TrendingUp, Clock, Award, BookOpen, Sparkles, Play } from 'lucide-react';
import { mockCourses } from '../lib/mockData';

export function Dashboard() {
  const totalCourses = mockCourses.length;
  const inProgressCourses = mockCourses.filter(c => c.status === 'In Progress').length;
  const completedCourses = mockCourses.filter(c => c.status === 'Completed').length;
  const totalHours = mockCourses.reduce((acc, course) => {
    const [hours, minutes] = course.duration.split('h ');
    return acc + parseInt(hours) + (minutes ? parseInt(minutes) / 60 : 0);
  }, 0);

  const recentActivity = [
    { course: 'Advanced React Patterns', action: 'Completed Module 2', time: '2 hours ago' },
    { course: 'Machine Learning Fundamentals', action: 'Earned Certificate', time: '1 day ago' },
    { course: 'Advanced React Patterns', action: 'Started Quiz', time: '3 days ago' },
  ];

  const lastCourse = mockCourses.find((c) => c.status === 'In Progress');

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's your learning overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{totalCourses}</div>
          <div className="text-sm text-slate-400">Total Courses</div>
        </div>

        <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{inProgressCourses}</div>
          <div className="text-sm text-slate-400">In Progress</div>
        </div>

        <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{completedCourses}</div>
          <div className="text-sm text-slate-400">Completed</div>
        </div>

        <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{Math.round(totalHours)}h</div>
          <div className="text-sm text-slate-400">Total Content</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* New Weave Card */}
        <div className="lg:col-span-1">
          <Link
            to="/studio"
            className="group bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl border-2 border-dashed border-indigo-600/50 hover:border-indigo-600 transition-all flex flex-col items-center justify-center p-8 h-full min-h-[280px]"
          >
            <div className="w-20 h-20 bg-indigo-600/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600/40 transition-colors">
              <Plus className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-indigo-300">New Weave</h3>
            <p className="text-slate-400 text-center">
              Transform a video into a structured course
            </p>
            <div className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Start Creating
            </div>
          </Link>
        </div>

        {/* Continue Learning */}
        {lastCourse && (
          <div className="lg:col-span-2">
            <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-6 h-full">
              <h3 className="text-xl font-semibold mb-4">Continue Learning</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={lastCourse.thumbnail}
                  alt={lastCourse.title}
                  className="w-full sm:w-48 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2">{lastCourse.title}</h4>
                  <p className="text-sm text-slate-400 mb-4">
                    {lastCourse.progress}% complete • {lastCourse.duration}
                  </p>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all"
                      style={{ width: `${lastCourse.progress}%` }}
                    />
                  </div>
                  <Link
                    to={`/classroom/${lastCourse.id}`}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Resume
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, idx) => (
            <div key={idx} className="flex items-start gap-4 pb-4 border-b border-slate-800 last:border-0 last:pb-0">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-200 truncate">{activity.course}</p>
                <p className="text-sm text-slate-400">{activity.action}</p>
              </div>
              <span className="text-xs text-slate-500 flex-shrink-0">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
