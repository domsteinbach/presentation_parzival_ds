<script>
	import {
		FloatingArrow,
		arrow,
		autoUpdate,
		flip,
		offset,
		shift,
		useClick,
		useDismiss,
		useFloating,
		useInteractions,
		useRole
	} from '@skeletonlabs/floating-ui-svelte';
	import { fade } from 'svelte/transition';

	/**
	 * `ariaHaspopup` is forwarded to the trigger `<button>` as
	 * `aria-haspopup`. When undefined, the attribute is omitted.
	 *
	 * @typedef {{
	 *   trigger: import('svelte').Snippet,
	 *   content: import('svelte').Snippet,
	 *   ariaHaspopup?: 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
	 * }} Props
	 */

	/** @type {Props} */
	let { trigger, content, ariaHaspopup = undefined } = $props();

	let open = $state(false);
	let elemArrow = $state(null);

	// Use Floating
	const floating = useFloating({
		whileElementsMounted: autoUpdate,
		get open() {
			return open;
		},
		onOpenChange: (v) => {
			open = v;
		},
		placement: 'top',
		get middleware() {
			return [offset(10), flip(), shift(), elemArrow && arrow({ element: elemArrow })];
		}
	});

	// Interactions
	const role = useRole(floating.context);
	const click = useClick(floating.context);
	const dismiss = useDismiss(floating.context);
	const interactions = useInteractions([role, click, dismiss]);
</script>

<span>
	<button
		bind:this={floating.elements.reference}
		{...interactions.getReferenceProps()}
		aria-haspopup={ariaHaspopup}
		class="anchor"
	>
		{@render trigger()}
	</button>

	{#if open}
		<div
			bind:this={floating.elements.floating}
			style={floating.floatingStyles}
			{...interactions.getFloatingProps()}
			class="card preset-filled-primary-500 p-4 unstyled max-w-[99ch] z-[60]"
			transition:fade={{ duration: 200 }}
		>
			{@render content()}
			<FloatingArrow
				bind:ref={elemArrow}
				context={floating.context}
				fill="var(--color-primary-500)"
			/>
		</div>
	{/if}
</span>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";

	.card {
		:global(a) {
			@apply anchor text-primary-100;
		}
	}
</style>
