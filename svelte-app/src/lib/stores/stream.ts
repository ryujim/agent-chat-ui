import { writable } from 'svelte/store';
import { Client } from '@langchain/langgraph-sdk/client';
import { configStore, type Config } from './config';
import type { Message } from '@langchain/langgraph-sdk';
// Re-implemented from @langchain/langgraph-sdk to avoid deep import issues
export type UIMessage = {
  id: string;
  type: 'ui';
  name: string;
  props: Record<string, unknown>;
  metadata: {
    message_id?: string;
    merge?: boolean;
  };
};

export function isUIMessage(message: any): message is UIMessage {
    if (typeof message !== "object" || message == null)
        return false;
    if (!("type" in message))
        return false;
    return message.type === "ui";
}
export function isRemoveUIMessage(message: any): message is { type: 'remove-ui', id: string } {
    if (typeof message !== "object" || message == null)
        return false;
    if (!("type" in message))
        return false;
    return message.type === "remove-ui";
}
export function uiMessageReducer(state: UIMessage[], update: any): UIMessage[] {
    const events = Array.isArray(update) ? update : [update];
    let newState = state.slice();
    for (const event of events) {
        if (event.type === "remove-ui") {
            newState = newState.filter((ui) => ui.id !== event.id);
            continue;
        }
        const index = state.findIndex((ui) => ui.id === event.id);
        if (index !== -1) {
            newState[index] = event.metadata.merge
                ? { ...event, props: { ...state[index].props, ...event.props } }
                : event;
        }
        else {
            newState.push(event);
        }
    }
    return newState;
}


type StreamState = {
  messages: Message[];
  uiMessages: UIMessage[];
  isLoading: boolean;
  error: Error | null;
  runId: string | null;
  interrupt: any | null;
  branch: string | undefined;
  branchOptions: string[] | undefined;
};

function createStreamStore() {
  const { subscribe, set, update } = writable<StreamState>({
    messages: [],
    uiMessages: [],
    isLoading: false,
    error: null,
    runId: null,
    interrupt: null,
    branch: undefined,
    branchOptions: undefined,
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
          update((s) => ({
            ...s,
            messages: chunk.data.messages,
            branch: chunk.data.branch,
            branchOptions: chunk.data.branchOptions,
          }));
        } else if (isUIMessage(chunk.data) || isRemoveUIMessage(chunk.data)) {
          update((s) => ({
            ...s,
            uiMessages: uiMessageReducer(s.uiMessages, chunk.data),
          }));
        } else if (chunk.event === 'interrupt') {
          update((s) => ({ ...s, interrupt: chunk.data }));
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

  function setBranch(branch: string) {
    // This is a simplified implementation. The original code is more complex.
    // I will need to revisit this.
    submit(null, { branch });
  }

  return {
    subscribe,
    submit,
    stop,
    setBranch,
  };
}

export const streamStore = createStreamStore();
