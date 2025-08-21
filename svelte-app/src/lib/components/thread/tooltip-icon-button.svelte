<script lang="ts">
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger,
	} from "$lib/components/ui/tooltip";
	import { Button, type Props as ButtonProps } from "$lib/components/ui/button";
	import { cn } from "$lib/utils";

	type Props = ButtonProps & {
		tooltip: string;
		side?: "top" | "bottom" | "left" | "right";
	};

	let { children, tooltip, side = "bottom", class: className, ...rest } = $props<Props>();
</script>

<TooltipProvider>
	<Tooltip>
		<TooltipTrigger asChild>
			<Button
				variant="ghost"
				size="icon"
				{...rest}
				class={cn("size-6 p-1", className)}
			>
				{@render children()}
				<span class="sr-only">{tooltip}</span>
			</Button>
		</TooltipTrigger>
		<TooltipContent {side}>{tooltip}</TooltipContent>
	</Tooltip>
</TooltipProvider>
