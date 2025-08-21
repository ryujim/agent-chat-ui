import { Client, type Thread } from '@langchain/langgraph-sdk';
import { validate } from 'uuid';

function getThreadSearchMetadata(
  assistantId: string,
): { graph_id: string } | { assistant_id: string } {
  if (validate(assistantId)) {
    return { assistant_id: assistantId };
  } else {
    return { graph_id: assistantId };
  }
}

export function createThreadStore(
  apiUrl: string,
  apiKey: string | null,
  assistantId: string
) {
  const state = $state({
    threads: [] as Thread[],
    threadsLoading: false,
  });

  const client = new Client({
    apiUrl,
    apiKey: apiKey ?? undefined,
  });

  const getThreads = async () => {
    if (!apiUrl || !assistantId) {
		state.threads = [];
		return;
	}

	state.threadsLoading = true;
    try {
      const threads = await client.threads.search({
        metadata: {
          ...getThreadSearchMetadata(assistantId),
        },
        limit: 100,
      });
      state.threads = threads;
    } catch (error) {
      console.error('Failed to fetch threads:', error);
      state.threads = [];
    } finally {
      state.threadsLoading = false;
    }
  };

  return {
    state,
    getThreads,
  };
}
