<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { NUMBER_OF_PAGES } from '$lib/constants';
	import createObserver from './observer';

	let { content, titles, nextPrevButton, distributions, resetPopup = () => {} } = $props();
	const thirtiesNum = $derived(Number(page.data.thirties));

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

<div class="grid lg:grid-cols-4 gap-4 mb-2">
	{#each content as _fassung, i}
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
	{/each}
</div>
<div
	class="grid lg:grid-cols-4 gap-x-4 my-4 tei-content synced grid-flow-dense lg:h-[calc(100vh-5rem)] lg:overflow-y-auto"
	bind:this={scrollContainer}
	onscroll={() => {
		resetPopup();
	}}
>
	{#each content as fassung, i}
		{@const column = ['d', 'm', 'G', 'T'][i]}
		{#if fassung[0] && fassung[0][0] > 1}
			{@render nextPrevButton(false, fassung[0][0] - 1, column)}
		{/if}
		{#each fassung as page (page[0])}
			{@html page[1]}
			{#if i === 0}
				<hr class="!border-t-4 !border-primary-500 column-{column}" use:addToObserver />
			{:else}
				<hr class="!border-t-4 !border-primary-500 column-{column}" />
			{/if}
		{/each}
		{#if fassung[fassung.length - 1] && fassung[fassung.length - 1][0] < NUMBER_OF_PAGES}
			{@render nextPrevButton(true, fassung[fassung.length - 1][0] + 1, column)}
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
		@variant lg {
			:global(.column-d) {
				grid-column: 1;
			}
			:global(.column-m) {
				grid-column: 2;
			}
			:global(.column-G) {
				grid-column: 3;
			}
			:global(.column-T) {
				grid-column: 4;
			}
		}
	}
</style>
