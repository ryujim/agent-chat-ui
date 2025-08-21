import { Client, type Message } from '@langchain/langgraph-sdk';

export function createStreamStore(
  apiUrl: string,
  apiKey: string | null,
  assistantId: string,
  threadId: string | null
) {
  const state = $state({
    messages: [] as Message[],
    isLoading: false,
    error: null as Error | null,
  });

  const client = new Client({
    apiUrl,
    apiKey: apiKey ?? undefined,
    assistantId,
    threadId: threadId ?? null,
  });

  const submit = async (messages: Message[]) => {
    state.isLoading = true;
    state.error = null;
    try {
      const streamResponse = await client.invoke({ messages });
      for await (const chunk of streamResponse) {
          state.messages.push(chunk);
      }
    } catch (error) {
      state.error = error as Error;
    } finally {
      state.isLoading = false;
    }
  };

  const stop = () => {
    // TODO: Implement stop functionality
    console.log('Stopping stream');
  };

  return {
    state,
    submit,
    stop,
  };
}
