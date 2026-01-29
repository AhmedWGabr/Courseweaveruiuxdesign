import { useState } from 'react';
import { Sparkles, ChevronRight, ChevronLeft, FileText } from 'lucide-react';

interface NotesEditorProps {
  initialSummary?: string;
  initialKeyTakeaways?: string[];
  initialDeepDive?: string;
  onNext: (data: { summary: string; keyTakeaways: string[]; deepDive: string }) => void;
  onBack: () => void;
}

export function NotesEditor({ initialSummary, initialKeyTakeaways, initialDeepDive, onNext, onBack }: NotesEditorProps) {
  const [summary, setSummary] = useState(
    initialSummary || 'This module introduces compound components, a powerful React pattern that enables flexible component composition by allowing parent and child components to share state implicitly through Context API.'
  );
  const [keyTakeaways, setKeyTakeaways] = useState(
    initialKeyTakeaways || [
      'Compound components create flexible, composable APIs similar to native HTML elements',
      'Context API enables implicit state sharing between parent and child components',
      'This pattern reduces prop drilling and makes components more maintainable',
      'Real-world examples include Select/Option, Tabs, and Accordion components'
    ]
  );
  const [deepDive, setDeepDive] = useState(
    initialDeepDive || 'The compound component pattern leverages React\'s Context API to create a parent component that manages state and provides it to child components without explicit prop passing. This approach offers several advantages over traditional component composition.\n\nBy using this pattern, developers can create components that feel natural to use, similar to how native HTML elements work together. The parent component acts as a container that orchestrates behavior, while child components handle their own rendering logic while accessing shared state.'
  );

  const handleAddTakeaway = () => {
    setKeyTakeaways([...keyTakeaways, '']);
  };

  const handleUpdateTakeaway = (index: number, value: string) => {
    const updated = [...keyTakeaways];
    updated[index] = value;
    setKeyTakeaways(updated);
  };

  const handleRemoveTakeaway = (index: number) => {
    setKeyTakeaways(keyTakeaways.filter((_, i) => i !== index));
  };

  const handleAIGenerate = () => {
    alert('AI will regenerate the notes based on the transcript and chapters!');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-1">Edit AI-Generated Notes</h3>
            <p className="text-sm text-slate-400">Customize the learning materials for your course</p>
          </div>
          <button
            onClick={handleAIGenerate}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Regenerate with AI
          </button>
        </div>

        <div className="space-y-6">
          {/* TL;DR Summary */}
          <div>
            <label className="block mb-2">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold">TL;DR Summary</span>
              </div>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-600 min-h-[100px]"
                placeholder="Brief executive summary..."
              />
            </label>
          </div>

          {/* Key Takeaways */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">Key Takeaways</span>
              <button
                onClick={handleAddTakeaway}
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                + Add Takeaway
              </button>
            </div>
            <div className="space-y-2">
              {keyTakeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-2">
                    <span className="text-xs font-bold">{idx + 1}</span>
                  </div>
                  <input
                    type="text"
                    value={takeaway}
                    onChange={(e) => handleUpdateTakeaway(idx, e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-600"
                    placeholder="Enter key takeaway..."
                  />
                  <button
                    onClick={() => handleRemoveTakeaway(idx)}
                    className="text-red-400 hover:text-red-300 mt-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Deep Dive */}
          <div>
            <label className="block mb-2">
              <span className="font-semibold block mb-2">Deep Dive</span>
              <textarea
                value={deepDive}
                onChange={(e) => setDeepDive(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-600 min-h-[200px]"
                placeholder="Detailed explanation and analysis..."
              />
            </label>
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
          onClick={() => onNext({ summary, keyTakeaways, deepDive })}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          Continue to Project
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}