import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppStore {
  offlineMode: boolean;
  sidebarCollapsed: boolean;
  selectedModel: string;
  apiKeys: {
    gemini?: string;
    openai?: string;
    anthropic?: string;
  };
  toggleOfflineMode: () => void;
  toggleSidebar: () => void;
  setSelectedModel: (model: string) => void;
  setApiKey: (provider: 'gemini' | 'openai' | 'anthropic', key: string) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      offlineMode: false,
      sidebarCollapsed: false,
      selectedModel: 'llama-3-8b',
      apiKeys: {},
      toggleOfflineMode: () => set((state) => ({ offlineMode: !state.offlineMode })),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSelectedModel: (model) => set({ selectedModel: model }),
      setApiKey: (provider, key) => set((state) => ({
        apiKeys: { ...state.apiKeys, [provider]: key }
      }))
    }),
    {
      name: 'courseweaver-storage',
    }
  )
);