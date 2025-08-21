<script lang="ts">
	import { type Events, type Props, buttonVariants } from "./index.js";
	import { cn } from "$lib/utils.js";
	import { Button as ButtonPrimitive } from "bits-ui";

	let {
		variant = "default",
		size = "default",
		class: className,
		...rest
	} = $props<Props>();
</script>

<ButtonPrimitive.Root
	class={cn(buttonVariants({ variant, size }), className)}
	{...rest}
	on:click
	on:keydown
>
	<slot />
</ButtonPrimitive.Root>
