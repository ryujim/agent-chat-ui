<script lang="ts">
	import { Separator as SeparatorPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	type Props = SeparatorPrimitive.Props;
	let {
		class: className,
		orientation = "horizontal",
		decorative = false,
		...rest
	} = $props<Props>();
</script>

<SeparatorPrimitive.Root
	{orientation}
	{decorative}
	class={cn(
		"shrink-0 bg-border",
		orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
		className
	)}
	{...rest}
/>
