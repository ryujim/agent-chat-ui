<script lang="ts">
  import type { Message } from '@langchain/langgraph-sdk';
  import { getContentString } from '$lib/utils';
  import { cn } from '$lib/utils';

  export let message: Message;

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
  </div>
</div>
