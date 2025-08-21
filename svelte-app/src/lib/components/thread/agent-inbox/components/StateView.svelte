<script lang="ts">
	import { X, ChevronsDownUp, ChevronsUpDown } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import MarkdownText from '../../MarkdownText.svelte';
	import StateViewObject from './StateViewObject.svelte';

	let {
		values,
		description,
		handleShowSidePanel,
		view,
	} = $props<{
		values: Record<string, any>;
		description: string | undefined;
		handleShowSidePanel: (showState: boolean, showDescription: boolean) => void;
		view: 'description' | 'state';
	}>();

	let expanded = $state(false);
</script>

{#if !values}
	<div>No state found</div>
{:else}
	<div
		class={cn(
			'flex w-full flex-row gap-0',
			view === 'state' &&
				'border-t-[1px] border-gray-100 lg:border-t-[0px] lg:border-l-[1px]'
		)}
	>
		{#if view === 'description'}
			<div class="pt-6 pb-2">
				<MarkdownText source={description ?? 'No description provided'} />
			</div>
		{/if}
		{#if view === 'state'}
			<div class="flex flex-col items-start justify-start gap-1">
				{#each Object.entries(values) as [k, v], idx}
					<StateViewObject {expanded} keyName={k} value={v} />
				{/each}
			</div>
		{/if}
		<div class="flex items-start justify-end gap-2">
			{#if view === 'state'}
				<Button
					onclick={() => (expanded = !expanded)}
					variant="ghost"
					class="text-gray-600"
					size="sm"
				>
					{#if expanded}
						<ChevronsUpDown class="h-4 w-4" />
					{:else}
						<ChevronsDownUp class="h-4 w-4" />
					{/if}
				</Button>
			{/if}

			<Button
				onclick={() => handleShowSidePanel(false, false)}
				variant="ghost"
				class="text-gray-600"
				size="sm"
			>
				<X class="h-4 w-4" />
			</Button>
		</div>
	</div>
{/if}
