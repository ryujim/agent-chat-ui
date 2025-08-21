<script lang="ts">
	import TooltipIconButton from "../tooltip-icon-button.svelte";
	import { Copy, CopyCheck } from "lucide-svelte";
	import { fade } from "svelte/transition";

	let {
		content,
		disabled,
	} = $props<{
		content: string;
		disabled: boolean;
	}>();

	let copied = $state(false);

	function handleCopy(e: MouseEvent) {
		e.stopPropagation();
		navigator.clipboard.writeText(content);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<TooltipIconButton
	onclick={handleCopy}
	variant="ghost"
	tooltip="Copy content"
	{disabled}
>
	{#if copied}
		<div transition:fade|global={{ duration: 150 }}>
			<CopyCheck class="text-green-500" />
		</div>
	{:else}
		<div transition:fade|global={{ duration: 150 }}>
			<Copy />
		</div>
	{/if}
</TooltipIconButton>
