<script lang="ts">
	import { Sheet as SheetPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";
	import { X } from "lucide-svelte";

	type Props = SheetPrimitive.CloseProps;
	let {
		class: className,
		...rest
	} = $props<Props>();
</script>

<SheetPrimitive.Close
	class={cn(
		"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		className
	)}
	{...rest}
>
	<X class="h-4 w-4" />
	<span class="sr-only">Close</span>
</SheetPrimitive.Close>
