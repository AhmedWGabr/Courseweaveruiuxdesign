import { useState } from 'react';
import { Globe, Upload, ChevronRight } from 'lucide-react';

interface StudioInputProps {
  onNext: (data: { type: 'web' | 'file'; url?: string; file?: File }) => void;
}

export function StudioInput({ onNext }: StudioInputProps) {
  const [inputType, setInputType] = useState<'web' | 'file'>('web');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

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

  return (
    <div className="max-w-3xl mx-auto">
      {/* Input Type Toggle */}
      <div className="flex items-center justify-center mb-8">
        <div className="inline-flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setInputType('web')}
            className={`px-6 py-2 rounded-md transition-colors flex items-center gap-2 ${
              inputType === 'web'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            Web Link
          </button>
          <button
            onClick={() => setInputType('file')}
            className={`px-6 py-2 rounded-md transition-colors flex items-center gap-2 ${
              inputType === 'file'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            Local File
          </button>
        </div>
      </div>

      {/* Web Link Input */}
      {inputType === 'web' && (
        <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-8">
          <h3 className="text-xl font-semibold mb-4">Enter Video URL</h3>
          <p className="text-slate-400 mb-6">
            Paste a YouTube, Vimeo, or direct video link
          </p>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-600"
          />
          <button
            onClick={handleUrlSubmit}
            disabled={!videoUrl}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* File Upload */}
      {inputType === 'file' && (
        <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-8">
          <h3 className="text-xl font-semibold mb-4">Upload Video File</h3>
          <p className="text-slate-400 mb-6">
            Supports MP4, MKV, MOV files
          </p>
          <label className="block">
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-600 rounded-xl p-12 text-center cursor-pointer transition-colors">
              <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-300 mb-2">
                {selectedFile ? selectedFile.name : 'Drop your video here or click to browse'}
              </p>
              <p className="text-sm text-slate-500">
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
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Playlist Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Playlist Detected</h3>
            <p className="text-slate-400 mb-6">
              This URL contains a playlist with 12 videos. Would you like to weave the entire playlist or just this video?
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowPlaylistModal(false);
                  onNext({ type: 'web', url: videoUrl });
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Weave Entire Playlist (12 videos)
              </button>
              <button
                onClick={() => {
                  setShowPlaylistModal(false);
                  onNext({ type: 'web', url: videoUrl });
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Just This Video
              </button>
              <button
                onClick={() => setShowPlaylistModal(false)}
                className="w-full text-slate-400 hover:text-slate-200 px-6 py-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
