<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';

  export let branch: string | undefined;
  export let branchOptions: string[] | undefined;
  export let onSelect: (branch: string) => void;
  export let isLoading: boolean;

  let index: number;
  $: {
    if (branch && branchOptions) {
      index = branchOptions.indexOf(branch);
    }
  }
</script>

{#if branchOptions && branch}
  <div class="flex items-center gap-2">
    <Button
      variant="ghost"
      size="icon"
      class="size-6 p-1"
      on:click={() => {
        const prevBranch = branchOptions[index - 1];
        if (prevBranch) {
          onSelect(prevBranch);
        }
      }}
      disabled={isLoading || index === 0}
    >
      <ChevronLeft />
    </Button>
    <span class="text-sm">
      {index + 1} / {branchOptions.length}
    </span>
    <Button
      variant="ghost"
      size="icon"
      class="size-6 p-1"
      on:click={() => {
        const nextBranch = branchOptions[index + 1];
        if (nextBranch) {
          onSelect(nextBranch);
        }
      }}
      disabled={isLoading || index === branchOptions.length - 1}
    >
      <ChevronRight />
    </Button>
  </div>
{/if}
