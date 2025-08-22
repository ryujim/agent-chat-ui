<script lang="ts">
  import type { Message, AIMessage, ToolMessage } from '@langchain/langgraph-sdk';
  import { getContentString } from '$lib/utils';
  import MarkdownText from './MarkdownText.svelte';
  import ToolCalls from './ToolCalls.svelte';
  import ToolResult from './ToolResult.svelte';
  import { page } from '$app/stores';
  import { streamStore } from '$lib/stores/stream';
  import { artifactStore } from '$lib/stores/artifact';
  import { Button } from '$lib/components/ui/button';

  export let message: Message | undefined;

  $: hideToolCalls = $page.url.searchParams.get('hideToolCalls') === 'true';

  let contentString: string;
  $: contentString = message ? getContentString(message.content) : '';

  let toolCalls: AIMessage['tool_calls'] | undefined;
  $: toolCalls = message && 'tool_calls' in message ? message.tool_calls : undefined;

  let isToolResult: boolean;
  $: isToolResult = message?.type === 'tool';

  let uiMessages: any[];
  $: uiMessages = message ? $streamStore.uiMessages.filter(ui => ui.metadata?.message_id === message.id) : [];
</script>

<div class="group mr-auto flex items-start gap-2">
  <div class="flex flex-col gap-2">
    {#if isToolResult && !hideToolCalls}
      <ToolResult message={message as ToolMessage} />
    {:else if !isToolResult}
      {#if contentString.length > 0}
        <div class="py-1">
          <MarkdownText content={contentString} />
        </div>
      {/if}
      {#if !hideToolCalls && toolCalls && toolCalls.length > 0}
        <ToolCalls {toolCalls} />
      {/if}

      {#each uiMessages as uiMessage (uiMessage.id)}
        <Button on:click={() => artifactStore.open(uiMessage.name, uiMessage.props)}>
          Show {uiMessage.name}
        </Button>
      {/each}

      <!-- TODO: Interrupt component -->
      <!-- TODO: CommandBar and BranchSwitcher -->
    {/if}
  </div>
</div>
