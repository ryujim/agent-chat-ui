<script lang="ts">
	import { Tooltip as TooltipPrimitive } from "bits-ui";

	type Props = TooltipPrimitive.Props;

	let {
		open = undefined,
		onOpenChange = undefined,
		closeOnPointerDown = true,
		closeOnEscape = true,
		openDelay = 700,
		closeDelay = 300,
		positioning = {
			placement: "bottom",
		},
		arrowSize = 8,
		id = undefined,
	} = $props<Props>();
</script>

<TooltipPrimitive.Root
	bind:open
	onOpenChange={onOpenChange}
	{closeOnPointerDown}
	{closeOnEscape}
	{openDelay}
	{closeDelay}
	{positioning}
	{arrowSize}
	{id}
>
	<slot />
</TooltipPrimitive.Root>
