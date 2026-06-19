<script>
	import { Modal } from '@skeletonlabs/skeleton-svelte';

	let { commentary, id, openState = $bindable() } = $props();

	/** @type {HTMLElement | null} */
	let headerEl = $state(null);
	let offsetX = $state(0);
	let offsetY = $state(0);
	let dragging = $state(false);

	let startX = 0;
	let startY = 0;
	let startOffsetX = 0;
	let startOffsetY = 0;

	/** Apply current offset to the Skeleton content wrapper (header's parent). */
	$effect(() => {
		const contentEl = headerEl?.parentElement;
		if (!contentEl) return;
		contentEl.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
	});

	/**
	 * Clamp a candidate {x, y} so the modal stays grabbable on screen.
	 * Keeps the header visible (at least HEADER_KEEP px tall) and the modal
	 * within the viewport with EDGE_MARGIN px of slack.
	 * @param {number} x
	 * @param {number} y
	 * @returns {{ x: number, y: number }}
	 */
	function clamp(x, y) {
		const contentEl = headerEl?.parentElement;
		if (!contentEl) return { x, y };
		// Measure without our current transform so we get the un-translated rect.
		const prevTransform = contentEl.style.transform;
		contentEl.style.transform = '';
		const rect = contentEl.getBoundingClientRect();
		contentEl.style.transform = prevTransform;

		const EDGE_MARGIN = 8;
		const HEADER_KEEP = headerEl?.offsetHeight ?? 56;

		const minX = EDGE_MARGIN - rect.right;
		const maxX = window.innerWidth - EDGE_MARGIN - rect.left;
		const minY = EDGE_MARGIN - rect.top;
		const maxY = window.innerHeight - HEADER_KEEP - rect.top;

		return {
			x: Math.min(Math.max(x, minX), maxX),
			y: Math.min(Math.max(y, minY), maxY)
		};
	}

	/** @param {PointerEvent} e */
	function onPointerDown(e) {
		// Only primary button / single touch contact
		if (e.button !== undefined && e.button !== 0) return;
		dragging = true;
		startX = e.clientX;
		startY = e.clientY;
		startOffsetX = offsetX;
		startOffsetY = offsetY;
		/** @type {HTMLElement} */ (e.currentTarget).setPointerCapture(e.pointerId);
		e.preventDefault();
	}

	/** @param {PointerEvent} e */
	function onPointerMove(e) {
		if (!dragging) return;
		const next = clamp(startOffsetX + (e.clientX - startX), startOffsetY + (e.clientY - startY));
		offsetX = next.x;
		offsetY = next.y;
	}

	/** @param {PointerEvent} e */
	function onPointerUp(e) {
		if (!dragging) return;
		dragging = false;
		/** @type {HTMLElement} */ (e.currentTarget).releasePointerCapture(e.pointerId);
	}

	/** Re-clamp on viewport resize so the modal stays on screen. */
	function onResize() {
		const next = clamp(offsetX, offsetY);
		offsetX = next.x;
		offsetY = next.y;
	}
</script>

<svelte:window onresize={onResize} />

<Modal
	defaultOpen={true}
	onOpenChange={() => (openState = false)}
	classes="fassungskommentar_modal"
	triggerBase="btn preset-tonal"
	contentBase="w-[80vw] card preset-filled border border-gray-400 rounded-md text-black space-y-4 shadow-xl max-w-screen-lg"
	base=""
	backdropBackground=""
	backdropClasses=""
>
	{#snippet content()}
		<!-- svelte-ignore a11y_no_static_element_interactions -- header is a drag handle for the modal; not itself an interactive control -->
		<header
			bind:this={headerEl}
			class="flex items-center justify-center px-4 py-4 bg-gray-400 rounded-t-md select-none touch-none {dragging
				? 'cursor-grabbing'
				: 'cursor-grab'}"
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
			onpointerup={onPointerUp}
			onpointercancel={onPointerUp}
		>
			<h1
				class={`text-md uppercase tracking-wider ${
					id[2] === 'A' ? 'text-red-800' : 'text-green-900'
				}`}
			>
				Editorischer Kommentar ({id[2] === 'A' ? 'Fassungsübergreifend' : 'Fassungsintern'})
			</h1>
		</header>
		<article class="p-4 fk-modal-content max-h-[80vh] overflow-auto">
			{#if content}
				{@html commentary}
			{/if}
		</article>
	{/snippet}
</Modal>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";
	.fk-modal-content {
		scrollbar-width: thin;
		scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
		:global(.fassungs-kommentar a) {
			@apply anchor font-bold;
		}
		:global(.fk-title) {
			@apply h3 text-black;
		}
		:global(.fk-content) {
			@apply my-3;
		}
		:global(.fk-commentary) {
			@apply mb-1 text-sm;
		}
		:global(.fk-content + .fk-literatur) {
			@apply mt-8;
		}
		:global(.fk-literatur .fk-commentary) {
			@apply my-3  text-xs;
		}
		:global(.fk-bold) {
			@apply font-bold;
		}
		:global(.fk-italic) {
			@apply italic;
		}
		:global(.fk-small-caps) {
			@apply [font-variant:small-caps];
		}
	}

	/* WebKit */
	.fk-modal-content::-webkit-scrollbar {
		width: 8px;
	}

	.fk-modal-content::-webkit-scrollbar-track {
		background: transparent;
	}

	.fk-modal-content::-webkit-scrollbar-thumb {
		background-color: rgba(0, 0, 0, 0.25);
		border-radius: 9999px;
	}

	.fk-modal-content::-webkit-scrollbar-thumb:hover {
		background-color: rgba(0, 0, 0, 0.4);
	}
</style>
