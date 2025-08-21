import { $state, $effect } from 'svelte';
import { toast } from 'svelte-sonner';
import type { Base64ContentBlock } from '@langchain/core/messages';
import { fileToContentBlock } from '$lib/multimodal-utils';

export const SUPPORTED_FILE_TYPES = [
	'image/jpeg',
	'image/png',
	'image/gif',
	'image/webp',
	'application/pdf'
];

interface UseFileUploadOptions {
	initialBlocks?: Base64ContentBlock[];
}

export function useFileUpload({ initialBlocks = [] }: UseFileUploadOptions = {}) {
	const contentBlocks = $state<Base64ContentBlock[]>(initialBlocks);
	const dragOver = $state(false);
	let dragCounter = 0;

	const isDuplicate = (file: File, blocks: Base64ContentBlock[]) => {
		if (file.type === 'application/pdf') {
			return blocks.some(
				(b) =>
					b.type === 'file' &&
					(b.source as any).media_type === 'application/pdf' &&
					b.metadata?.filename === file.name
			);
		}
		if (SUPPORTED_FILE_TYPES.includes(file.type)) {
			return blocks.some(
				(b) =>
					b.type === 'image' &&
					b.metadata?.name === file.name &&
					(b.source as any).media_type === file.type
			);
		}
		return false;
	};

	const handleFileUpload = async (e: Event) => {
		const files = (e.target as HTMLInputElement).files;
		if (!files) return;
		const fileArray = Array.from(files);
		const validFiles = fileArray.filter((file) => SUPPORTED_FILE_TYPES.includes(file.type));
		const invalidFiles = fileArray.filter((file) => !SUPPORTED_FILE_TYPES.includes(file.type));
		const duplicateFiles = validFiles.filter((file) => isDuplicate(file, contentBlocks));
		const uniqueFiles = validFiles.filter((file) => !isDuplicate(file, contentBlocks));

		if (invalidFiles.length > 0) {
			toast.error(
				'You have uploaded invalid file type. Please upload a JPEG, PNG, GIF, WEBP image or a PDF.'
			);
		}
		if (duplicateFiles.length > 0) {
			toast.error(
				`Duplicate file(s) detected: ${duplicateFiles
					.map((f) => f.name)
					.join(', ')}. Each file can only be uploaded once per message.`
			);
		}

		const newBlocks = uniqueFiles.length
			? await Promise.all(uniqueFiles.map(fileToContentBlock))
			: [];
		contentBlocks.push(...newBlocks);
		(e.target as HTMLInputElement).value = '';
	};

	const removeBlock = (idx: number) => {
		contentBlocks.splice(idx, 1);
	};

	const resetBlocks = () => {
		contentBlocks.length = 0;
	};

	const handlePaste = async (e: ClipboardEvent) => {
		const items = e.clipboardData?.items;
		if (!items) return;
		const files: File[] = [];
		for (let i = 0; i < items.length; i += 1) {
			const item = items[i];
			if (item.kind === 'file') {
				const file = item.getAsFile();
				if (file) files.push(file);
			}
		}
		if (files.length === 0) {
			return;
		}
		e.preventDefault();
		const validFiles = files.filter((file) => SUPPORTED_FILE_TYPES.includes(file.type));
		const invalidFiles = files.filter((file) => !SUPPORTED_FILE_TYPES.includes(file.type));
		const duplicateFiles = validFiles.filter((file) => isDuplicate(file, contentBlocks));
		const uniqueFiles = validFiles.filter((file) => !isDuplicate(file, contentBlocks));
		if (invalidFiles.length > 0) {
			toast.error(
				'You have pasted an invalid file type. Please paste a JPEG, PNG, GIF, WEBP image or a PDF.'
			);
		}
		if (duplicateFiles.length > 0) {
			toast.error(
				`Duplicate file(s) detected: ${duplicateFiles
					.map((f) => f.name)
					.join(', ')}. Each file can only be uploaded once per message.`
			);
		}
		if (uniqueFiles.length > 0) {
			const newBlocks = await Promise.all(uniqueFiles.map(fileToContentBlock));
			contentBlocks.push(...newBlocks);
		}
	};

	const setupDragDrop = (dropRef: HTMLElement) => {
		$effect(() => {
			if (!dropRef) return;

			const handleWindowDragEnter = (e: DragEvent) => {
				if (e.dataTransfer?.types?.includes('Files')) {
					dragCounter += 1;
					dragOver = true;
				}
			};
			const handleWindowDragLeave = (e: DragEvent) => {
				if (e.dataTransfer?.types?.includes('Files')) {
					dragCounter -= 1;
					if (dragCounter <= 0) {
						dragOver = false;
						dragCounter = 0;
					}
				}
			};
			const handleWindowDrop = async (e: DragEvent) => {
				e.preventDefault();
				e.stopPropagation();
				dragCounter = 0;
				dragOver = false;

				if (!e.dataTransfer) return;

				const files = Array.from(e.dataTransfer.files);
				const validFiles = files.filter((file) => SUPPORTED_FILE_TYPES.includes(file.type));
				const invalidFiles = files.filter((file) => !SUPPORTED_FILE_TYPES.includes(file.type));
				const duplicateFiles = validFiles.filter((file) => isDuplicate(file, contentBlocks));
				const uniqueFiles = validFiles.filter((file) => !isDuplicate(file, contentBlocks));

				if (invalidFiles.length > 0) {
					toast.error(
						'You have uploaded invalid file type. Please upload a JPEG, PNG, GIF, WEBP image or a PDF.'
					);
				}
				if (duplicateFiles.length > 0) {
					toast.error(
						`Duplicate file(s) detected: ${duplicateFiles
							.map((f) => f.name)
							.join(', ')}. Each file can only be uploaded once per message.`
					);
				}

				const newBlocks = uniqueFiles.length
					? await Promise.all(uniqueFiles.map(fileToContentBlock))
					: [];
				contentBlocks.push(...newBlocks);
			};
			const handleWindowDragEnd = (e: DragEvent) => {
				dragCounter = 0;
				dragOver = false;
			};
			window.addEventListener('dragenter', handleWindowDragEnter);
			window.addEventListener('dragleave', handleWindowDragLeave);
			window.addEventListener('drop', handleWindowDrop);
			window.addEventListener('dragend', handleWindowDragEnd);

			const handleWindowDragOver = (e: DragEvent) => {
				e.preventDefault();
				e.stopPropagation();
			};
			window.addEventListener('dragover', handleWindowDragOver);

			const handleDragOver = (e: DragEvent) => {
				e.preventDefault();
				e.stopPropagation();
				dragOver = true;
			};
			const handleDragEnter = (e: DragEvent) => {
				e.preventDefault();
				e.stopPropagation();
				dragOver = true;
			};
			const handleDragLeave = (e: DragEvent) => {
				e.preventDefault();
				e.stopPropagation();
				dragOver = false;
			};
			dropRef.addEventListener('dragover', handleDragOver);
			dropRef.addEventListener('dragenter', handleDragEnter);
			dropRef.addEventListener('dragleave', handleDragLeave);

			return () => {
				dropRef.removeEventListener('dragover', handleDragOver);
				dropRef.removeEventListener('dragenter', handleDragEnter);
				dropRef.removeEventListener('dragleave', handleDragLeave);
				window.removeEventListener('dragenter', handleWindowDragEnter);
				window.removeEventListener('dragleave', handleWindowDragLeave);
				window.removeEventListener('drop', handleWindowDrop);
				window.removeEventListener('dragend', handleWindowDragEnd);
				window.removeEventListener('dragover', handleWindowDragOver);
				dragCounter = 0;
			};
		});
	}

	return {
		contentBlocks,
		handleFileUpload,
		removeBlock,
		resetBlocks,
		dragOver,
		handlePaste,
		setupDragDrop
	};
}
