<script lang="ts">
  import type { Message } from '@langchain/langgraph-sdk';
  import { getContentString } from '$lib/utils';
  import { cn } from '$lib/utils';
  import CommandBar from './CommandBar.svelte';

  export let message: Message;
  export let isLoading: boolean;

  const contentString = getContentString(message.content);
</script>

<div class="group ml-auto flex items-center gap-2">
  <div class="flex flex-col gap-2">
    <div class="flex flex-col gap-2">
      <!-- TODO: Implement MultimodalPreview -->
      {#if Array.isArray(message.content)}
        <div class="flex flex-wrap items-end justify-end gap-2">
          <!-- Placeholder for images/files -->
        </div>
      {/if}

      {#if contentString}
        <p class="bg-muted ml-auto w-fit rounded-3xl px-4 py-2 text-right whitespace-pre-wrap">
          {contentString}
        </p>
      {/if}
    </div>
    <div class="ml-auto flex items-center gap-2 transition-opacity opacity-0 group-focus-within:opacity-100 group-hover:opacity-100">
      <CommandBar
        content={contentString}
        {isLoading}
        isHumanMessage={true}
      />
    </div>
  </div>
</div>
