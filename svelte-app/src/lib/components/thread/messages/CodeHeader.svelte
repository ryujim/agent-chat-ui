<script lang="ts">
	import TooltipIconButton from '../tooltip-icon-button.svelte';
	import { Copy, CopyCheck } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let {
		language,
		code,
	} = $props<{
		language?: string;
		code: string;
	}>();

	let copied = $state(false);

	function handleCopy() {
		if (!code || copied) return;
		navigator.clipboard.writeText(code);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div class="flex items-center justify-between gap-4 rounded-t-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
	<span class="lowercase">{language}</span>
	<TooltipIconButton
		tooltip="Copy"
		onclick={handleCopy}
	>
		{#if copied}
			<div transition:fade|global={{ duration: 150 }}>
				<CopyCheck />
			</div>
		{:else}
			<div transition:fade|global={{ duration: 150 }}>
				<Copy />
			</div>
		{/if}
	</TooltipIconButton>
</div>
