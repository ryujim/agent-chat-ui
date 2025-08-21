<script lang="ts">
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger,
	} from '$lib/components/ui/tooltip';
	import ThreadIdCopyable from './ThreadIdCopyable.svelte';

	let { threadId } = $props<{
		threadId: string;
	}>();

	const firstThreeChars = threadId.slice(0, 3);
	const lastThreeChars = threadId.slice(-3);
</script>

<TooltipProvider>
	<Tooltip>
		<TooltipTrigger>
			<p class="rounded-md bg-gray-100 px-1 py-[2px] font-mono text-[10px] leading-[12px] tracking-tighter">
				{firstThreeChars}...{lastThreeChars}
			</p>
		</TooltipTrigger>
		<TooltipContent>
			<ThreadIdCopyable {threadId} showUUID={true} />
		</TooltipContent>
	</Tooltip>
</TooltipProvider>
