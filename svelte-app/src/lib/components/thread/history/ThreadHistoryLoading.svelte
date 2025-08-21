<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton.svelte';
</script>

<div class="flex h-full w-full flex-col items-start justify-start gap-2 overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
	{#each Array(30) as _, i}
		<Skeleton
			class="h-10 w-[280px]"
		/>
	{/each}
</div>
