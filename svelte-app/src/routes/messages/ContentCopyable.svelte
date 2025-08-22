<script lang="ts">
  import TooltipIconButton from "../TooltipIconButton.svelte";
  import { Copy, CopyCheck } from 'lucide-svelte';
  import { fade } from 'svelte/transition';

  export let content: string;
  export let disabled: boolean;

  let copied = false;

  function handleCopy() {
    navigator.clipboard.writeText(content);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }
</script>

<TooltipIconButton
  on:click={handleCopy}
  variant="ghost"
  tooltip="Copy content"
  {disabled}
>
  {#if copied}
    <div transition:fade={{ duration: 150 }}>
      <CopyCheck class="text-green-500" />
    </div>
  {:else}
    <div transition:fade={{ duration: 150 }}>
      <Copy />
    </div>
  {/if}
</TooltipIconButton>
