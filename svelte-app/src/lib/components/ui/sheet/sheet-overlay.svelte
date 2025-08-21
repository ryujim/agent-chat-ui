<script lang="ts">
	import { Sheet as SheetPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";
	import { fade } from "svelte/transition";
	import { cubicOut } from "svelte/easing";

	type Props = SheetPrimitive.OverlayProps;
	let {
		class: className,
		...rest
	} = $props<Props>();
</script>

<SheetPrimitive.Overlay
	class={cn("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm", className)}
	transition={fade}
	transitionConfig={{
		duration: 400,
		easing: cubicOut,
	}}
	{...rest}
/>
