<script lang="ts">
	import { Sheet as SheetPrimitive } from "bits-ui";

	type Props = SheetPrimitive.Props;

	let {
		open = undefined,
		onOpenChange = undefined,
		closeOnEscape = true,
		closeOnOutsideClick = true,
		portal = "body",
	} = $props<Props>();
</script>

<SheetPrimitive.Root
	bind:open
	onOpenChange={onOpenChange}
	{closeOnEscape}
	{closeOnOutsideClick}
	{portal}
>
	<slot />
</SheetPrimitive.Root>
