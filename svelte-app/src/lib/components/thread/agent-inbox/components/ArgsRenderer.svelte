<script lang="ts">
	import { prettifyText } from '../utils';
	import MarkdownText from '../../MarkdownText.svelte';

	let { args } = $props<{
		args: Record<string, any>;
	}>();
</script>

<div class="flex w-full flex-col items-start gap-6">
	{#each Object.entries(args) as [k, v]}
		{@const value =
			typeof v === 'string' || typeof v === 'number' ? v.toString() : JSON.stringify(v, null)}
		<div class="flex flex-col items-start gap-1">
			<p class="text-sm leading-[18px] text-wrap text-gray-600">
				{prettifyText(k)}:
			</p>
			<span class="w-full max-w-full rounded-xl bg-zinc-100 p-3 text-[13px] leading-[18px] text-black">
				<MarkdownText source={value} />
			</span>
		</div>
	{/each}
</div>
