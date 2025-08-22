<script lang="ts">
  import TooltipIconButton from '../TooltipIconButton.svelte';
  import ContentCopyable from './ContentCopyable.svelte';
  import { SendHorizontal, RefreshCcw, Pencil, XIcon } from 'lucide-svelte';

  export let content: string;
  export let isHumanMessage = false;
  export let isAiMessage = false;
  export let isEditing = false;
  export let setIsEditing: ((value: boolean) => void) | undefined = undefined;
  export let handleSubmitEdit: (() => void) | undefined = undefined;
  export let handleRegenerate: (() => void) | undefined = undefined;
  export let isLoading: boolean;

  if (isHumanMessage && isAiMessage) {
    throw new Error("Can only set one of isHumanMessage or isAiMessage to true, not both.");
  }
  if (!isHumanMessage && !isAiMessage) {
    throw new Error("One of isHumanMessage or isAiMessage must be set to true.");
  }
</script>

{#if isHumanMessage && isEditing}
  <div class="flex items-center gap-2">
    <TooltipIconButton
      disabled={isLoading}
      tooltip="Cancel edit"
      variant="ghost"
      on:click={() => setIsEditing?.(false)}
    >
      <XIcon />
    </TooltipIconButton>
    <TooltipIconButton
      disabled={isLoading}
      tooltip="Submit"
      variant="secondary"
      on:click={handleSubmitEdit}
    >
      <SendHorizontal />
    </TooltipIconButton>
  </div>
{:else}
  <div class="flex items-center gap-2">
    <ContentCopyable {content} disabled={isLoading} />
    {#if isAiMessage && handleRegenerate}
      <TooltipIconButton
        disabled={isLoading}
        tooltip="Refresh"
        variant="ghost"
        on:click={handleRegenerate}
      >
        <RefreshCcw />
      </TooltipIconButton>
    {/if}
    {#if isHumanMessage && setIsEditing}
      <TooltipIconButton
        disabled={isLoading}
        tooltip="Edit"
        variant="ghost"
        on:click={() => setIsEditing?.(true)}
      >
        <Pencil />
      </TooltipIconButton>
    {/if}
  </div>
{/if}
