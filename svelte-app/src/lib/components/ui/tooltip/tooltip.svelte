<script lang="ts">
	import { Tooltip as TooltipPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	type $$Props = TooltipPrimitive.ContentProps;

	let className = undefined;
	export { className as class };
</script>

<TooltipPrimitive.Content
	{...$$restProps}
	class={cn(
		"z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
		className
	)}
/>
