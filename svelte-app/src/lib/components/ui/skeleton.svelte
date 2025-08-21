<script lang="ts">
	import { cn } from "$lib/utils";
	import type { HTMLAttributes } from "svelte/elements";

	type Props = HTMLAttributes<HTMLDivElement>;
	let {
		class: className,
		...rest
	} = $props<Props>();
</script>

<div class={cn("animate-pulse rounded-md bg-muted", className)} {...rest} />
