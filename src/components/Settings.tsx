import { useState } from 'react';
import { Settings as SettingsIcon, Download, Check, Cpu, HardDrive, Key, Database, Cloud, Zap } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { modelOptions } from '../lib/mockData';

type SettingsTab = 'models' | 'storage' | 'api-keys';

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('models');
  const { apiKeys, setApiKey } = useAppStore();
  const [geminiKey, setGeminiKey] = useState(apiKeys.gemini || '');
  const [openaiKey, setOpenaiKey] = useState(apiKeys.openai || '');
  const [downloadingModel, setDownloadingModel] = useState<string | null>(null);
  const [storagePreference, setStoragePreference] = useState<'full' | 'stream'>('stream');
  const [gpuOffload, setGpuOffload] = useState(true);

  const systemRAM = 16; // GB
  const usedRAM = 8; // GB
  const availableRAM = systemRAM - usedRAM;

  const handleDownloadModel = (modelId: string) => {
    setDownloadingModel(modelId);
    // Simulate download
    setTimeout(() => {
      setDownloadingModel(null);
    }, 3000);
  };

  const saveApiKeys = () => {
    if (geminiKey) setApiKey('gemini', geminiKey);
    if (openaiKey) setApiKey('openai', openaiKey);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 md:w-10 md:h-10 text-slate-400" />
          Settings
        </h1>
        <p className="text-slate-400">Manage models, storage, and API configurations</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 border-b border-slate-800 min-w-max">
          <button
            onClick={() => setActiveTab('models')}
            className={`px-4 md:px-6 py-3 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'models'
                ? 'border-indigo-600 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span className="text-sm md:text-base">Local LLM Manager</span>
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`px-4 md:px-6 py-3 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'storage'
                ? 'border-indigo-600 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span className="text-sm md:text-base">Storage & Sync</span>
          </button>
          <button
            onClick={() => setActiveTab('api-keys')}
            className={`px-4 md:px-6 py-3 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'api-keys'
                ? 'border-indigo-600 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span className="text-sm md:text-base">API Keys</span>
          </button>
        </div>
      </div>

      {/* Local LLM Manager Tab */}
      {activeTab === 'models' && (
        <div className="max-w-6xl">
          {/* Hardware Check */}
          <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-4 md:p-6 mb-6">
            <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              Hardware Status
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* RAM Usage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">System RAM</span>
                  <span className="text-sm font-medium">{availableRAM}GB / {systemRAM}GB</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${(availableRAM / systemRAM) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  We recommend 7B parameter models
                </p>
              </div>

              {/* GPU Offload */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-medium">GPU Acceleration</div>
                    <div className="text-xs text-slate-400">Metal (Apple Silicon)</div>
                  </div>
                  <button
                    onClick={() => setGpuOffload(!gpuOffload)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      gpuOffload ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                        gpuOffload ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  {gpuOffload ? 'Enabled - Faster inference' : 'Disabled - CPU only'}
                </p>
              </div>

              {/* Storage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Model Storage</span>
                  <span className="text-sm font-medium">12.4 GB used</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full transition-all" style={{ width: '25%' }} />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  450 GB available on disk
                </p>
              </div>
            </div>
          </div>

          {/* Model Library */}
          <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              Model Library
            </h3>

            <div className="space-y-3">
              {modelOptions.map((model) => (
                <div
                  key={model.id}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{model.name}</h4>
                        {model.type === 'cloud' ? (
                          <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded border border-blue-600/30">
                            Cloud
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 text-xs rounded border border-emerald-600/30">
                            Local
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        {model.type === 'local' && (
                          <>
                            <span>Size: {model.size}</span>
                            <span>•</span>
                            <span>Quantized (GGUF)</span>
                          </>
                        )}
                        {model.type === 'cloud' && (
                          <span>Requires API key for usage</span>
                        )}
                      </div>

                      {/* Download Progress */}
                      {downloadingModel === model.id && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-400">Downloading...</span>
                            <span className="text-xs text-indigo-400">67%</span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full transition-all animate-pulse" style={{ width: '67%' }} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-6">
                      {model.type === 'local' && model.downloaded && (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <Check className="w-5 h-5" />
                          <span className="text-sm font-medium">Downloaded</span>
                        </div>
                      )}
                      {model.type === 'local' && !model.downloaded && (
                        <button
                          onClick={() => handleDownloadModel(model.id)}
                          disabled={downloadingModel === model.id}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      )}
                      {model.type === 'cloud' && (
                        <button
                          onClick={() => setActiveTab('api-keys')}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm"
                        >
                          Configure
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Model Details */}
                  {model.type === 'local' && model.id === 'llama-3-8b' && (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-slate-400 mb-1">Parameters</div>
                          <div className="font-medium">8 Billion</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Context Length</div>
                          <div className="font-medium">8K tokens</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Quantization</div>
                          <div className="font-medium">Q4_K_M</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Recommended RAM</div>
                          <div className="font-medium">6-8 GB</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Storage & Sync Tab */}
      {activeTab === 'storage' && (
        <div className="max-w-4xl">
          <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-indigo-400" />
              Library Path
            </h3>
            <p className="text-slate-400 mb-4">
              Choose where course artifacts (PDFs, JSONs, Media) are stored locally
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value="~/Documents/CourseWeaver"
                readOnly
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-300"
              />
              <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                Change
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Current usage: 2.4 GB across 3 courses
            </p>
          </div>

          <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-indigo-400" />
              Sync Preferences
            </h3>
            <p className="text-slate-400 mb-6">
              Control how course content is stored and synced
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setStoragePreference('full')}
                className={`w-full flex items-start p-5 rounded-lg border-2 transition-all ${
                  storagePreference === 'full'
                    ? 'border-indigo-600 bg-indigo-600/10'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 mr-4 ${
                    storagePreference === 'full' ? 'border-indigo-600' : 'border-slate-600'
                  }`}
                >
                  {storagePreference === 'full' && (
                    <div className="w-3.5 h-3.5 rounded-full bg-indigo-600" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold mb-1 flex items-center gap-2">
                    Always keep video offline
                    <span className="px-2 py-0.5 bg-amber-900/30 text-amber-400 text-xs rounded">
                      High Disk Space
                    </span>
                  </div>
                  <div className="text-sm text-slate-400">
                    Downloads and stores all video content locally. Best for offline learning but requires more storage.
                  </div>
                </div>
              </button>

              <button
                onClick={() => setStoragePreference('stream')}
                className={`w-full flex items-start p-5 rounded-lg border-2 transition-all ${
                  storagePreference === 'stream'
                    ? 'border-indigo-600 bg-indigo-600/10'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 mr-4 ${
                    storagePreference === 'stream' ? 'border-indigo-600' : 'border-slate-600'
                  }`}
                >
                  {storagePreference === 'stream' && (
                    <div className="w-3.5 h-3.5 rounded-full bg-indigo-600" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold mb-1 flex items-center gap-2">
                    Stream video, keep notes offline
                    <span className="px-2 py-0.5 bg-emerald-900/30 text-emerald-400 text-xs rounded">
                      Recommended
                    </span>
                  </div>
                  <div className="text-sm text-slate-400">
                    Streams video content when online, stores transcripts and notes locally. Balanced approach.
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-6 p-4 bg-slate-900 rounded-lg">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium mb-1">Hybrid Sync Engine</div>
                  <div className="text-sm text-slate-400">
                    CourseWeaver automatically syncs course progress and notes across devices while respecting your storage preferences.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === 'api-keys' && (
        <div className="max-w-4xl">
          <div className="bg-[#0F1115] border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-400" />
              Cloud API Configuration
            </h3>
            <p className="text-slate-400 mb-6">
              Add API keys to use cloud-based AI models for processing. Your keys are stored locally and never sent to our servers.
            </p>

            {/* Gemini API Key */}
            <div className="mb-6">
              <label className="block mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Google Gemini API Key</span>
                  <span className="text-xs text-slate-500">(For Gemini 1.5 Pro)</span>
                </div>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-600"
                />
              </label>
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                Get your Gemini API key →
              </a>
            </div>

            {/* OpenAI API Key */}
            <div className="mb-6">
              <label className="block mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">OpenAI API Key</span>
                  <span className="text-xs text-slate-500">(For GPT-4o)</span>
                </div>
                <input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-600"
                />
              </label>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                Get your OpenAI API key →
              </a>
            </div>

            {/* Save Button */}
            <button
              onClick={saveApiKeys}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Save API Keys
            </button>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-800">
              <div className="flex items-start gap-3">
                <Key className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium mb-1 text-emerald-400">Secure & Private</div>
                  <div className="text-sm text-slate-400">
                    Your API keys are encrypted and stored locally on your device. They are only used to communicate directly with the respective AI providers.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}