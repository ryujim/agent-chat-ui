<script lang="ts">
	import { Sheet as SheetPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	type Props = SheetPrimitive.TitleProps;
	let {
		class: className,
		...rest
	} = $props<Props>();
</script>

<SheetPrimitive.Title
	class={cn("text-lg font-semibold text-foreground", className)}
	{...rest}
>
	<slot />
</SheetPrimitive.Title>
