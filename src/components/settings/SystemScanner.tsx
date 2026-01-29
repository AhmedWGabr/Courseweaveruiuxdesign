import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Wrench, Mic } from 'lucide-react';

interface SystemStatus {
  ffmpeg: {
    available: boolean;
    path?: string;
    version?: string;
  };
  whisperModels: {
    name: string;
    size: string;
    path: string;
    available: boolean;
  }[];
  llmModels: {
    name: string;
    size: string;
    path: string;
    available: boolean;
    parameters: string;
  }[];
}

export function SystemScanner() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    // Simulate scanning for tools and models
    // In real app, this would check the filesystem
    setTimeout(() => {
      const mockStatus: SystemStatus = {
        ffmpeg: {
          available: true,
          path: '/tools/ffmpeg/bin/ffmpeg',
          version: 'ffmpeg version 6.1.1'
        },
        whisperModels: [
          {
            name: 'Whisper Tiny',
            size: '75 MB',
            path: '/tools/models/whisper-tiny.bin',
            available: true
          },
          {
            name: 'Whisper Base',
            size: '142 MB',
            path: '/tools/models/whisper-base.bin',
            available: true
          },
          {
            name: 'Whisper Small',
            size: '466 MB',
            path: '/tools/models/whisper-small.bin',
            available: false
          },
          {
            name: 'Whisper Medium',
            size: '1.5 GB',
            path: '/tools/models/whisper-medium.bin',
            available: false
          }
        ],
        llmModels: [
          {
            name: 'Llama 3.2 3B',
            size: '2.0 GB',
            path: '/tools/models/llama-3.2-3b-instruct-q4_k_m.gguf',
            available: true,
            parameters: '3B'
          },
          {
            name: 'Llama 3.1 8B',
            size: '4.9 GB',
            path: '/tools/models/llama-3.1-8b-instruct-q4_k_m.gguf',
            available: true,
            parameters: '8B'
          },
          {
            name: 'Mistral 7B',
            size: '4.1 GB',
            path: '/tools/models/mistral-7b-instruct-q4_k_m.gguf',
            available: false,
            parameters: '7B'
          },
          {
            name: 'Phi-3 Mini',
            size: '2.3 GB',
            path: '/tools/models/phi-3-mini-4k-instruct-q4.gguf',
            available: true,
            parameters: '3.8B'
          }
        ]
      };

      setSystemStatus(mockStatus);
      setIsScanning(false);
    }, 1500);
  }, []);

  if (isScanning) {
    return (
      <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Scanning system for tools and models...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!systemStatus) return null;

  return (
    <div className="space-y-6">
      {/* FFmpeg Status */}
      <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-indigo-400" />
          FFmpeg Video Processing
        </h3>

        <div className="flex items-start gap-4">
          {systemStatus.ffmpeg.available ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
          ) : (
            <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
          )}
          <div className="flex-1">
            <div className="font-medium mb-1">
              {systemStatus.ffmpeg.available ? 'FFmpeg Available' : 'FFmpeg Not Found'}
            </div>
            {systemStatus.ffmpeg.available ? (
              <>
                <div className="text-sm text-slate-400 mb-2">
                  {systemStatus.ffmpeg.version}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  {systemStatus.ffmpeg.path}
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-400">
                Please ensure FFmpeg is installed in the /tools folder
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Whisper Models */}
      <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Mic className="w-5 h-5 text-indigo-400" />
          Whisper Transcription Models
        </h3>

        <div className="space-y-3">
          {systemStatus.whisperModels.map((model, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-slate-900 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {model.available ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-slate-600 flex-shrink-0" />
                )}
                <div>
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-slate-400">
                    {model.size} • {model.available ? 'Ready' : 'Not installed'}
                  </div>
                  {model.available && (
                    <div className="text-xs text-slate-500 font-mono mt-1">
                      {model.path}
                    </div>
                  )}
                </div>
              </div>
              {model.available && (
                <span className="px-3 py-1 bg-emerald-900/30 text-emerald-400 text-xs rounded border border-emerald-600/30">
                  Available
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-indigo-900/20 border border-indigo-600/30 rounded-lg">
          <p className="text-sm text-slate-300">
            <strong className="text-indigo-300">Tip:</strong> Base and Small models provide the best balance between speed and accuracy for most videos.
          </p>
        </div>
      </div>

      {/* LLM Models */}
      <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Local LLM Models (GGUF)
        </h3>

        <div className="space-y-3">
          {systemStatus.llmModels.map((model, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-slate-900 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1">
                {model.available ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-slate-600 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-slate-400">
                    {model.parameters} parameters • {model.size} • {model.available ? 'Ready' : 'Not installed'}
                  </div>
                  {model.available && (
                    <div className="text-xs text-slate-500 font-mono mt-1 truncate">
                      {model.path}
                    </div>
                  )}
                </div>
              </div>
              {model.available && (
                <span className="px-3 py-1 bg-emerald-900/30 text-emerald-400 text-xs rounded border border-emerald-600/30 ml-2 flex-shrink-0">
                  Available
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-amber-900/20 border border-amber-600/30 rounded-lg">
          <p className="text-sm text-slate-300">
            <strong className="text-amber-300">Note:</strong> All models are quantized (Q4_K_M) for optimal performance on consumer hardware.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-2xl font-bold text-emerald-400 mb-1">
              {systemStatus.ffmpeg.available ? '1/1' : '0/1'}
            </div>
            <div className="text-sm text-slate-400">Video Tools</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400 mb-1">
              {systemStatus.whisperModels.filter(m => m.available).length}/{systemStatus.whisperModels.length}
            </div>
            <div className="text-sm text-slate-400">Whisper Models</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400 mb-1">
              {systemStatus.llmModels.filter(m => m.available).length}/{systemStatus.llmModels.length}
            </div>
            <div className="text-sm text-slate-400">LLM Models</div>
          </div>
        </div>
      </div>
    </div>
  );
}
