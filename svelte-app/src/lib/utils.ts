import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Message } from "@langchain/langgraph-sdk";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getContentString(content: Message["content"]): string {
  if (typeof content === "string") return content;
  const texts = content
    .filter((c): c is { type: "text"; text: string } => c.type === "text")
    .map((c) => c.text);
  return texts.join(" ");
}
