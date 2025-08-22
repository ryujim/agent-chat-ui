<script lang="ts">
  import type { AIMessage } from '@langchain/langgraph-sdk';

  export let toolCalls: AIMessage['tool_calls'];

  function isComplexValue(value: any): boolean {
    return Array.isArray(value) || (typeof value === 'object' && value !== null);
  }
</script>

{#if toolCalls && toolCalls.length > 0}
  <div class="mx-auto grid max-w-3xl grid-rows-[1fr_auto] gap-2">
    {#each toolCalls as tc, idx (tc.id || idx)}
      <div class="overflow-hidden rounded-lg border border-gray-200">
        <div class="border-b border-gray-200 bg-gray-50 px-4 py-2">
          <h3 class="font-medium text-gray-900">
            {tc.name}
            {#if tc.id}
              <code class="ml-2 rounded bg-gray-100 px-2 py-1 text-sm">
                {tc.id}
              </code>
            {/if}
          </h3>
        </div>
        {#if tc.args && Object.keys(tc.args).length > 0}
          <table class="min-w-full divide-y divide-gray-200">
            <tbody class="divide-y divide-gray-200">
              {#each Object.entries(tc.args) as [key, value], argIdx (key)}
                <tr>
                  <td class="px-4 py-2 text-sm font-medium whitespace-nowrap text-gray-900">
                    {key}
                  </td>
                  <td class="px-4 py-2 text-sm text-gray-500">
                    {#if isComplexValue(value)}
                      <code class="rounded bg-gray-50 px-2 py-1 font-mono text-sm break-all">
                        {JSON.stringify(value, null, 2)}
                      </code>
                    {:else}
                      {String(value)}
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        {:else}
          <code class="block p-3 text-sm">{"{}"}</code>
        {/if}
      </div>
    {/each}
  </div>
{/if}
