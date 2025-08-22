<script lang="ts">
  import type { Base64ContentBlock } from '@langchain/langgraph-sdk';
  import MultimodalPreview from './messages/MultimodalPreview.svelte';
  import { cn } from '$lib/utils';

  export let blocks: Base64ContentBlock[];
  export let onRemove: (idx: number) => void;
  export let size: 'sm' | 'md' | 'lg' = 'md';
  let className: string | undefined = undefined;
  export { className as class };
</script>

{#if blocks.length > 0}
  <div class={cn("flex flex-wrap gap-2 p-3.5 pb-0", className)}>
    {#each blocks as block, idx (idx)}
      <MultimodalPreview
        {block}
        removable
        onRemove={() => onRemove(idx)}
        {size}
      />
    {/each}
  </div>
{/if}
