<script lang="ts">
  import { slide } from 'svelte/transition';
  import { ChevronDown, ChevronUp } from 'lucide-svelte';

  export let interrupt: Record<string, any> | Record<string, any>[];

  let isExpanded = false;

  function isComplexValue(value: any): boolean {
    return Array.isArray(value) || (typeof value === 'object' && value !== null);
  }

  let contentStr: string;
  $: contentStr = JSON.stringify(interrupt, null, 2);

  let contentLines: string[];
  $: contentLines = contentStr.split('\n');

  let shouldTruncate: boolean;
  $: shouldTruncate = contentLines.length > 4 || contentStr.length > 500;

  let displayEntries: [string, any][];
  $: {
    if (Array.isArray(interrupt)) {
      displayEntries = (isExpanded ? interrupt : interrupt.slice(0, 5)).map((item, i) => [i.toString(), item]);
    } else {
      const entries = Object.entries(interrupt);
      displayEntries = entries;
    }
  }
</script>

<div class="overflow-hidden rounded-lg border border-gray-200">
  <div class="border-b border-gray-200 bg-gray-50 px-4 py-2">
    <h3 class="font-medium text-gray-900">Human Interrupt</h3>
  </div>
  <div class="min-w-full bg-gray-100">
    {#if isExpanded}
      <div class="p-3" transition:slide>
        <table class="min-w-full divide-y divide-gray-200">
          <tbody class="divide-y divide-gray-200">
            {#each displayEntries as [key, value]}
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
      </div>
    {:else}
      <div class="p-3">
        <table class="min-w-full divide-y divide-gray-200">
          <tbody class="divide-y divide-gray-200">
            {#each displayEntries.slice(0, 4) as [key, value]}
              <tr>
                <td class="px-4 py-2 text-sm font-medium whitespace-nowrap text-gray-900">{key}</td>
                <td class="px-4 py-2 text-sm text-gray-500">
                  {#if isComplexValue(value)}
                    <code class="rounded bg-gray-50 px-2 py-1 font-mono text-sm break-all">{JSON.stringify(value, null, 2).slice(0,100)}...</code>
                  {:else}
                    {String(value).slice(0, 100)}{#if String(value).length > 100}...{/if}
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}

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
