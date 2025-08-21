<script lang="ts">
	import TooltipIconButton from '../../tooltip-icon-button.svelte';
	import { Copy, CopyCheck } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let {
		threadId,
		showUUID = false,
	} = $props<{
		threadId: string;
		showUUID?: boolean;
	}>();

	let copied = $state(false);

	function handleCopy(e: MouseEvent) {
		e.stopPropagation();
		navigator.clipboard.writeText(threadId);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<TooltipIconButton
	onclick={handleCopy}
	variant="ghost"
	tooltip="Copy thread ID"
	class="flex w-fit flex-grow-0 cursor-pointer items-center gap-1 rounded-md border-[1px] border-gray-200 p-1 hover:bg-gray-50/90"
>
	<p class="font-mono text-xs">{showUUID ? threadId : 'ID'}</p>
	{#if copied}
		<div transition:fade|global={{ duration: 150 }}>
			<CopyCheck class="h-3 max-h-3 w-3 max-w-3 text-green-500" />
		</div>
	{:else}
		<div transition:fade|global={{ duration: 150 }}>
			<Copy class="h-3 max-h-3 w-3 max-w-3 text-gray-500" />
		</div>
	{/if}
</TooltipIconButton>
