<script lang="ts">
	import { Sheet as SheetPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";
	import SheetClose from "./sheet-close.svelte";
	import SheetOverlay from "./sheet-overlay.svelte";
	import { tv, type VariantProps } from "tailwind-variants";
	import { fade } from "svelte/transition";
	import { cubicOut } from "svelte/easing";

	type Props = SheetPrimitive.ContentProps & VariantProps<typeof sheetVariants>;

	const sheetVariants = tv({
		base: "fixed z-50 gap-4 bg-background p-6 shadow-lg",
		variants: {
			side: {
				top: "inset-x-0 top-0 border-b",
				bottom: "inset-x-0 bottom-0 border-t",
				left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
				right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
			},
		},
		defaultVariants: {
			side: "right",
		},
	});

	let {
		class: className,
		side = "right",
		...rest
	} = $props<Props>();
</script>

<SheetPrimitive.Portal>
	<SheetOverlay />
	<SheetPrimitive.Content
		class={cn(sheetVariants({ side }), className)}
		{...rest}
		transition={fade}
		transitionConfig={{
			duration: 400,
			easing: cubicOut,
		}}
	>
		<slot />
		<SheetClose />
	</SheetPrimitive.Content>
</SheetPrimitive.Portal>
