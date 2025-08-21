<script lang="ts">
	import { cn } from "$lib/utils";
	import type { HTMLAttributes } from "svelte/elements";

	type Props = HTMLAttributes<HTMLDivElement>;
	let {
		class: className,
		...rest
	} = $props<Props>();
</script>

<div class={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...rest}>
	<slot />
</div>
