<script lang="ts">
	import { Tooltip as TooltipPrimitive } from "bits-ui";

	type Props = TooltipPrimitive.TriggerProps;
	let {
		asChild = false,
		...rest
	} = $props<Props>();
</script>

<TooltipPrimitive.Trigger {asChild} {...rest}>
	<slot />
</TooltipPrimitive.Trigger>
