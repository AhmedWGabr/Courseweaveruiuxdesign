import { useState } from 'react';
import { Award, Plus, Trash2, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface ProjectBuilderProps {
  onNext: (data: {
    projectTitle: string;
    projectDescription: string;
    requirements: string[];
    rubric: { criterion: string; points: number }[];
  }) => void;
  onBack: () => void;
}

export function ProjectBuilder({ onNext, onBack }: ProjectBuilderProps) {
  const [projectTitle, setProjectTitle] = useState('Build a Reusable Data Table Component');
  const [projectDescription, setProjectDescription] = useState(
    'Create a flexible, accessible data table component using compound component patterns. This capstone project will test your understanding of React patterns and component architecture.'
  );
  const [requirements, setRequirements] = useState([
    'Use compound component pattern',
    'Support sorting and filtering',
    'Implement keyboard navigation',
    'Add loading and error states',
    'Include comprehensive TypeScript types'
  ]);
  const [rubric, setRubric] = useState([
    { criterion: 'Correct implementation of compound components', points: 30 },
    { criterion: 'Accessibility features', points: 25 },
    { criterion: 'Code quality and TypeScript usage', points: 25 },
    { criterion: 'Testing and documentation', points: 20 }
  ]);

  const handleAddRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const handleUpdateRequirement = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleAddRubricItem = () => {
    setRubric([...rubric, { criterion: '', points: 0 }]);
  };

  const handleUpdateRubricItem = (index: number, field: 'criterion' | 'points', value: string | number) => {
    const updated = [...rubric];
    updated[index] = { ...updated[index], [field]: value };
    setRubric(updated);
  };

  const handleRemoveRubricItem = (index: number) => {
    setRubric(rubric.filter((_, i) => i !== index));
  };

  const totalPoints = rubric.reduce((sum, item) => sum + item.points, 0);

  const handleAIGenerate = () => {
    alert('AI will generate a capstone project based on the course content!');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-1 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              Design Capstone Project
            </h3>
            <p className="text-sm text-slate-400">Create a hands-on project to apply learned concepts</p>
          </div>
          <button
            onClick={handleAIGenerate}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI Generate Project
          </button>
        </div>

        <div className="space-y-6">
          {/* Project Title */}
          <div>
            <label className="block mb-2">
              <span className="font-semibold block mb-2">Project Title</span>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-600"
                placeholder="Enter project title..."
              />
            </label>
          </div>

          {/* Project Description */}
          <div>
            <label className="block mb-2">
              <span className="font-semibold block mb-2">Project Description</span>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-600 min-h-[100px]"
                placeholder="Describe the project objectives and goals..."
              />
            </label>
          </div>

          {/* Requirements */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">Requirements</span>
              <button
                onClick={handleAddRequirement}
                className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Requirement
              </button>
            </div>
            <div className="space-y-2">
              {requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-slate-600 rounded flex-shrink-0" />
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleUpdateRequirement(idx, e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-600"
                    placeholder="Enter requirement..."
                  />
                  <button
                    onClick={() => handleRemoveRequirement(idx)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Grading Rubric */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-semibold">Grading Rubric</span>
                <span className="text-sm text-slate-400 ml-2">
                  (Total: {totalPoints} points)
                </span>
              </div>
              <button
                onClick={handleAddRubricItem}
                className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Criterion
              </button>
            </div>
            <div className="space-y-2">
              {rubric.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.criterion}
                    onChange={(e) => handleUpdateRubricItem(idx, 'criterion', e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-600"
                    placeholder="Criterion..."
                  />
                  <input
                    type="number"
                    value={item.points}
                    onChange={(e) => handleUpdateRubricItem(idx, 'points', parseInt(e.target.value) || 0)}
                    className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-600"
                    placeholder="Points"
                  />
                  <span className="text-sm text-slate-400">pts</span>
                  <button
                    onClick={() => handleRemoveRubricItem(idx)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
          onClick={() => onNext({ projectTitle, projectDescription, requirements, rubric })}
          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          Review & Publish
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
