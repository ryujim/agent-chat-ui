<script lang="ts">
	import { Sheet as SheetPrimitive } from "bits-ui";

	type Props = SheetPrimitive.PortalProps;
	let {
		to = "body",
		...rest
	} = $props<Props>();
</script>

<SheetPrimitive.Portal {to} {...rest}>
	<slot />
</SheetPrimitive.Portal>
