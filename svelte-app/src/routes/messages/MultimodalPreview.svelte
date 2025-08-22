<script lang="ts">
  import type { Base64ContentBlock } from '@langchain/langgraph-sdk';
  import { File, X } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  export let block: Base64ContentBlock;
  export let removable = false;
  export let onRemove: (() => void) | undefined = undefined;
  export let size: 'sm' | 'md' | 'lg' = 'md';
  let className: string | undefined = undefined;
  export { className as class };

  let imageUrl: string | null = null;
  if (block.type === 'image' && block.source_type === 'base64') {
    imageUrl = `data:${block.mime_type};base64,${block.data}`;
  }
</script>

{#if block.type === 'image' && imageUrl}
  <div class={cn("relative inline-block", className)}>
    <img
      src={imageUrl}
      alt={String(block.metadata?.name || "uploaded image")}
      class={cn(
        "rounded-md object-cover",
        size === 'sm' && 'h-10 w-10',
        size === 'md' && 'h-16 w-16',
        size === 'lg' && 'h-24 w-24'
      )}
    />
    {#if removable}
      <button
        type="button"
        class="absolute top-1 right-1 z-10 rounded-full bg-gray-500 text-white hover:bg-gray-700"
        on:click={onRemove}
        aria-label="Remove image"
      >
        <X class="h-4 w-4" />
      </button>
    {/if}
  </div>
{:else if block.type === 'file' && block.mime_type === 'application/pdf'}
  <div class={cn("relative flex items-start gap-2 rounded-md border bg-gray-100 px-3 py-2", className)}>
    <File class={cn("text-teal-700", size === 'sm' ? 'h-5 w-5' : 'h-7 w-7')} />
    <span class="min-w-0 flex-1 text-sm break-all text-gray-800" style="word-break: break-all; white-space: pre-wrap;">
      {String(block.metadata?.filename || 'PDF file')}
    </span>
    {#if removable}
      <button
        type="button"
        class="ml-2 self-start rounded-full bg-gray-200 p-1 text-teal-700 hover:bg-gray-300"
        on:click={onRemove}
        aria-label="Remove PDF"
      >
        <X class="h-4 w-4" />
      </button>
    {/if}
  </div>
{:else}
  <!-- Fallback for unknown types -->
{/if}
