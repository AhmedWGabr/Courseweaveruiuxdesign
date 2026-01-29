import { Link, useNavigate } from 'react-router';
import { Play, Pause, CheckCircle2, Clock, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { mockCourses } from '../lib/mockData';
import { useState } from 'react';

export function Library() {
  const navigate = useNavigate();
  const lastCourse = mockCourses.find((c) => c.status === 'In Progress');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleEdit = (e: React.MouseEvent, courseId: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to Studio with course ID to load for editing
    navigate(`/studio?edit=${courseId}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, courseId: string, courseTitle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setCourseToDelete(courseId);
    setShowDeleteModal(true);
    setOpenDropdown(null);
  };

  const confirmDelete = () => {
    if (courseToDelete) {
      // In a real app, this would remove from the data store
      alert(`Course "${mockCourses.find(c => c.id === courseToDelete)?.title}" deleted!`);
      setShowDeleteModal(false);
      setCourseToDelete(null);
    }
  };

  const toggleDropdown = (e: React.MouseEvent, courseId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdown(openDropdown === courseId ? null : courseId);
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Your Library</h1>
        <p className="text-sm sm:text-base text-slate-400">All your courses in one place</p>
      </div>

      {/* Quick Actions */}
      {lastCourse && (
        <div className="mb-6 md:mb-8">
          <Link
            to={`/classroom/${lastCourse.id}`}
            className="inline-flex items-center gap-2 sm:gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 rounded-xl transition-colors font-medium text-xs sm:text-sm md:text-base"
          >
            <Play className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
            <span className="truncate">Resume: {lastCourse.title}</span>
          </Link>
        </div>
      )}

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {mockCourses.map((course) => (
          <div key={course.id} className="relative group">
            <Link
              to={`/classroom/${course.id}`}
              className="block bg-[#0F1115] rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-600 transition-all"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between">
                  <span className="text-xs text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </span>
                  {course.status === 'In Progress' && (
                    <span className="text-xs bg-indigo-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                      In Progress
                    </span>
                  )}
                  {course.status === 'Completed' && (
                    <span className="text-xs bg-emerald-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                  {course.status === 'Paused' && (
                    <span className="text-xs bg-amber-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex items-center gap-1">
                      <Pause className="w-3 h-3" />
                      Paused
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {course.title}
                </h3>

                {/* Progress Thread */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
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

            {/* Action Menu */}
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
              <button
                onClick={(e) => toggleDropdown(e, course.id)}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center justify-center border border-slate-700"
              >
                <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Dropdown Menu */}
              {openDropdown === course.id && (
                <div className="absolute top-8 sm:top-10 right-0 w-40 sm:w-48 bg-[#0F1115] border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                  <button
                    onClick={(e) => handleEdit(e, course.id)}
                    className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Edit Course
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(e, course.id, course.title)}
                    className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Delete Course
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && courseToDelete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-4 sm:p-6 max-w-md w-full">
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Delete Course?</h3>
                <p className="text-slate-400 text-xs sm:text-sm break-words">
                  Are you sure you want to delete "{mockCourses.find(c => c.id === courseToDelete)?.title}"? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCourseToDelete(null);
                }}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2 text-sm"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}