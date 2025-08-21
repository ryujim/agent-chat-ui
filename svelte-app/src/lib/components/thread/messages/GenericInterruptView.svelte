<script lang="ts">
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	let { interrupt } = $props<{
		interrupt: Record<string, any> | Record<string, any>[];
	}>();

	let isExpanded = $state(false);

	const isComplexValue = (value: any): boolean => {
		return Array.isArray(value) || (typeof value === 'object' && value !== null);
	};

	const contentStr = JSON.stringify(interrupt, null, 2);
	const contentLines = contentStr.split('\n');
	const shouldTruncate = contentLines.length > 4 || contentStr.length > 500;

	const truncateValue = (value: any): any => {
		if (typeof value === 'string' && value.length > 100) {
			return value.substring(0, 100) + '...';
		}

		if (Array.isArray(value) && !isExpanded) {
			return value.slice(0, 2).map(truncateValue);
		}

		if (isComplexValue(value) && !isExpanded) {
			const strValue = JSON.stringify(value, null, 2);
			if (strValue.length > 100) {
				return `Truncated ${strValue.length} characters...`;
			}
		}

		return value;
	};

	const processEntries = () => {
		if (Array.isArray(interrupt)) {
			return isExpanded ? interrupt : interrupt.slice(0, 5);
		} else {
			const entries = Object.entries(interrupt);
			if (!isExpanded && shouldTruncate) {
				return entries.map(([key, value]) => [key, truncateValue(value)]);
			}
			return entries;
		}
	};

	const displayEntries = $derived(processEntries());
</script>

<div class="overflow-hidden rounded-lg border border-gray-200">
	<div class="border-b border-gray-200 bg-gray-50 px-4 py-2">
		<div class="flex flex-wrap items-center justify-between gap-2">
			<h3 class="font-medium text-gray-900">Human Interrupt</h3>
		</div>
	</div>
	<div class="min-w-full bg-gray-100">
		<div class="p-3" style="max-height: {isExpanded ? 'none' : '500px'}; overflow: auto;">
			<table class="min-w-full divide-y divide-gray-200">
				<tbody class="divide-y divide-gray-200">
					{#each displayEntries as item, argIdx}
						{@const [key, value] = Array.isArray(interrupt) ? [argIdx.toString(), item] : (item as [string, any])}
						<tr transition:slide|global>
							<td class="px-4 py-2 text-sm font-medium whitespace-nowrap text-gray-900">
								{key}
							</td>
							<td class="px-4 py-2 text-sm text-gray-500">
								{#if isComplexValue(value)}
									<code class="rounded bg-gray-50 px-2 py-1 font-mono text-sm">
										{JSON.stringify(value, null, 2)}
									</code>
								{:else}
									{String(value)}
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		{#if (shouldTruncate || (Array.isArray(interrupt) && interrupt.length > 5))}
			<button
				onclick={() => (isExpanded = !isExpanded)}
				class="flex w-full cursor-pointer items-center justify-center border-t-[1px] border-gray-200 py-2 text-gray-500 transition-all duration-200 ease-in-out hover:bg-gray-50 hover:text-gray-600"
			>
				{#if isExpanded}
					<ChevronUp />
				{:else}
					<ChevronDown />
				{/if}
			</button>
		{/if}
	</div>
</div>
