import { Link } from 'react-router';
import { Plus, TrendingUp, Clock, Award, BookOpen, Sparkles, Play, CheckCircle2, MessageSquare, Library, Settings } from 'lucide-react';
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

  const stats = {
    coursesInProgress: inProgressCourses,
    coursesCompleted: completedCourses,
    totalHours: Math.round(totalHours),
    streak: 5, // Example streak value
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8 lg:p-10">
      {/* Welcome Section */}
      <div className="mb-6 sm:mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Welcome back!</h1>
        <p className="text-sm sm:text-base text-slate-400">Continue your learning journey</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12">
        <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-3 sm:p-4 md:p-6">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-400 mb-1 md:mb-2">{stats.coursesInProgress}</div>
          <div className="text-xs md:text-sm text-slate-400">In Progress</div>
        </div>
        <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-3 sm:p-4 md:p-6">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-400 mb-1 md:mb-2">{stats.coursesCompleted}</div>
          <div className="text-xs md:text-sm text-slate-400">Completed</div>
        </div>
        <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-3 sm:p-4 md:p-6">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-400 mb-1 md:mb-2">{stats.totalHours}h</div>
          <div className="text-xs md:text-sm text-slate-400">Learning Time</div>
        </div>
        <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-3 sm:p-4 md:p-6">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-400 mb-1 md:mb-2">{stats.streak} days</div>
          <div className="text-xs md:text-sm text-slate-400">Current Streak</div>
        </div>
      </div>

      {/* Continue Learning */}
      {inProgressCourses.length > 0 && (
        <div className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Continue Learning</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {inProgressCourses.map((course) => (
              <Link
                key={course.id}
                to={`/classroom/${course.id}`}
                className="group bg-[#0F1115] border border-slate-800 hover:border-indigo-600 rounded-xl overflow-hidden transition-all"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative sm:w-48 aspect-video sm:aspect-auto overflow-hidden flex-shrink-0">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 md:w-8 md:h-8 ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-4 md:p-6">
                    <h3 className="font-semibold text-base md:text-lg mb-2 group-hover:text-indigo-400 transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-slate-400 mb-3 md:mb-4">
                      <Clock className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs md:text-sm">
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
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Recent Activity</h2>
        <div className="space-y-3 md:space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="bg-[#0F1115] border border-slate-800 rounded-xl p-4 md:p-6 flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4"
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                activity.type === 'completed' ? 'bg-emerald-900/30' :
                activity.type === 'quiz' ? 'bg-indigo-900/30' :
                'bg-amber-900/30'
              }`}>
                {activity.type === 'completed' && <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />}
                {activity.type === 'quiz' && <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />}
                {activity.type === 'project' && <Award className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm md:text-base mb-1 break-words">{activity.description}</p>
                <p className="text-xs md:text-sm text-slate-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Link
            to="/studio"
            className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-6 md:p-8 hover:from-indigo-700 hover:to-indigo-800 transition-all group"
          >
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg md:text-xl font-semibold mb-2">Create New Course</h3>
            <p className="text-sm md:text-base text-indigo-100 opacity-90">Transform videos into structured learning</p>
          </Link>

          <Link
            to="/library"
            className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 md:p-8 hover:from-emerald-700 hover:to-emerald-800 transition-all group"
          >
            <Library className="w-8 h-8 md:w-10 md:h-10 mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg md:text-xl font-semibold mb-2">Browse Library</h3>
            <p className="text-sm md:text-base text-emerald-100 opacity-90">Access all your learning materials</p>
          </Link>

          <Link
            to="/settings"
            className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 md:p-8 hover:from-slate-800 hover:to-slate-900 transition-all group"
          >
            <Settings className="w-8 h-8 md:w-10 md:h-10 mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg md:text-xl font-semibold mb-2">Manage Settings</h3>
            <p className="text-sm md:text-base text-slate-300 opacity-90">Configure models and preferences</p>
          </Link>
        </div>
      </div>
    </div>
  );
}