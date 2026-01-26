import { useState } from 'react';
import { Sparkles, Scissors, Users, Plus, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';
import { type TranscriptBlock, type Chapter } from '../../lib/mockData';

interface TranscriptEditorProps {
  onNext: (data: { transcript: TranscriptBlock[]; chapters: Chapter[] }) => void;
  onBack: () => void;
}

export function TranscriptEditor({ onNext, onBack }: TranscriptEditorProps) {
  const [transcript, setTranscript] = useState<TranscriptBlock[]>([
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
  ]);

  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: 'c1',
      title: 'Introduction to Compound Components',
      startTime: 0,
      endTime: 480
    },
    {
      id: 'c2',
      title: 'Understanding Context API',
      startTime: 480,
      endTime: 960
    },
    {
      id: 'c3',
      title: 'Real-world Examples',
      startTime: 960,
      endTime: 1440
    }
  ]);

  const [showChapterForm, setShowChapterForm] = useState(false);
  const [newChapter, setNewChapter] = useState({ title: '', startTime: 0, endTime: 0 });

  const handleCleanTranscript = () => {
    // Simulate AI cleaning
    alert('AI will remove filler words like "um", "ah", etc.');
  };

  const handleEditTranscript = (id: string, newText: string) => {
    setTranscript(transcript.map(t => t.id === id ? { ...t, text: newText } : t));
  };

  const handleDeleteTranscriptBlock = (id: string) => {
    setTranscript(transcript.filter(t => t.id !== id));
  };

  const handleAddChapter = () => {
    if (newChapter.title && newChapter.endTime > newChapter.startTime) {
      setChapters([...chapters, {
        id: `c${chapters.length + 1}`,
        ...newChapter
      }]);
      setNewChapter({ title: '', startTime: 0, endTime: 0 });
      setShowChapterForm(false);
    }
  };

  const handleDeleteChapter = (id: string) => {
    setChapters(chapters.filter(c => c.id !== id));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <h3 className="text-lg md:text-xl font-semibold">Transcript & Chapter Editor</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleCleanTranscript}
              className="px-3 md:px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-xs md:text-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              AI Clean-Up
            </button>
            <button className="px-3 md:px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-xs md:text-sm flex items-center gap-2">
              <Users className="w-4 h-4" />
              Speaker Labels
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Transcript */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center justify-between">
              <span>Transcript Blocks</span>
              <span className="text-sm text-slate-400">{transcript.length} blocks</span>
            </h4>
            <div className="bg-slate-900 rounded-lg p-4 max-h-[500px] overflow-y-auto">
              <div className="space-y-4">
                {transcript.map((block) => (
                  <div key={block.id} className="border-l-2 border-indigo-600 pl-4 py-2 bg-slate-800/50 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-indigo-400 font-mono">{block.timestamp}</span>
                      <span className="text-xs text-slate-500">{block.speaker}</span>
                      <button
                        onClick={() => handleDeleteTranscriptBlock(block.id)}
                        className="ml-auto text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <textarea
                      value={block.text}
                      onChange={(e) => handleEditTranscript(block.id, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs md:text-sm text-slate-300 focus:outline-none focus:border-indigo-600"
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chapters */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center justify-between">
              <span>Video Chapters</span>
              <button
                onClick={() => setShowChapterForm(!showChapterForm)}
                className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Chapter
              </button>
            </h4>

            {showChapterForm && (
              <div className="bg-slate-900 rounded-lg p-4 mb-4 border border-slate-800">
                <input
                  type="text"
                  placeholder="Chapter title"
                  value={newChapter.title}
                  onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 mb-2 focus:outline-none focus:border-indigo-600"
                />
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="number"
                    placeholder="Start time (seconds)"
                    value={newChapter.startTime}
                    onChange={(e) => setNewChapter({ ...newChapter, startTime: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-600"
                  />
                  <input
                    type="number"
                    placeholder="End time (seconds)"
                    value={newChapter.endTime}
                    onChange={(e) => setNewChapter({ ...newChapter, endTime: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <button
                  onClick={handleAddChapter}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
                >
                  Add Chapter
                </button>
              </div>
            )}

            <div className="bg-slate-900 rounded-lg p-4 max-h-[500px] overflow-y-auto space-y-2">
              {chapters.map((chapter, idx) => (
                <div key={chapter.id} className="bg-slate-800 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-xs font-medium">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{chapter.title}</div>
                        <div className="text-xs text-slate-400">
                          {formatTime(chapter.startTime)} - {formatTime(chapter.endTime)}
                          {' '}({formatTime(chapter.endTime - chapter.startTime)} duration)
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteChapter(chapter.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
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
          onClick={() => onNext({ transcript, chapters })}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          Continue to Quizzes
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
