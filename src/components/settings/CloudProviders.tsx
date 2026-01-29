import { useState } from 'react';
import { Key, Check, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { useAppStore } from '../../lib/store';

interface CloudProvider {
  id: 'gemini' | 'openai' | 'anthropic';
  name: string;
  description: string;
  models: {
    id: string;
    name: string;
    context: string;
    pricing: string;
  }[];
  apiKeyUrl: string;
  apiKeyPrefix: string;
}

const providers: CloudProvider[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Large context window, great for long videos',
    models: [
      { id: 'gemini-3.0-ultra', name: 'Gemini 3.0 Ultra', context: '2M tokens', pricing: '$7.00/1M input tokens' },
      { id: 'gemini-3.0-pro', name: 'Gemini 3.0 Pro', context: '2M tokens', pricing: '$4.00/1M input tokens' },
      { id: 'gemini-3.0-flash', name: 'Gemini 3.0 Flash', context: '1M tokens', pricing: '$0.50/1M input tokens' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', context: '1M tokens', pricing: 'Free tier available' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', context: '2M tokens', pricing: '$3.50/1M input tokens' }
    ],
    apiKeyUrl: 'https://makersuite.google.com/app/apikey',
    apiKeyPrefix: 'AIzaSy'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Industry-leading GPT models',
    models: [
      { id: 'gpt-5.2', name: 'GPT-5.2', context: '256K tokens', pricing: '$20.00/1M input tokens' },
      { id: 'gpt-5.2-mini', name: 'GPT-5.2 Mini', context: '256K tokens', pricing: '$8.00/1M input tokens' },
      { id: 'gpt-4o', name: 'GPT-4o', context: '128K tokens', pricing: '$5.00/1M input tokens' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', context: '128K tokens', pricing: '$0.15/1M input tokens' },
      { id: 'o1', name: 'o1', context: '200K tokens', pricing: '$15.00/1M input tokens' },
      { id: 'o1-mini', name: 'o1 Mini', context: '128K tokens', pricing: '$3.00/1M input tokens' }
    ],
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    apiKeyPrefix: 'sk-'
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Excellent reasoning and analysis',
    models: [
      { id: 'claude-4.5-opus', name: 'Claude 4.5 Opus', context: '400K tokens', pricing: '$18.00/1M input tokens' },
      { id: 'claude-4.5-sonnet', name: 'Claude 4.5 Sonnet', context: '400K tokens', pricing: '$5.00/1M input tokens' },
      { id: 'claude-4.5-haiku', name: 'Claude 4.5 Haiku', context: '300K tokens', pricing: '$1.20/1M input tokens' },
      { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', context: '200K tokens', pricing: '$3.00/1M input tokens' },
      { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', context: '200K tokens', pricing: '$0.80/1M input tokens' }
    ],
    apiKeyUrl: 'https://console.anthropic.com/settings/keys',
    apiKeyPrefix: 'sk-ant-'
  }
];

export function CloudProviders() {
  const { apiKeys, setApiKey } = useAppStore();
  const [localKeys, setLocalKeys] = useState({
    gemini: apiKeys.gemini || '',
    openai: apiKeys.openai || '',
    anthropic: apiKeys.anthropic || ''
  });
  const [showKeys, setShowKeys] = useState({
    gemini: false,
    openai: false,
    anthropic: false
  });
  const [selectedModels, setSelectedModels] = useState({
    gemini: 'gemini-3.0-flash',
    openai: 'gpt-4o-mini',
    anthropic: 'claude-4.5-haiku'
  });

  const handleSave = (providerId: 'gemini' | 'openai' | 'anthropic') => {
    if (localKeys[providerId]) {
      setApiKey(providerId, localKeys[providerId]);
      alert(`${providers.find(p => p.id === providerId)?.name} API key saved successfully!`);
    }
  };

  return (
    <div className="space-y-6">
      {providers.map((provider) => (
        <div key={provider.id} className="bg-[#0F1115] border border-slate-800 rounded-xl p-6">
          {/* Provider Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold">{provider.name}</h3>
              {apiKeys[provider.id] && (
                <span className="px-3 py-1 bg-emerald-900/30 text-emerald-400 text-xs rounded border border-emerald-600/30 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Configured
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400">{provider.description}</p>
          </div>

          {/* API Key Input */}
          <div className="mb-6">
            <label className="block mb-2">
              <span className="text-sm font-medium text-slate-300">API Key</span>
              <div className="relative mt-2">
                <input
                  type={showKeys[provider.id] ? 'text' : 'password'}
                  value={localKeys[provider.id]}
                  onChange={(e) => setLocalKeys({ ...localKeys, [provider.id]: e.target.value })}
                  placeholder={`${provider.apiKeyPrefix}...`}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 pr-10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-600"
                />
                <button
                  onClick={() => setShowKeys({ ...showKeys, [provider.id]: !showKeys[provider.id] })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showKeys[provider.id] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </label>

            <div className="flex items-center gap-3 mt-2">
              <a
                href={provider.apiKeyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                Get your {provider.name} API key
                <ExternalLink className="w-3 h-3" />
              </a>
              {localKeys[provider.id] && (
                <button
                  onClick={() => handleSave(provider.id)}
                  className="ml-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
              )}
            </div>
          </div>

          {/* Available Models */}
          <div>
            <div className="text-sm font-medium text-slate-300 mb-3">Available Models</div>
            <div className="space-y-2">
              {provider.models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModels({ ...selectedModels, [provider.id]: model.id })}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    selectedModels[provider.id] === model.id
                      ? 'border-indigo-600 bg-indigo-600/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedModels[provider.id] === model.id
                          ? 'border-indigo-600'
                          : 'border-slate-600'
                      }`}
                    >
                      {selectedModels[provider.id] === model.id && (
                        <div className="w-3 h-3 rounded-full bg-indigo-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm">{model.name}</div>
                      <div className="text-xs text-slate-400">
                        {model.context} context • {model.pricing}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Security Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Key className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium mb-1 text-emerald-400">Secure & Private</div>
            <div className="text-sm text-slate-400 space-y-2">
              <p>
                Your API keys are encrypted and stored locally on your device. They are only used to communicate directly with the respective AI providers.
              </p>
              <p>
                CourseWeaver never sends your keys to our servers. All AI processing happens directly between your app and the provider's API.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}