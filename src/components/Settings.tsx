import { useState } from 'react';
import { Settings as SettingsIcon, Cpu, HardDrive, Key, Cloud } from 'lucide-react';
import { SystemScanner } from './settings/SystemScanner';
import { CloudProviders } from './settings/CloudProviders';
import { useAppStore } from '../lib/store';

type SettingsTab = 'system' | 'cloud' | 'storage';

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('system');
  const [storagePreference, setStoragePreference] = useState<'full' | 'stream'>('stream');

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2 sm:gap-3">
          <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-slate-400" />
          <span className="hidden sm:inline">Settings</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-400">Manage local tools, models, and cloud API configurations</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 border-b border-slate-800 min-w-max">
          <button
            onClick={() => setActiveTab('system')}
            className={`px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
              activeTab === 'system'
                ? 'border-indigo-600 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline text-sm md:text-base">System Tools & Models</span>
          </button>
          <button
            onClick={() => setActiveTab('cloud')}
            className={`px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
              activeTab === 'cloud'
                ? 'border-indigo-600 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline text-sm md:text-base">Cloud Providers</span>
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
              activeTab === 'storage'
                ? 'border-indigo-600 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline text-sm md:text-base">Storage & Sync</span>
          </button>
        </div>
      </div>

      {/* System Tools & Models Tab */}
      {activeTab === 'system' && (
        <div className="max-w-6xl">
          <SystemScanner />
        </div>
      )}

      {/* Cloud Providers Tab */}
      {activeTab === 'cloud' && (
        <div className="max-w-4xl">
          <CloudProviders />
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
          </div>
        </div>
      )}
    </div>
  );
}