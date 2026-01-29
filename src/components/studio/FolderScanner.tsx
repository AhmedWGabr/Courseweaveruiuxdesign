import { useState } from 'react';
import { Folder, FileVideo, FileText, CheckCircle2, XCircle, ChevronRight, X, Upload } from 'lucide-react';

interface FileInfo {
  name: string;
  path: string;
  type: 'video' | 'transcript';
  extension: string;
  size?: number;
  transcriptFile?: string;
}

interface ModuleStructure {
  name: string;
  videos: FileInfo[];
}

interface FolderScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (modules: ModuleStructure[]) => void;
}

export function FolderScanner({ isOpen, onClose, onConfirm }: FolderScannerProps) {
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [modules, setModules] = useState<ModuleStructure[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const transcriptExtensions = ['srt', 'txt', 'ttml', 'webvtt', 'vtt', 'sbv', 'sub'];
  const videoExtensions = ['mp4', 'mkv', 'mov', 'avi', 'webm', 'flv', 'm4v'];

  // Mock folder scanning - in real app, this would use File System Access API
  const handleFolderSelect = async () => {
    setIsScanning(true);
    
    // Simulate folder scanning with mock data
    setTimeout(() => {
      const mockFiles: FileInfo[] = [
        {
          name: '01-introduction.mp4',
          path: '/Module 1 - Basics/01-introduction.mp4',
          type: 'video',
          extension: 'mp4',
          size: 52428800, // 50MB
          transcriptFile: '01-introduction.srt'
        },
        {
          name: '01-introduction.srt',
          path: '/Module 1 - Basics/01-introduction.srt',
          type: 'transcript',
          extension: 'srt'
        },
        {
          name: '02-fundamentals.mp4',
          path: '/Module 1 - Basics/02-fundamentals.mp4',
          type: 'video',
          extension: 'mp4',
          size: 67108864, // 64MB
          transcriptFile: '02-fundamentals.vtt'
        },
        {
          name: '02-fundamentals.vtt',
          path: '/Module 1 - Basics/02-fundamentals.vtt',
          type: 'transcript',
          extension: 'vtt'
        },
        {
          name: '01-advanced-concepts.mp4',
          path: '/Module 2 - Advanced/01-advanced-concepts.mp4',
          type: 'video',
          extension: 'mp4',
          size: 78643200 // 75MB
        },
        {
          name: '02-patterns.mp4',
          path: '/Module 2 - Advanced/02-patterns.mp4',
          type: 'video',
          extension: 'mp4',
          size: 83886080, // 80MB
          transcriptFile: '02-patterns.txt'
        },
        {
          name: '02-patterns.txt',
          path: '/Module 2 - Advanced/02-patterns.txt',
          type: 'transcript',
          extension: 'txt'
        },
        {
          name: 'project-demo.mp4',
          path: '/Module 3 - Project/project-demo.mp4',
          type: 'video',
          extension: 'mp4',
          size: 104857600, // 100MB
          transcriptFile: 'project-demo.webvtt'
        },
        {
          name: 'project-demo.webvtt',
          path: '/Module 3 - Project/project-demo.webvtt',
          type: 'transcript',
          extension: 'webvtt'
        }
      ];

      setFiles(mockFiles);
      
      // Auto-organize into modules based on folder structure
      const moduleMap = new Map<string, FileInfo[]>();
      
      mockFiles.filter(f => f.type === 'video').forEach(file => {
        const pathParts = file.path.split('/');
        const moduleName = pathParts[1] || 'Ungrouped';
        
        if (!moduleMap.has(moduleName)) {
          moduleMap.set(moduleName, []);
        }
        moduleMap.get(moduleName)!.push(file);
      });

      const detectedModules: ModuleStructure[] = Array.from(moduleMap.entries()).map(
        ([name, videos]) => ({
          name,
          videos: videos.sort((a, b) => a.name.localeCompare(b.name))
        })
      );

      setModules(detectedModules);
      setSelectedFolder('My Course Videos');
      setIsScanning(false);
    }, 1500);
  };

  const handleModuleNameChange = (index: number, newName: string) => {
    const updated = [...modules];
    updated[index].name = newName;
    setModules(updated);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getTotalSize = () => {
    return files
      .filter(f => f.type === 'video')
      .reduce((sum, f) => sum + (f.size || 0), 0);
  };

  const videoCount = files.filter(f => f.type === 'video').length;
  const transcriptCount = files.filter(f => f.type === 'transcript').length;
  const videosWithTranscripts = files.filter(f => f.type === 'video' && f.transcriptFile).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0F1115] border border-slate-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-800 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
              <Folder className="w-6 h-6 text-indigo-400" />
              Scan Course Folder
            </h2>
            <p className="text-sm text-slate-400">
              Automatically detect videos, transcripts, and organize into modules
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedFolder ? (
            /* Folder Selection */
            <div className="text-center py-12">
              <Upload className="w-20 h-20 text-slate-600 mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-2">Select Course Folder</h3>
              <p className="text-slate-400 mb-6">
                Choose a folder containing your course videos and transcript files
              </p>
              <button
                onClick={handleFolderSelect}
                disabled={isScanning}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white px-8 py-3 rounded-lg transition-colors font-medium inline-flex items-center gap-2"
              >
                {isScanning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Scanning Folder...
                  </>
                ) : (
                  <>
                    <Folder className="w-5 h-5" />
                    Browse Folder
                  </>
                )}
              </button>
              <p className="text-xs text-slate-500 mt-4">
                Supported: MP4, MKV, MOV, AVI • Transcripts: SRT, VTT, TXT, TTML, WebVTT
              </p>
            </div>
          ) : (
            /* Scanned Results */
            <div>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="text-3xl font-bold text-indigo-400 mb-1">{videoCount}</div>
                  <div className="text-sm text-slate-400">Video Files</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="text-3xl font-bold text-emerald-400 mb-1">{transcriptCount}</div>
                  <div className="text-sm text-slate-400">Transcripts</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="text-3xl font-bold text-amber-400 mb-1">{modules.length}</div>
                  <div className="text-sm text-slate-400">Modules Detected</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="text-3xl font-bold text-purple-400 mb-1">
                    {formatFileSize(getTotalSize())}
                  </div>
                  <div className="text-sm text-slate-400">Total Size</div>
                </div>
              </div>

              {/* Detection Status */}
              <div className="bg-slate-900 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {videosWithTranscripts === videoCount ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-amber-400" />
                    )}
                    <div>
                      <div className="font-semibold">
                        {videosWithTranscripts} of {videoCount} videos have transcripts
                      </div>
                      <div className="text-sm text-slate-400">
                        {videosWithTranscripts === videoCount
                          ? 'All videos are ready for processing'
                          : `${videoCount - videosWithTranscripts} video(s) will generate transcripts using AI`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Module Structure */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">Detected Course Structure</h3>
                <div className="space-y-4">
                  {modules.map((module, moduleIdx) => (
                    <div key={moduleIdx} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                      {/* Module Header */}
                      <div className="bg-indigo-900/20 border-b border-slate-800 p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold">
                            {moduleIdx + 1}
                          </div>
                          <input
                            type="text"
                            value={module.name}
                            onChange={(e) => handleModuleNameChange(moduleIdx, e.target.value)}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-600"
                          />
                          <span className="text-sm text-slate-400">
                            {module.videos.length} video{module.videos.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Videos in Module */}
                      <div className="p-4 space-y-2">
                        {module.videos.map((video, videoIdx) => (
                          <div
                            key={videoIdx}
                            className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg"
                          >
                            <FileVideo className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{video.name}</div>
                              <div className="text-xs text-slate-400">
                                {formatFileSize(video.size)} • {video.extension.toUpperCase()}
                              </div>
                            </div>
                            {video.transcriptFile ? (
                              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                                <FileText className="w-4 h-4" />
                                <span className="hidden sm:inline">{video.transcriptFile}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-amber-400 text-sm">
                                <XCircle className="w-4 h-4" />
                                <span className="hidden sm:inline">No transcript</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedFolder && (
          <div className="border-t border-slate-800 p-6 flex gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(modules)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              Process {videoCount} Video{videoCount !== 1 ? 's' : ''}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
