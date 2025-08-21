<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	let {
		onShowState,
		onShowDescription,
		showingState,
		showingDescription,
	} = $props<{
		onShowState: () => void;
		onShowDescription: () => void;
		showingState: boolean;
		showingDescription: boolean;
	}>();
</script>

<div class="flex flex-row items-center justify-center gap-0">
	<Button
		variant="outline"
		class={cn(
			'rounded-l-md rounded-r-none border-r-[0px]',
			showingState ? 'text-black' : 'bg-white'
		)}
		size="sm"
		on:click={onShowState}
	>
		State
	</Button>
	<Button
		variant="outline"
		class={cn(
			'rounded-l-none rounded-r-md border-l-[0px]',
			showingDescription ? 'text-black' : 'bg-white'
		)}
		size="sm"
		on:click={onShowDescription}
	>
		Description
	</Button>
</div>
