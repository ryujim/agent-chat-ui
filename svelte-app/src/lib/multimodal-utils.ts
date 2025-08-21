import type { Base64ContentBlock } from "@langchain/core/messages";
import { toast } from "svelte-sonner";

// Returns a Promise of a typed multimodal block for images or PDFs
export async function fileToContentBlock(
  file: File,
): Promise<Base64ContentBlock> {
  const supportedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const supportedFileTypes = [...supportedImageTypes, "application/pdf"];

  if (!supportedFileTypes.includes(file.type)) {
    toast.error(
      `Unsupported file type: ${file.type}. Supported types are: ${supportedFileTypes.join(", ")}`,
    );
    return Promise.reject(new Error(`Unsupported file type: ${file.type}`));
  }

  const data = await fileToBase64(file);

  if (supportedImageTypes.includes(file.type)) {
    return {
      type: "image",
      source: {
        type: "base64",
        media_type: file.type,
        data,
      },
      metadata: { name: file.name },
    };
  }

  // PDF
  return {
    type: "file",
    source: {
        type: "base64",
        media_type: "application/pdf",
        data,
    },
    metadata: { filename: file.name },
  };
}

// Helper to convert File to base64 string
export async function fileToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove the data:...;base64, prefix
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Type guard for Base64ContentBlock
export function isBase64ContentBlock(
  block: unknown,
): block is Base64ContentBlock {
  if (typeof block !== "object" || block === null || !("type" in block))
    return false;
  // file type (legacy)
  if (
    (block as { type: unknown }).type === "file" &&
    "source" in block &&
    (block.source as any).type === "base64" &&
    "media_type" in (block.source as any) &&
    typeof (block.source as any).media_type === "string" &&
    (((block.source as any).media_type.startsWith("image/") ||
      (block.source as any).media_type === "application/pdf"))
  ) {
    return true;
  }
  // image type (new)
  if (
    (block as { type: unknown }).type === "image" &&
    "source" in block &&
    (block.source as any).type === "base64" &&
    "media_type" in (block.source as any) &&
    typeof (block.source as any).media_type === "string" &&
    (block.source as any).media_type.startsWith("image/")
  ) {
    return true;
  }
  return false;
}
