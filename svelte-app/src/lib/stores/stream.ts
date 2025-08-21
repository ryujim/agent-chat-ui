import { writable } from 'svelte/store';
import { Client } from '@langchain/langgraph-sdk/client';
import { configStore, type Config } from './config';
import type { Message } from '@langchain/langgraph-sdk';
import {
  uiMessageReducer,
  isUIMessage,
  isRemoveUIMessage,
  type UIMessage,
} from '@langchain/langgraph-sdk/dist/react-ui/types.js';

type StreamState = {
  messages: Message[];
  uiMessages: UIMessage[];
  isLoading: boolean;
  error: Error | null;
  runId: string | null;
};

function createStreamStore() {
  const { subscribe, set, update } = writable<StreamState>({
    messages: [],
    uiMessages: [],
    isLoading: false,
    error: null,
    runId: null,
  });

  let client: Client | null = null;
  let currentConfig: Config | null = null;

  configStore.subscribe((config) => {
    currentConfig = config;
    if (config.apiUrl && config.assistantId) {
      client = new Client({
        apiUrl: config.apiUrl,
        apiKey: config.apiKey ?? undefined,
      });
    }
  });

  async function submit(input: any, options?: any) {
    if (!client || !currentConfig) {
      update((s) => ({ ...s, error: new Error('Client not configured') }));
      return;
    }

    update((s) => ({ ...s, isLoading: true, error: null, messages: [...s.messages, ...input.messages] }));

    try {
      const stream = client.runs.stream(
        options?.threadId ?? null,
        currentConfig.assistantId,
        {
          input,
          ...options,
        }
      );

      for await (const chunk of stream) {
        if (chunk.event === 'metadata') {
          update((s) => ({ ...s, runId: chunk.data.run_id }));
        } else if (chunk.event === 'values') {
          update((s) => ({ ...s, messages: chunk.data.messages }));
        } else if (isUIMessage(chunk.data) || isRemoveUIMessage(chunk.data)) {
          update((s) => ({
            ...s,
            uiMessages: uiMessageReducer(s.uiMessages, chunk.data),
          }));
        } else if (chunk.event === 'end') {
          // Stream ended
        }
      }
    } catch (error) {
      update((s) => ({ ...s, error: error as Error }));
    } finally {
      update((s) => ({ ...s, isLoading: false }));
    }
  }

  function stop() {
    // TODO: Implement stream stopping logic
  }

  return {
    subscribe,
    submit,
    stop,
  };
}

export const streamStore = createStreamStore();
