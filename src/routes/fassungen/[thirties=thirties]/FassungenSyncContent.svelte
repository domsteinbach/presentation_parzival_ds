<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { NUMBER_OF_PAGES } from '$lib/constants';
	import createObserver from './observer';

	let {
		content,
		titles,
		nextPrevButton,
		distributions,
		resetPopup = () => {},
		fassungenVisible = [true, true, true, true]
	} = $props();
	const thirtiesNum = $derived(Number(page.data.thirties));

	const columnKeys = /** @type {const} */ (['d', 'm', 'G', 'T']);
	let visibleCount = $derived(fassungenVisible.filter(Boolean).length || 1);
	let firstVisibleIndex = $derived(fassungenVisible.findIndex(Boolean));
	/**
	 * Map from column key ('d'|'m'|'G'|'T') to its 1-based grid-column index
	 * among the currently visible columns. Hidden columns map to 0.
	 * @type {Record<string, number>}
	 */
	let columnIndexByKey = $derived.by(() => {
		/** @type {Record<string, number>} */
		const map = { d: 0, m: 0, G: 0, T: 0 };
		let idx = 0;
		columnKeys.forEach((k, i) => {
			if (fassungenVisible[i]) {
				idx += 1;
				map[k] = idx;
			}
		});
		return map;
	});
	// CSS rules injected via a runtime <style> tag (unscoped) so that
	// .line.column-X / .column-X elements rendered from prepared HTML
	// land in the correct visible grid column, regardless of original index.
	// Hidden columns are display:none'd defensively (the relevant {@html}
	// blocks are also skipped in markup below).
	let dynamicColumnCss = $derived(
		columnKeys
			.map((k) => {
				const idx = columnIndexByKey[k];
				return idx > 0
					? `.synced .column-${k} { grid-column: ${idx}; }`
					: `.synced .column-${k} { display: none; }`;
			})
			.join('\n')
	);

	let scrollContainer = $state();
	/**
	 * @type {IntersectionObserver}
	 */
	let observer;
	onMount(async () => {
		// update the current page when a new verse comes into view
		observer = createObserver(true, scrollContainer, page);
	});

	const addToObserver = (/** @type {HTMLDivElement} */ node) => {
		$effect(() => {
			if (!correctPos) {
				const targetVerse = node.parentElement?.querySelector(
					`[data-verse="${page.data.thirties}.01"]`
				);
				if (scrollContainer && targetVerse) {
					scrollContainer?.scrollTo({
						top:
							scrollContainer?.scrollTop +
							Number(targetVerse.parentElement?.getBoundingClientRect().top) -
							scrollContainer?.getBoundingClientRect().top,
						behavior: 'instant'
					});
					correctPos = true;
				}
			}
			observer.observe(node);
			return () => {
				observer.unobserve(node);
			};
		});
	};
	let correctPos = false;

	$effect(() => {
		if (!content[0]?.length && correctPos) {
			correctPos = false;
		}
	});
</script>

<div
	class="grid gap-4 mb-2"
	class:lg:grid-cols-1={visibleCount === 1}
	class:lg:grid-cols-2={visibleCount === 2}
	class:lg:grid-cols-3={visibleCount === 3}
	class:lg:grid-cols-4={visibleCount === 4}
>
	{#each content as _fassung, i}
		{#if fassungenVisible[i]}
			<div>
				<h3 class="h3 inline-flex">
					{titles[i]}
					{#if titles[i].includes('T')}
						{#if thirtiesNum >= 36 && thirtiesNum <= 157}
							<span>(U)</span>
						{:else if (thirtiesNum >= 573 && thirtiesNum <= 599) || (thirtiesNum >= 643 && thirtiesNum <= 678)}
							<span>(Q)</span>
						{/if}
					{/if}
				</h3>
				<div class="inline [&_ul,&_li]:inline [&_li]:mr-1 anchor">
					{@html distributions[i][page.data.thirties]}
				</div>
			</div>
		{/if}
	{/each}
</div>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html `<style>${dynamicColumnCss}</style>`}
<div
	class="grid gap-x-4 mb-2 tei-content synced grid-flow-dense lg:h-[calc(100vh-5rem)] lg:overflow-y-auto"
	class:lg:grid-cols-1={visibleCount === 1}
	class:lg:grid-cols-2={visibleCount === 2}
	class:lg:grid-cols-3={visibleCount === 3}
	class:lg:grid-cols-4={visibleCount === 4}
	bind:this={scrollContainer}
	onscroll={() => {
		resetPopup();
	}}
>
	{#each content as fassung, i}
		{@const column = ['d', 'm', 'G', 'T'][i]}
		{#if fassungenVisible[i]}
			{#if fassung[0] && fassung[0][0] > 1}
				{@render nextPrevButton(false, fassung[0][0] - 1, column)}
			{/if}
			{#each fassung as page (page[0])}
				{@html page[1]}
				{#if i === firstVisibleIndex}
					<hr class="!border-t-4 !border-primary-500 column-{column}" use:addToObserver />
				{:else}
					<hr class="!border-t-4 !border-primary-500 column-{column}" />
				{/if}
			{/each}
			{#if fassung[fassung.length - 1] && fassung[fassung.length - 1][0] < NUMBER_OF_PAGES}
				{@render nextPrevButton(true, fassung[fassung.length - 1][0] + 1, column)}
			{/if}
		{/if}
	{/each}
</div>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";
	@reference "@skeletonlabs/skeleton/optional/presets";

	.synced {
		:global(.line) {
			@apply grid grid-cols-(--verse-width) grid-flow-col items-center-safe;
			@apply preset-filled-surface-500;
			:global(.verse) {
				@apply ml-1;
			}
		}
		/* per-column grid-column rules are injected at runtime via the
		   dynamicColumnCss <style> tag so visible columns reflow when
		   Fassungen are hidden via the sidebar toggles. */
	}
</style>
