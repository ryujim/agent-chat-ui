<script lang="ts">
  import type { Message } from '@langchain/langgraph-sdk';
  import { getContentString } from '$lib/utils';
  import MarkdownText from './MarkdownText.svelte';

  export let message: Message | undefined;

  let contentString: string;
  $: {
    contentString = message ? getContentString(message.content) : '';
  }
</script>

<div class="group mr-auto flex items-start gap-2">
  <div class="flex flex-col gap-2">
    {#if contentString.length > 0}
      <div class="py-1">
        <MarkdownText {contentString} />
      </div>
    {/if}
  </div>
</div>
