<script lang="ts">
	import type { Base64ContentBlock } from '@langchain/core/messages';
	import { File, X } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	let {
		block,
		removable = false,
		onRemove = () => {},
		className,
		size = 'md'
	} = $props<{
		block: Base64ContentBlock;
		removable?: boolean;
		onRemove?: () => void;
		className?: string;
		size?: 'sm' | 'md' | 'lg';
	}>();

	const isImage =
		block.type === 'image' &&
		(block.source as any).type === 'base64' &&
		typeof (block.source as any).media_type === 'string' &&
		(block.source as any).media_type.startsWith('image/');

	const isPdf =
		block.type === 'file' &&
		(block.source as any).type === 'base64' &&
		(block.source as any).media_type === 'application/pdf';
</script>

{#if isImage}
	<div class={cn('relative inline-block', className)}>
		<img
			src={`data:${(block.source as any).media_type};base64,${(block.source as any).data}`}
			alt={String(block.metadata?.name || 'uploaded image')}
			class={cn(
				'rounded-md object-cover text-lg',
				size === 'sm' ? 'h-10 w-10 text-base' : '',
				size === 'md' ? 'h-16 w-16' : '',
				size === 'lg' ? 'h-24 w-24 text-xl' : ''
			)}
			width={size === 'sm' ? 16 : size === 'md' ? 32 : 48}
			height={size === 'sm' ? 16 : size === 'md' ? 32 : 48}
		/>
		{#if removable}
			<button
				type="button"
				class="absolute top-1 right-1 z-10 rounded-full bg-gray-500 text-white hover:bg-gray-700"
				on:click={onRemove}
				aria-label="Remove image"
			>
				<X class="h-4 w-4" />
			</button>
		{/if}
	</div>
{:else if isPdf}
	<div class={cn('relative flex items-start gap-2 rounded-md border bg-gray-100 px-3 py-2', className)}>
		<div class="flex flex-shrink-0 flex-col items-start justify-start">
			<File class={cn('text-teal-700', size === 'sm' ? 'h-5 w-5' : 'h-7 w-7')} />
		</div>
		<span
			class="min-w-0 flex-1 text-sm break-all text-gray-800"
			style="word-break: break-all; white-space: pre-wrap;"
		>
			{String(block.metadata?.filename || block.metadata?.name || 'PDF file')}
		</span>
		{#if removable}
			<button
				type="button"
				class="ml-2 self-start rounded-full bg-gray-200 p-1 text-teal-700 hover:bg-gray-300"
				on:click={onRemove}
				aria-label="Remove PDF"
			>
				<X class="h-4 w-4" />
			</button>
		{/if}
	</div>
{:else}
	<div class={cn('flex items-center gap-2 rounded-md border bg-gray-100 px-3 py-2 text-gray-500', className)}>
		<File class="h-5 w-5 flex-shrink-0" />
		<span class="truncate text-xs">Unsupported file type</span>
		{#if removable}
			<button
				type="button"
				class="ml-2 rounded-full bg-gray-200 p-1 text-gray-500 hover:bg-gray-300"
				on:click={onRemove}
				aria-label="Remove file"
			>
				<X class="h-4 w-4" />
			</button>
		{/if}
	</div>
{/if}
