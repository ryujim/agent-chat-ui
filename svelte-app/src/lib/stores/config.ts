import { writable } from 'svelte/store';

export type Config = {
  apiUrl: string;
  assistantId: string;
  apiKey: string | null;
};

const DEFAULT_API_URL = 'http://localhost:2024';
const DEFAULT_ASSISTANT_ID = 'agent';

function createConfigStore() {
  const isBrowser = typeof window !== 'undefined';

  const initialApiUrl = (isBrowser && localStorage.getItem('lg:chat:apiUrl')) || DEFAULT_API_URL;
  const initialAssistantId = (isBrowser && localStorage.getItem('lg:chat:assistantId')) || DEFAULT_ASSISTANT_ID;
  const initialApiKey = (isBrowser && localStorage.getItem('lg:chat:apiKey')) || null;

  const { subscribe, set, update } = writable<Config>({
    apiUrl: initialApiUrl,
    assistantId: initialAssistantId,
    apiKey: initialApiKey,
  });

  return {
    subscribe,
    setConfig: (newConfig: Partial<Config>) => {
      update((currentConfig) => {
        const updatedConfig = { ...currentConfig, ...newConfig };
        if (isBrowser) {
          localStorage.setItem('lg:chat:apiUrl', updatedConfig.apiUrl);
          localStorage.setItem('lg:chat:assistantId', updatedConfig.assistantId);
          if (updatedConfig.apiKey) {
            localStorage.setItem('lg:chat:apiKey', updatedConfig.apiKey);
          } else {
            localStorage.removeItem('lg:chat:apiKey');
          }
        }
        return updatedConfig;
      });
    },
  };
}

export const configStore = createConfigStore();
