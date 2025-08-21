<script lang="ts">
	import type { Base64ContentBlock } from '@langchain/core/messages';
	import MultimodalPreview from './MultimodalPreview.svelte';
	import { cn } from '$lib/utils';

	let {
		blocks,
		onRemove,
		size = 'md',
		className
	} = $props<{
		blocks: Base64ContentBlock[];
		onRemove: (idx: number) => void;
		size?: 'sm' | 'md' | 'lg';
		className?: string;
	}>();
</script>

{#if blocks.length}
	<div class={cn('flex flex-wrap gap-2 p-3.5 pb-0', className)}>
		{#each blocks as block, idx (block)}
			<MultimodalPreview
				{block}
				removable
				onRemove={() => onRemove(idx)}
				{size}
			/>
		{/each}
	</div>
{/if}
