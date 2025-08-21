<script lang="ts">
	import { Sheet as SheetPrimitive } from "bits-ui";

	type Props = SheetPrimitive.TriggerProps;
	let {
		asChild = false,
		...rest
	} = $props<Props>();
</script>

<SheetPrimitive.Trigger {asChild} {...rest}>
	<slot />
</SheetPrimitive.Trigger>
