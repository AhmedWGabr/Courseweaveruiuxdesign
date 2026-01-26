export interface Course {
  id: string;
  title: string;
  thumbnail: string;
  progress: number;
  status: 'In Progress' | 'Paused' | 'Completed';
  duration: string;
  modules: Module[];
  createdAt: string;
}

export interface Module {
  id: string;
  title: string;
  type: 'video' | 'note' | 'quiz' | 'project';
  duration?: string;
  completed: boolean;
  videoUrl?: string;
  transcript?: TranscriptBlock[];
  summary?: string;
  quiz?: QuizQuestion[];
  project?: Project;
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  quiz?: QuizQuestion[];
}

export interface TranscriptBlock {
  id: string;
  timestamp: string;
  speaker: string;
  text: string;
  time: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  videoTimestamp?: number;
}

export interface Project {
  title: string;
  description: string;
  requirements: string[];
  rubric: { criterion: string; points: number }[];
}

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    progress: 65,
    status: 'In Progress',
    duration: '4h 32m',
    createdAt: '2025-01-20',
    modules: [
      {
        id: 'm1',
        title: 'Introduction to Compound Components',
        type: 'video',
        duration: '45m',
        completed: true,
        videoUrl: 'https://example.com/video1.mp4',
        chapters: [
          {
            id: 'c1',
            title: 'What are Compound Components?',
            startTime: 0,
            endTime: 480,
            quiz: [
              {
                id: 'q1-c1',
                question: 'What is the main benefit of compound components?',
                options: [
                  'Better performance',
                  'Flexible component composition',
                  'Smaller bundle size',
                  'Easier testing'
                ],
                correctAnswer: 1,
                explanation: 'Compound components provide flexible composition by allowing parent and child components to share state implicitly.'
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
                id: 'q1-c2',
                question: 'Which React API is commonly used to implement compound components?',
                options: [
                  'useState',
                  'useEffect',
                  'Context API',
                  'useReducer'
                ],
                correctAnswer: 2,
                explanation: 'The Context API is the primary mechanism for sharing state between compound components.'
              }
            ]
          },
          {
            id: 'c3',
            title: 'Real-world Examples',
            startTime: 960,
            endTime: 1440,
            quiz: [
              {
                id: 'q1-c3',
                question: 'Which HTML elements work similar to compound components?',
                options: [
                  'div and span',
                  'select and option',
                  'img and src',
                  'a and href'
                ],
                correctAnswer: 1,
                explanation: 'The select and option elements work together as a compound component, where select manages state and option elements render within that context.'
              }
            ]
          },
          {
            id: 'c4',
            title: 'Building Your First Compound Component',
            startTime: 1440,
            endTime: 2700
          }
        ],
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
          {
            id: 't5',
            timestamp: '24:00',
            speaker: 'Instructor',
            text: 'Time to build your first compound component from scratch!',
            time: 1440
          }
        ],
        summary: 'This module introduces compound components, a powerful React pattern for building flexible component APIs. Learn how to share state between components implicitly using Context.'
      },
      {
        id: 'm2',
        title: 'Render Props Deep Dive',
        type: 'video',
        duration: '52m',
        completed: true
      },
      {
        id: 'm3',
        title: 'Knowledge Check: Patterns',
        type: 'quiz',
        completed: false,
        quiz: [
          {
            id: 'q1',
            question: 'What is the main benefit of using compound components?',
            options: [
              'Better performance',
              'Flexible component composition',
              'Smaller bundle size',
              'Easier testing'
            ],
            correctAnswer: 1,
            explanation: 'Compound components provide flexible composition by allowing parent and child components to share state implicitly.',
            videoTimestamp: 15
          },
          {
            id: 'q2',
            question: 'Which React API is commonly used to implement compound components?',
            options: [
              'useState',
              'useEffect',
              'Context API',
              'useReducer'
            ],
            correctAnswer: 2,
            explanation: 'The Context API is the primary mechanism for sharing state between compound components.',
            videoTimestamp: 120
          }
        ]
      },
      {
        id: 'm4',
        title: 'Custom Hooks Architecture',
        type: 'video',
        duration: '1h 12m',
        completed: false
      },
      {
        id: 'm5',
        title: 'Capstone: Build a Data Table Component',
        type: 'project',
        completed: false,
        project: {
          title: 'Build a Reusable Data Table',
          description: 'Create a flexible, accessible data table component using compound component patterns.',
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
        }
      }
    ]
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
    progress: 100,
    status: 'Completed',
    duration: '6h 15m',
    createdAt: '2025-01-10',
    modules: []
  },
  {
    id: '3',
    title: 'System Design Interview Prep',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    progress: 25,
    status: 'Paused',
    duration: '8h 45m',
    createdAt: '2025-01-15',
    modules: []
  }
];

export const modelOptions = [
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', type: 'cloud', requiresKey: true },
  { id: 'gpt-4o', name: 'GPT-4o', type: 'cloud', requiresKey: true },
  { id: 'llama-3-8b', name: 'Llama 3 8B', type: 'local', size: '4.2 GB', downloaded: true },
  { id: 'mistral-7b', name: 'Mistral 7B', type: 'local', size: '3.8 GB', downloaded: false },
  { id: 'phi-3', name: 'Phi-3', type: 'local', size: '2.1 GB', downloaded: false }
];