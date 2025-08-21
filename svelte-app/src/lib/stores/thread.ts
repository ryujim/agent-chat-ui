import { writable, get } from 'svelte/store';
import { Client } from '@langchain/langgraph-sdk/client';
import { configStore } from './config';
import type { Thread } from '@langchain/langgraph-sdk';
import { validate } from 'uuid';

type ThreadState = {
  threads: Thread[];
  isLoading: boolean;
  error: Error | null;
};

function getThreadSearchMetadata(
  assistantId: string,
): { graph_id: string } | { assistant_id: string } {
  if (validate(assistantId)) {
    return { assistant_id: assistantId };
  } else {
    return { graph_id: assistantId };
  }
}

function createThreadStore() {
  const { subscribe, set, update } = writable<ThreadState>({
    threads: [],
    isLoading: false,
    error: null,
  });

  async function getThreads() {
    const config = get(configStore);
    if (!config.apiUrl || !config.assistantId) return;

    update((s) => ({ ...s, isLoading: true, error: null }));

    try {
      const client = new Client({
        apiUrl: config.apiUrl,
        apiKey: config.apiKey ?? undefined,
      });

      const threads = await client.threads.search({
        metadata: getThreadSearchMetadata(config.assistantId),
        limit: 100,
      });

      update((s) => ({ ...s, threads, isLoading: false }));
    } catch (error) {
      update((s) => ({ ...s, error: error as Error, isLoading: false }));
    }
  }

  return {
    subscribe,
    getThreads,
  };
}

export const threadStore = createThreadStore();
