<script lang="ts">
  import type { Message, AIMessage, ToolMessage } from '@langchain/langgraph-sdk';
  import { getContentString } from '$lib/utils';
  import MarkdownText from './MarkdownText.svelte';
  import ToolCalls from './ToolCalls.svelte';
  import ToolResult from './ToolResult.svelte';
  import GenericInterrupt from './GenericInterrupt.svelte';
  import { page } from '$app/stores';
  import { streamStore } from '$lib/stores/stream';
  import { artifactStore } from '$lib/stores/artifact';
  import { Button } from '$lib/components/ui/button';

  export let message: Message | undefined;
  export let handleRegenerate: (parentCheckpoint: any) => void;

  $: hideToolCalls = $page.url.searchParams.get('hideToolCalls') === 'true';

  let contentString: string;
  $: contentString = message ? getContentString(message.content) : '';

  let toolCalls: AIMessage['tool_calls'] | undefined;
  $: toolCalls = message && 'tool_calls' in message ? message.tool_calls : undefined;

  let isToolResult: boolean;
  $: isToolResult = message?.type === 'tool';

  let uiMessages: any[];
  $: uiMessages = message ? $streamStore.uiMessages.filter(ui => ui.metadata?.message_id === message.id) : [];

  let isLastMessage: boolean;
  $: isLastMessage = $streamStore.messages[$streamStore.messages.length - 1]?.id === message?.id;

  let hasNoAIOrToolMessages: boolean;
  $: hasNoAIOrToolMessages = !$streamStore.messages.find(m => m.type === 'ai' || m.type === 'tool');

  let interruptValue: any;
  $: interruptValue = $streamStore.interrupt;
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

      {#if interruptValue && (isLastMessage || hasNoAIOrToolMessages)}
        <GenericInterrupt interrupt={interruptValue} />
      {/if}

      <!-- TODO: Interrupt component -->

      <div class="mr-auto flex items-center gap-2 transition-opacity opacity-0 group-focus-within:opacity-100 group-hover:opacity-100">
        <BranchSwitcher
          branch={$streamStore.branch}
          branchOptions={$streamStore.branchOptions}
          onSelect={(branch) => streamStore.setBranch(branch)}
          isLoading={$streamStore.isLoading}
        />
        <CommandBar
          content={contentString}
          isLoading={$streamStore.isLoading}
          isAiMessage={true}
          handleRegenerate={() => handleRegenerate(message?.parent_checkpoint)}
        />
      </div>
    {/if}
  </div>
</div>
