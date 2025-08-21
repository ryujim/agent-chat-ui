<script lang="ts">
	import { Tooltip as TooltipPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";
	import { fade } from "svelte/transition";

	type Props = TooltipPrimitive.ContentProps;
	let {
		class: className,
		sideOffset = 4,
		...rest
	} = $props<Props>();
</script>

<TooltipPrimitive.Content
	{sideOffset}
	class={cn(
		"z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
		className
	)}
	transition={fade}
	transitionConfig={{ duration: 150 }}
	{...rest}
>
	<slot />
</TooltipPrimitive.Content>
