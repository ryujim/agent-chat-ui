<script lang="ts">
	import { unknownToPrettyDate, isArrayOfMessages, baseMessageObject } from '../utils';
	import MarkdownText from '../../MarkdownText.svelte';
	import MessagesRenderer from './MessagesRenderer.svelte';
	import StateViewObject from './StateViewObject.svelte';

	let { value, expanded = true } = $props<{
		value: unknown;
		expanded?: boolean;
	}>();

	const date = unknownToPrettyDate(value);
</script>

{#if date}
	<p class="font-light text-gray-600">{date}</p>
{:else if typeof value === 'string' || typeof value === 'number'}
	<MarkdownText source={String(value)} />
{:else if typeof value === 'boolean'}
	<MarkdownText source={JSON.stringify(value)} />
{:else if value == null}
	<p class="font-light whitespace-pre-wrap text-gray-600">null</p>
{:else if Array.isArray(value)}
	{#if value.length > 0 && isArrayOfMessages(value)}
		<MessagesRenderer messages={value} />
	{:else}
		<div class="flex w-full flex-row items-start justify-start gap-1">
			<span class="font-normal text-black">[</span>
			{#each value as item, idx}
				{@const itemRenderValue = baseMessageObject(item)}
				<div class="flex w-full flex-row items-start whitespace-pre-wrap">
					<svelte:self value={itemRenderValue} />
					{#if idx < value.length - 1}
						<span class="font-normal text-black">,&nbsp;</span>
					{/if}
				</div>
			{/each}
			<span class="font-normal text-black">]</span>
		</div>
	{/if}
{:else if typeof value === 'object'}
	{#if Object.keys(value).length === 0}
		<p class="font-light text-gray-600">{"{}"}</p>
	{:else}
		<div class="relative ml-6 flex w-full flex-col items-start justify-start gap-1">
			<!-- Vertical line -->
			<div class="absolute top-0 left-[-24px] h-full w-[1px] bg-gray-200" />

			{#each Object.entries(value) as [key, val], idx}
				<div class="relative w-full">
					<!-- Horizontal connector line -->
					<div class="absolute top-[10px] left-[-20px] h-[1px] w-[18px] bg-gray-200" />
					<StateViewObject {expanded} keyName={key} value={val} />
				</div>
			{/each}
		</div>
	{/if}
{/if}
