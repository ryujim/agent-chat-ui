import { writable, get } from 'svelte/store';
import { fileToContentBlock } from '$lib/utils';
import { toast } from 'sonner';
import type { Base64ContentBlock } from '@langchain/langgraph-sdk';

const SUPPORTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
];

export function fileUpload(node: HTMLElement) {
  const contentBlocks = writable<Base64ContentBlock[]>([]);
  const dragOver = writable(false);
  let dragCounter = 0;

  contentBlocks.subscribe(blocks => {
    node.dispatchEvent(new CustomEvent('files', { detail: blocks }));
  });

  dragOver.subscribe(isOver => {
    node.dispatchEvent(new CustomEvent('dragover', { detail: isOver }));
  });

  function isDuplicate(file: File, blocks: Base64ContentBlock[]) {
    if (file.type === "application/pdf") {
      return blocks.some(
        (b) =>
          b.type === "file" &&
          b.mime_type === "application/pdf" &&
          b.metadata?.filename === file.name,
      );
    }
    if (SUPPORTED_FILE_TYPES.includes(file.type)) {
      return blocks.some(
        (b) =>
          b.type === "image" &&
          b.metadata?.name === file.name &&
          b.mime_type === file.type,
      );
    }
    return false;
  };

  async function addFiles(files: File[]) {
    const currentBlocks = get(contentBlocks);
    const validFiles = files.filter((file) => SUPPORTED_FILE_TYPES.includes(file.type));
    const invalidFiles = files.filter((file) => !SUPPORTED_FILE_TYPES.includes(file.type));
    const duplicateFiles = validFiles.filter((file) => isDuplicate(file, currentBlocks));
    const uniqueFiles = validFiles.filter((file) => !isDuplicate(file, currentBlocks));

    if (invalidFiles.length > 0) {
      toast.error("Invalid file type.");
    }
    if (duplicateFiles.length > 0) {
      toast.error(`Duplicate file(s) detected: ${duplicateFiles.map((f) => f.name).join(", ")}.`);
    }

    if (uniqueFiles.length > 0) {
      const newBlocks = await Promise.all(uniqueFiles.map(fileToContentBlock));
      contentBlocks.update((prev) => [...prev, ...newBlocks]);
    }
  }

  const handleWindowDragEnter = (e: DragEvent) => {
    if (e.dataTransfer?.types?.includes("Files")) {
      dragCounter++;
      dragOver.set(true);
    }
  };

  const handleWindowDragLeave = (e: DragEvent) => {
    if (e.dataTransfer?.types?.includes("Files")) {
      dragCounter--;
      if (dragCounter <= 0) {
        dragOver.set(false);
        dragCounter = 0;
      }
    }
  };

  const handleWindowDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter = 0;
    dragOver.set(false);
    if (e.dataTransfer) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleWindowDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handlePaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
            const file = items[i].getAsFile();
            if (file) files.push(file);
        }
    }
    if (files.length > 0) {
        e.preventDefault();
        addFiles(files);
    }
  };

  window.addEventListener("dragenter", handleWindowDragEnter);
  window.addEventListener("dragleave", handleWindowDragLeave);
  window.addEventListener("drop", handleWindowDrop);
  window.addEventListener("dragover", handleWindowDragOver);
  node.addEventListener('paste', handlePaste);

  return {
    destroy() {
      window.removeEventListener("dragenter", handleWindowDragEnter);
      window.removeEventListener("dragleave", handleWindowDragLeave);
      window.removeEventListener("drop", handleWindowDrop);
      window.removeEventListener("dragover", handleWindowDragOver);
      node.removeEventListener('paste', handlePaste);
    }
  };
}
