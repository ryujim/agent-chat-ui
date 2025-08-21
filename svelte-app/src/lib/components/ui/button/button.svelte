<script lang="ts">
	import { type VariantProps, tv } from "tailwind-variants";
	import { cn } from "$lib/utils.js";
	import type { Button as ButtonPrimitive } from "bits-ui";
	import { buttonVariants } from "./index.js";

	type $$Props = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>;
	type $$Events = ButtonPrimitive.Events;

	let className: $$Props["class"] = undefined;
	export let variant: $$Props["variant"] = "default";
	export let size: $$Props["size"] = "default";
	export let href: $$Props["href"] = undefined;
	export { className as class };
</script>

{#if href}
	<a {href} class={cn(buttonVariants({ variant, size, className }))} {...$$restProps} on:click>
		<slot />
	</a>
{:else}
	<button class={cn(buttonVariants({ variant, size, className }))} {...$$restProps} on:click on:keydown on:keyup on:mouseenter on:mouseleave>
		<slot />
	</button>
{/if}
