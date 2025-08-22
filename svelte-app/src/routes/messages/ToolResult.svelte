<script lang="ts">
  import type { ToolMessage } from '@langchain/langgraph-sdk';
  import { slide } from 'svelte/transition';
  import { ChevronDown, ChevronUp } from 'lucide-svelte';

  export let message: ToolMessage;

  let isExpanded = false;

  function isComplexValue(value: any): boolean {
    return Array.isArray(value) || (typeof value === 'object' && value !== null);
  }

  let parsedContent: any;
  let isJsonContent = false;
  $: {
    try {
      if (typeof message.content === 'string') {
        parsedContent = JSON.parse(message.content);
        isJsonContent = isComplexValue(parsedContent);
      } else {
        parsedContent = message.content;
      }
    } catch {
      parsedContent = message.content;
      isJsonContent = false;
    }
  }

  let contentStr: string;
  $: contentStr = isJsonContent ? JSON.stringify(parsedContent, null, 2) : String(message.content);

  let contentLines: string[];
  $: contentLines = contentStr.split('\n');

  let shouldTruncate: boolean;
  $: shouldTruncate = contentLines.length > 4 || contentStr.length > 500;

  let truncatedContent: string;
  $: truncatedContent = shouldTruncate
      ? contentStr.length > 500
        ? contentStr.slice(0, 500) + '...'
        : contentLines.slice(0, 4).join('\n') + '\n...'
      : contentStr;
</script>

<div class="mx-auto grid max-w-3xl grid-rows-[1fr_auto] gap-2">
  <div class="overflow-hidden rounded-lg border border-gray-200">
    <div class="border-b border-gray-200 bg-gray-50 px-4 py-2">
      <div class="flex flex-wrap items-center justify-between gap-2">
        {#if message.name}
          <h3 class="font-medium text-gray-900">
            Tool Result: <code class="rounded bg-gray-100 px-2 py-1">{message.name}</code>
          </h3>
        {:else}
          <h3 class="font-medium text-gray-900">Tool Result</h3>
        {/if}
        {#if message.tool_call_id}
          <code class="ml-2 rounded bg-gray-100 px-2 py-1 text-sm">{message.tool_call_id}</code>
        {/if}
      </div>
    </div>
    <div class="min-w-full bg-gray-100">
      <div class="p-3">
        {#if isExpanded}
          <div transition:slide>
            {#if isJsonContent}
              <table class="min-w-full divide-y divide-gray-200">
                <tbody class="divide-y divide-gray-200">
                  {#each Object.entries(parsedContent) as [key, value]}
                    <tr>
                      <td class="px-4 py-2 text-sm font-medium whitespace-nowrap text-gray-900">{key}</td>
                      <td class="px-4 py-2 text-sm text-gray-500">
                        {#if isComplexValue(value)}
                          <code class="rounded bg-gray-50 px-2 py-1 font-mono text-sm break-all">{JSON.stringify(value, null, 2)}</code>
                        {:else}
                          {String(value)}
                        {/if}
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            {:else}
              <code class="block text-sm">{contentStr}</code>
            {/if}
          </div>
        {:else}
          <code class="block text-sm">{truncatedContent}</code>
        {/if}
      </div>
      {#if shouldTruncate}
        <button
          on:click={() => (isExpanded = !isExpanded)}
          class="flex w-full cursor-pointer items-center justify-center border-t-[1px] border-gray-200 py-2 text-gray-500 transition-all duration-200 ease-in-out hover:bg-gray-50 hover:text-gray-600"
        >
          {#if isExpanded}
            <ChevronUp />
          {:else}
            <ChevronDown />
          {/if}
        </button>
      {/if}
    </div>
  </div>
</div>
