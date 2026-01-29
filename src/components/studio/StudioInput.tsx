import { useState } from 'react';
import { Globe, Upload, ChevronRight, Folder } from 'lucide-react';
import { FolderScanner } from './FolderScanner';

interface ModuleStructure {
  name: string;
  videos: {
    name: string;
    path: string;
    type: 'video' | 'transcript';
    extension: string;
    size?: number;
    transcriptFile?: string;
  }[];
}

interface StudioInputProps {
  onNext: (data: { 
    type: 'web' | 'file' | 'folder'; 
    url?: string; 
    file?: File;
    modules?: ModuleStructure[];
  }) => void;
}

export function StudioInput({ onNext }: StudioInputProps) {
  const [inputType, setInputType] = useState<'web' | 'file' | 'folder'>('web');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showFolderScanner, setShowFolderScanner] = useState(false);

  const handleUrlSubmit = () => {
    if (videoUrl.includes('playlist') || videoUrl.includes('list=')) {
      setShowPlaylistModal(true);
    } else {
      onNext({ type: 'web', url: videoUrl });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileSubmit = () => {
    if (selectedFile) {
      onNext({ type: 'file', file: selectedFile });
    }
  };

  const handleFolderConfirm = (modules: ModuleStructure[]) => {
    setShowFolderScanner(false);
    onNext({ type: 'folder', modules });
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4">
      {/* Input Type Toggle */}
      <div className="flex items-center justify-center mb-6 sm:mb-8">
        <div className="inline-flex bg-slate-800 rounded-lg p-1 w-full max-w-sm">
          <button
            onClick={() => setInputType('web')}
            className={`flex-1 px-2 sm:px-4 md:px-6 py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm ${
              inputType === 'web'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Web</span>
          </button>
          <button
            onClick={() => setInputType('file')}
            className={`flex-1 px-2 sm:px-4 md:px-6 py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm ${
              inputType === 'file'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>File</span>
          </button>
          <button
            onClick={() => setInputType('folder')}
            className={`flex-1 px-2 sm:px-4 md:px-6 py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm ${
              inputType === 'folder'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Folder className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Folder</span>
          </button>
        </div>
      </div>

      {/* Web Link Input */}
      {inputType === 'web' && (
        <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-4 sm:p-6 md:p-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Enter Video URL</h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6">
            Paste a YouTube, Vimeo, or direct video link
          </p>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-600"
          />
          <button
            onClick={handleUrlSubmit}
            disabled={!videoUrl}
            className="w-full mt-3 sm:mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            Continue
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      )}

      {/* File Upload */}
      {inputType === 'file' && (
        <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-4 sm:p-6 md:p-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Upload Video File</h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6">
            Supports MP4, MKV, MOV files
          </p>
          <label className="block">
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-600 rounded-xl p-6 sm:p-8 md:p-12 text-center cursor-pointer transition-colors">
              <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-slate-500 mx-auto mb-3 sm:mb-4" />
              <p className="text-xs sm:text-sm text-slate-300 mb-1 sm:mb-2">
                {selectedFile ? selectedFile.name : 'Drop your video here or click to browse'}
              </p>
              <p className="text-xs text-slate-500">
                Maximum file size: 2GB
              </p>
            </div>
            <input
              type="file"
              accept="video/mp4,video/x-matroska,video/quicktime"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
          {selectedFile && (
            <button
              onClick={handleFileSubmit}
              className="w-full mt-3 sm:mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              Continue
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      )}

      {/* Folder Scan */}
      {inputType === 'folder' && (
        <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-4 sm:p-6 md:p-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <Folder className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
            Scan Course Folder
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6">
            Automatically detect videos, transcripts, and organize into modules based on your folder structure
          </p>
          
          <div className="bg-indigo-900/20 border border-indigo-600/30 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
            <h4 className="font-semibold text-indigo-300 mb-2 sm:mb-3 text-sm sm:text-base">Supported Features:</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>Auto-detect video files (MP4, MKV, MOV, AVI, WebM)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>Match transcript files (SRT, VTT, TXT, TTML, WebVTT, SBV, SUB)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>Organize into modules based on folder structure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>Generate AI transcripts for videos without transcript files</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setShowFolderScanner(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Folder className="w-4 h-4 sm:w-5 sm:h-5" />
            Browse & Scan Folder
          </button>

          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-slate-900 rounded-lg">
            <p className="text-xs text-slate-400 break-all">
              <strong className="text-slate-300">Example folder structure:</strong><br />
              My Course/<br />
              ├── Module 1 - Introduction/<br />
              │   ├── 01-welcome.mp4<br />
              │   ├── 01-welcome.srt<br />
              │   └── 02-overview.mp4<br />
              └── Module 2 - Advanced/<br />
              &nbsp;&nbsp;&nbsp;&nbsp;├── 01-concepts.mp4<br />
              &nbsp;&nbsp;&nbsp;&nbsp;└── 01-concepts.vtt
            </p>
          </div>
        </div>
      )}

      {/* Playlist Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Playlist Detected</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6">
              This URL contains a playlist with 12 videos. Would you like to weave the entire playlist or just this video?
            </p>
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={() => {
                  setShowPlaylistModal(false);
                  onNext({ type: 'web', url: videoUrl });
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors font-medium text-sm sm:text-base"
              >
                Weave Entire Playlist (12 videos)
              </button>
              <button
                onClick={() => {
                  setShowPlaylistModal(false);
                  onNext({ type: 'web', url: videoUrl });
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors font-medium text-sm sm:text-base"
              >
                Just This Video
              </button>
              <button
                onClick={() => setShowPlaylistModal(false)}
                className="w-full text-slate-400 hover:text-slate-200 px-4 sm:px-6 py-2 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Folder Scanner Modal */}
      <FolderScanner
        isOpen={showFolderScanner}
        onClose={() => setShowFolderScanner(false)}
        onConfirm={handleFolderConfirm}
      />
    </div>
  );
}