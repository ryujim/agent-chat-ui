<script lang="ts">
	import { Sheet as SheetPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	type Props = SheetPrimitive.DescriptionProps;
	let {
		class: className,
		...rest
	} = $props<Props>();
</script>

<SheetPrimitive.Description
	class={cn("text-sm text-muted-foreground", className)}
	{...rest}
>
	<slot />
</SheetPrimitive.Description>
