<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { prettifyText } from '../utils';
	import StateViewRecursive from './StateViewRecursive.svelte';

	let {
		keyName,
		value,
		expanded: expandedProp = false,
	} = $props<{
		keyName: string;
		value: unknown;
		expanded?: boolean;
	}>();

	let expanded = $state(expandedProp);

	$effect(() => {
		expanded = expandedProp;
	});

	function hasContentsEllipsis() {
		return !expanded;
	}
</script>

<div class="relative flex flex-row items-start justify-start gap-2 text-sm">
	<div
		on:click={() => (expanded = !expanded)}
		class="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md text-gray-500 transition-colors ease-in-out hover:bg-gray-100 hover:text-black"
		style="transform: rotate({expanded ? 90 : 0}deg); transition: transform 0.2s;"
	>
		<ChevronRight class="h-4 w-4" />
	</div>
	<div class="flex w-full flex-col items-start justify-start gap-1">
		<p class="font-normal text-black">
			{prettifyText(keyName)}{' '}
			{#if hasContentsEllipsis()}
				<span
					on:click={() => (expanded = !expanded)}
					class="rounded-md p-[2px] font-mono text-[10px] leading-3 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer transition-colors ease-in-out inline-block -translate-y-[2px]"
				>
					{"{...}"}
				</span>
			{/if}
		</p>
		{#if expanded}
			<div transition:slide|global>
				<StateViewRecursive {expanded} value={value} />
			</div>
		{/if}
	</div>
</div>
