<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	let {
		branch,
		branchOptions,
		onSelect,
		isLoading,
	} = $props<{
		branch: string | undefined;
		branchOptions: string[] | undefined;
		onSelect: (branch: string) => void;
		isLoading: boolean;
	}>();

	const index = $derived(branchOptions?.indexOf(branch ?? '') ?? -1);
</script>

{#if branchOptions && branch}
	<div class="flex items-center gap-2">
		<Button
			variant="ghost"
			size="icon"
			class="size-6 p-1"
			onclick={() => {
				const prevBranch = branchOptions[index - 1];
				if (!prevBranch) return;
				onSelect(prevBranch);
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
			onclick={() => {
				const nextBranch = branchOptions[index + 1];
				if (!nextBranch) return;
				onSelect(nextBranch);
			}}
			disabled={isLoading || index === branchOptions.length - 1}
		>
			<ChevronRight />
		</Button>
	</div>
{/if}
