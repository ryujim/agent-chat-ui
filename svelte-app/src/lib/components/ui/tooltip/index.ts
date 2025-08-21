import { Tooltip as TooltipPrimitive } from "bits-ui";

import Root from "./tooltip.svelte";
const Trigger = TooltipPrimitive.Trigger;
const Content = TooltipPrimitive.Content;
const Provider = TooltipPrimitive.Provider;

export {
	Root,
	Trigger,
	Content,
	Provider,
	//
	Root as Tooltip,
	Trigger as TooltipTrigger,
	Content as TooltipContent,
	Provider as TooltipProvider,
};
