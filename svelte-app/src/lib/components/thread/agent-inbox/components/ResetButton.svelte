<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Undo2 } from 'lucide-svelte';

	let { handleReset } = $props<{
		handleReset: () => void;
	}>();
</script>

<Button
	onclick={handleReset}
	variant="ghost"
	class="flex items-center justify-center gap-2 text-gray-500 hover:text-red-500"
>
	<Undo2 class="h-4 w-4" />
	<span>Reset</span>
</Button>
