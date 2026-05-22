<script>
	import ErlaeuterungenFassungsedition from '$lib/components/erlaeuterungen-components/ErlaeuterungenFassungsedition.svelte';
	import ExpandableContent from '$lib/components/ExpandableContent.svelte';
	import Zitierempfehlung from '$lib/components/Zitierempfehlung.svelte';
	import FassungenSyncContent from './FassungenSyncContent.svelte';
	import FassungenContent from './FassungenContent.svelte';
	import FassungskommentarModal from './FassungskommentarModal.svelte';
	import { base } from '$app/paths';
	import { NUMBER_OF_PAGES } from '$lib/constants';
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import { page } from '$app/state';
	import { onMount, tick, untrack } from 'svelte';
	import { goto, replaceState } from '$app/navigation';
	import ApparatPopover from './ApparatPopover.svelte';
	import handleFromSigil from '$lib/functions/handleFromSigil';
	import { browser } from '$app/environment';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
	let verseWidth = $derived(page.data.thirties.length + 4);

	const composureTitles = ['*D', '*m', '*G', '*T'];
	/** @type {Record<string, string>} */
	const composureTitlesByColumn = { d: '*D', m: '*m', G: '*G', T: '*T' };
	class localPageClass {
		/**
		 * for the Fassungen *d, *m, *G and *T
		 * @type {[[number, string][],[number, string][],[number, string][],[number, string][]]}
		 */
		pages = $state([[], [], [], []]);
		/** @type {Record<string, string>[]} */
		distributions = $state([{}, {}, {}, {}]);
		/**
		 * @type {Number[]}
		 */
		thirties = $state([]);
		// thirties = [];

		/**
		 * @type {String[]}
		 */
		books = $state([]);

		reset = () => {
			this.pages = [[], [], [], []];
			this.thirties = [];
			this.distributions = [{}, {}, {}, {}];
			this.books = [];
		};

		/**
		 * Fetches data for the specified page number.
		 * @param {Number} page - The page number to fetch data for.
		 * @returns {Promise<void>} - A promise that resolves when the data is fetched.
		 */
		fetchPage = async (/** @type {Number} */ page) => {
			const prepareHTML = (
				/** @type {{ content: string; apparat: { reading: any[]; structure: any[]; distribution: string; }; fasskomm: any[]; }} */ info,
				/** @type {string} */ column
			) => {
				// select all lines in the HTML and process them
				const parser = new DOMParser();
				const doc = parser.parseFromString(info.content, 'text/html');
				// The reducer will...
				// 1. transform the input array into an object array by...
				// 	 a. grouping by the key
				//   b. glowing strings together for repeating key (separated by linebreak)
				const reducer = (
					/** @type {{ [x: string]: any; }} */ acc,
					/** @type {{ [s: string]: any; } | ArrayLike<any>} */ object
				) => {
					for (const [key, value] of Object.entries(object)) {
						if (value) {
							acc[key] = (acc[key] ?? '') + value + '<br/>';
						}
					}
					return acc;
				};
				const condensedReading = info.apparat.reading.reduce(reducer, {});
				const condensedStructure = info.apparat.structure.reduce(reducer, {});

				const formatVerseSup = (_, match) => `<sup>${match}</sup>`;
				// create a shallow copy of the fasskomInfos in order to splice already
				// painted ones, so the fasskoms with a verse range are only painted once.
				const fasskommInfos = [...info.fasskomm];
				const lines = doc.querySelectorAll('div.line');
				lines.forEach((line) => {
					line.classList.add(`column-${column}`);

					// Nodes
					const verseNode = line.querySelector('[data-verse]');
					if (verseNode) {
						const verse = verseNode.getAttribute('data-verse')?.split('.')[1];
						const dataVerse = Number(verseNode.getAttribute('data-verse'));
						// Fassungskommentar Triggers
						const contentNode = line.querySelector('.content');
						if (contentNode && verse) {
							// find whether the verse is in the range of a fasskomInfo
							// in order to set the link to the first matching verse
							const fasskommInfo = fasskommInfos.find((f) => {
								if (!f.end_vers) {
									return Number(f.verse) === Number(verse);
								}
								// else there is a range over several dreissigers
								const startVerse = Number(`${f.dreissiger}.${f.verse}`);
								return dataVerse >= startVerse && dataVerse <= Number(f.end_vers);
							});
							if (fasskommInfo) {
								contentNode.innerHTML = `${contentNode.innerHTML}<sup><a
									class="fasskommanchor ${fasskommInfo.id[2] === 'A' ? 'multi' : 'single'}"
									href="#fasskomm-${fasskommInfo.dreissiger}.${verse}"
									data-commentary="${encodeURIComponent(fasskommInfo.commentary ? fasskommInfo.commentary : '')}"
									data-dreissiger=${fasskommInfo.dreissiger}
									data-verse=${verse}
									data-id=${fasskommInfo.id}
									data-title="${composureTitlesByColumn[column] + ' ' + fasskommInfo.dreissiger + verse.replace(/^0+/, '').replace(/-(.+)$/, formatVerseSup)}"
									>K</a></sup>`;
								// remove the already used fasskomm_info to avoid duplicate processing
								fasskommInfos.splice(fasskommInfos.indexOf(fasskommInfo), 1);
							}
						}

						// Apparat Triggers
						if (verse) {
							const reading_info = condensedReading[verse];
							const structure_info = condensedStructure[verse];
							if (reading_info || structure_info) {
								const parts = verseNode.innerHTML.split('.');
								if (parts.length > 1) {
									const beforeDot = parts[0] + '.';
									const afterDot = parts[1];
									verseNode.innerHTML = `${beforeDot}<a
									class="anchor"
									href="#verse-${verse}"
									data-structure_info="${encodeURIComponent(structure_info ? structure_info : '')}"
									data-reading_info="${encodeURIComponent(reading_info ? reading_info : '')}"
									data-dreissiger=${parts[0]}
									data-verse=${verse}
									data-title="${composureTitlesByColumn[column] + ' ' + beforeDot + verse.replace(/^0+/, '').replace(/-(.+)$/, formatVerseSup)}"
									>${afterDot}</a>`;
								} else {
									verseNode.innerHTML = `<a class="anchor" href="#verse-${verse}">${verseNode.innerHTML}</a>`;
								}
							}
						}
					}
				});

				return {
					preparedHTML: Array.from(lines)
						.map((line) => line.outerHTML)
						.join(''),
					preparedDistribution: info.apparat.distribution.replace(
						/<a\s+data-thirties="([0-9]+)">([^<]+)<\/a>/g,
						(_match, p1, p2) => {
							return `<a href="${base}/transkriptionen/${handleFromSigil(p2)}/${p1}">${p2}</a>`;
						}
					)
				};
			};
			let labels = ['d', 'm', 'G', 'T'];
			// if the page is not already loaded
			if (!this.thirties.length) {
				/**
				 * @type {{meta:{book: string}, content:{ content: string; apparat: { reading: any[]; structure: any[]; distribution: string; }; fasskomm: any[]; }[]}}
				 */
				let info;
				// fetch the page before the current one if the current one is not the first
				if (page > 1) {
					info = await fetch(`${base}/fassungen/data/${page - 1}`).then((r) => r.json());
					labels.forEach((label, index) => {
						const { preparedHTML, preparedDistribution } = prepareHTML(info.content[index], label);
						this.pages[index].push([page - 1, preparedHTML]);
						this.distributions[index][page - 1] = preparedDistribution;
					});
					this.books.push(info.meta.book);
					this.thirties.push(page - 1);
				}
				// fetch the current page
				if (page <= NUMBER_OF_PAGES) {
					info = await fetch(`${base}/fassungen/data/${page}`).then((r) => r.json());
					labels.forEach((label, index) => {
						const { preparedHTML, preparedDistribution } = prepareHTML(info.content[index], label);
						this.pages[index].push([page, preparedHTML]);
						this.distributions[index][page] = preparedDistribution;
					});
					this.books.push(info.meta.book);
					this.thirties.push(page);
				}
				// fetch the page after the current one if the current one is not the last
				if (page !== NUMBER_OF_PAGES) {
					info = await fetch(`${base}/fassungen/data/${page + 1}`).then((r) => r.json());
					labels.forEach((label, index) => {
						const { preparedHTML, preparedDistribution } = prepareHTML(info.content[index], label);
						this.pages[index].push([page + 1, preparedHTML]);
						this.distributions[index][page + 1] = preparedDistribution;
					});
					this.books.push(info.meta.book);
					this.thirties.push(page + 1);
				}
				if (page > NUMBER_OF_PAGES) {
					console.error('Page out of bounds');
				}
			} else {
				if (page < this.thirties[0] && !this.thirties.includes(page)) {
					let info = await fetch(`${base}/fassungen/data/${page}`).then((r) => r.json());
					labels.forEach((label, index) => {
						const { preparedHTML, preparedDistribution } = prepareHTML(info.content[index], label);
						this.pages[index].unshift([page, preparedHTML]);
						this.distributions[index][page] = preparedDistribution;
					});
					this.books.unshift(info.meta.book);
					this.thirties.unshift(page);
				} else if (page > this.thirties[this.thirties.length - 1]) {
					let info = await fetch(`${base}/fassungen/data/${page}`).then((r) => r.json());
					labels.forEach((label, index) => {
						const { preparedHTML, preparedDistribution } = prepareHTML(info.content[index], label);
						this.pages[index].push([page, preparedHTML]);
						this.distributions[index][page] = preparedDistribution;
					});
					this.books.push(info.meta.book);
					this.thirties.push(page);
				} else if (page === this.thirties[0] && page > 1) {
					this.fetchPage(page - 1);
				} else if (page === this.thirties[this.thirties.length - 1] && page !== NUMBER_OF_PAGES) {
					this.fetchPage(page + 1);
				}
			}
			tick().then(() => {
				addApparatTriggerListeners();
				addFasskommTriggerListeners();
				openFasskommFromHash();
			});
			return Promise.resolve();
		};
	}

	let localPages = new localPageClass();
	$effect(() => {
		// when the page number changes, fetch the corresponding data
		// we need to untrack here to avoid infinite loops, because fetchPage changes localPages.
		data.thirties;
		untrack(() => localPages.fetchPage(Number(data.thirties)));
	});
	let synchro = $state(true);
	let windowWidth = $state(0);
	/**@type {boolean|CSSStyleDeclaration} **/ let styles = $state(false);
	let mobileBreakpoint = $derived.by(() => {
		if (typeof styles === 'object') {
			return (
				windowWidth / (16 * Number(styles.getPropertyValue('--text-scaling'))) >=
				parseInt(styles.getPropertyValue('--breakpoint-lg'))
			);
		}
		return false;
	});
	onMount(() => {
		styles = getComputedStyle(document.documentElement);
	});

	// --------------------------------------
	// Fassungskommenatre
	// --------------------------------------
	// Store containing the content of the selected popover
	let FasskommStore = $state({
		/** @type { HTMLElement | undefined } */ elTrigger: undefined,
		dreissiger: '',
		verse: '',
		id: '',
		commentary: ''
	});

	const fillFasskommStore = (/** @type { HTMLElement } */ elTrigger, ignore = false) => {
		if (!ignore) {
			resetFasskommStore();
			const elData = elTrigger.dataset;
			FasskommStore.elTrigger = elTrigger;
			FasskommStore.dreissiger = elData.dreissiger ?? '';
			FasskommStore.verse = elData.verse ?? '';
			FasskommStore.id = elData.id ?? '';
			FasskommStore.commentary = decodeURIComponent(elData.commentary ?? '');
		}
	};
	const resetFasskommStore = () => {
		FasskommStore.elTrigger = undefined;
		FasskommStore.dreissiger = '';
		FasskommStore.verse = '';
		FasskommStore.id = '';
		FasskommStore.commentary = '';
	};
	const openFasskommFromHash = () => {
		const id = page.url.hash;
		if (!id) return;
		const el = document.querySelector(`a.fasskommanchor[href="${CSS.escape(id)}"]`);
		if (el instanceof HTMLAnchorElement && el.href) {
			el.click();
		}
	};

	// Triggers
	const addFasskommTriggerListeners = () => {
		removeFasskommTriggerListeners();
		document.querySelectorAll('.fasskommanchor').forEach((el) => {
			el.addEventListener('click', onClickFasskommTrigger, false);
		});
	};
	const removeFasskommTriggerListeners = () => {
		document.querySelectorAll(`.fasskommanchor`).forEach((el) => {
			el.removeEventListener('click', onClickFasskommTrigger);
		});
	};

	const onClickFasskommTrigger = (ev) => {
		const a = ev.target instanceof HTMLAnchorElement ? ev.target : ev.target?.closest?.('a');
		if (!a) return;

		ev.preventDefault();
		const href = a.getAttribute('href');

		if (browser && href) {
			const next = new URL(href, page.url);
			replaceState(next.href, {});
		}
		fillFasskommStore(a, false);
	};

	// --------------------------------------
	// Apparate
	// --------------------------------------
	// ApparatStrore contains the content of the selected popover
	let ApparatStore = $state({
		/** @type { HTMLElement | undefined } */ elTrigger: undefined,
		dreissiger: '',
		verse: '',
		title: '',
		structure_info: '',
		reading_info: ''
	});

	// Event Listeners for Popovers
	let timeoutonMouseLeaveApparatTrigger = $state();
	let timeoutonMouseLeaveApparatPopup = $state();
	let ignoreApparatLeave = $state(false);

	const fillApparatStore = (/** @type { HTMLElement } */ elTrigger, ignore = false) => {
		if (!ignore) {
			resetApparatStore();
			const elData = elTrigger.dataset;
			ApparatStore.elTrigger = elTrigger;
			ApparatStore.title = elData.title ?? '';
			ApparatStore.dreissiger = elData.dreissiger ?? '';
			ApparatStore.verse = elData.verse ?? '';
			ApparatStore.structure_info = decodeURIComponent(elData.structure_info ?? '');
			ApparatStore.reading_info = decodeURIComponent(elData.reading_info ?? '');
		}
	};
	const resetApparatStore = () => {
		ApparatStore.elTrigger = undefined;
		ApparatStore.title = '';
		ApparatStore.dreissiger = '';
		ApparatStore.verse = '';
		ApparatStore.structure_info = '';
		ApparatStore.reading_info = '';
	};

	const clearTimeouts = () => {
		clearTimeout(timeoutonMouseLeaveApparatTrigger);
		clearTimeout(timeoutonMouseLeaveApparatPopup);
	};

	const onClickApparatTrigger = (/** @type { Event } */ ev) => {
		ignoreApparatLeave = true;
		if (ev.target instanceof HTMLElement) {
			fillApparatStore(ev.target, false);
		}
	};
	const onMouseEnterApparatTrigger = (/** @type { Event } */ ev) => {
		clearTimeouts();
		if (ev.target instanceof HTMLElement) {
			fillApparatStore(ev.target, ignoreApparatLeave);
		}
	};
	const onMouseLeaveApparatTrigger = () => {
		if (!ignoreApparatLeave) {
			timeoutonMouseLeaveApparatTrigger = setTimeout(resetApparatStore, 500);
		}
	};
	const onMouseEnterApparatPopover = () => {
		clearTimeouts();
	};
	const onMouseLeaveApparatPopover = () => {
		if (!ignoreApparatLeave) {
			timeoutonMouseLeaveApparatPopup = setTimeout(resetApparatStore, 500);
		}
	};

	// -------------------------------------------------
	// Triggers
	const addApparatTriggerListeners = () => {
		removeApparatTriggerListeners();
		document.querySelectorAll('.verse .anchor').forEach((el) => {
			el.addEventListener('mouseenter', onMouseEnterApparatTrigger, false);
			el.addEventListener('mouseleave', onMouseLeaveApparatTrigger, false);
			el.addEventListener('click', onClickApparatTrigger, false);
		});
	};
	const removeApparatTriggerListeners = () => {
		document.querySelectorAll(`.verse .anchor`).forEach((el) => {
			el.removeEventListener('mouseenter', onMouseEnterApparatTrigger);
			el.removeEventListener('mouseleave', onMouseLeaveApparatTrigger);
			el.removeEventListener('click', onClickApparatTrigger);
		});
	};
	const closeApparatOnInteraction = () => {
		resetApparatStore();
		clearTimeouts();
		ignoreApparatLeave = false;
	};

	$effect(() => {
		// add eventListeners when synchro is switched
		synchro;
		addApparatTriggerListeners();
		addFasskommTriggerListeners();
	});

	$effect(() => {
		if (!mobileBreakpoint) {
			synchro = false;
		}
	});

	let wasFasskommOpen = false;
	$effect(() => {
		if (typeof window === 'undefined') return;
		const isOpen = !!FasskommStore.elTrigger;
		if (wasFasskommOpen && !isOpen && window.location.hash.startsWith('#fasskomm-')) {
			replaceState(`${page.url.pathname}${page.url.search}`, {});
		}
		wasFasskommOpen = isOpen;
	});

	let gotoThirties = $state(Number(data.thirties));
</script>

<svelte:window bind:innerWidth={windowWidth} />
<svelte:head>
	<title>Fassungsedition - Dreißiger {data.thirties}</title>
</svelte:head>

<section id="sectionFassungen" class="w-full" style="--verse-width: {verseWidth}ch">
	{#snippet nextPrevButton(
		/** @type {boolean} */ next,
		/** @type {String} */ page,
		/** @type {string} */ column
	)}
		<button
			class="btn preset-filled-primary-500 w-full mb-4 {column ? 'column-' + column : ''}"
			onclick={() =>
				goto(`${base}/fassungen/${page}`, {
					noScroll: true,
					keepFocus: true,
					replaceState: true
				})}
		>
			{next ? 'Nächsten Dreißiger anzeigen' : 'vorherigen Dreißiger anzeigen'}
		</button>
	{/snippet}
	<div class="flex items-baseline justify-between gap-4 flex-wrap my-4">
		<h1 class="h1 min-w-0">Fassungsedition</h1>
		<Zitierempfehlung mode="popup" citation={{ variant: 'fassungen' }} />
	</div>
	<ExpandableContent clampClass="line-clamp-3" class="mb-4 typography">
		<ErlaeuterungenFassungsedition />
	</ExpandableContent>
	<div class="grid gap-6 md:grid-cols-2 md:my-8">
		<div>
			<h2 class="h5">{localPages.books[localPages.thirties.indexOf(Number(data.thirties))]}</h2>
			<h3 class="h3 my-4">Dreißiger {data.thirties}</h3>
			<p>
				Eintextedition als <a
					class="anchor"
					target="_blank"
					href="https://data.parzival.digitaleditions.ch/api/pdf/Parzival_Eintextedition.pdf#page={data.thirties}"
				>
					PDF
				</a> aufrufen
			</p>
		</div>
		<div>
			{#if mobileBreakpoint}
				<Switch
					thumbInactive="bg-surface-800"
					controlInactive="bg-surface-100"
					name="synchro"
					checked={synchro}
					onCheckedChange={(e) => (synchro = e.checked)}
				>
					synchron scrollen
				</Switch>
			{/if}
			<form
				onsubmit={(e) => {
					e.preventDefault();
					localPages.reset();
					goto(`${base}/fassungen/${gotoThirties}`);
				}}
			>
				<label for="goto-thirties" class="block text-lg font-bold font-serif mb-2"
					>Dreißiger wählen</label
				>
				<input
					id="goto-thirties"
					type="number"
					placeholder="Dreißiger"
					class="input inline max-w-28"
					min="1"
					max={NUMBER_OF_PAGES}
					bind:value={gotoThirties}
				/>
				<button aria-label="suchen" class="btn preset-filled-primary-500">Anzeigen</button>
			</form>
		</div>
	</div>

	<!-- Modal for Fassungskommentar -->
	{#if FasskommStore.elTrigger}
		<FassungskommentarModal
			commentary={FasskommStore.commentary}
			id={FasskommStore.id}
			bind:openState={FasskommStore.elTrigger}
		/>
	{/if}

	<!-- Popover for Apparat -->
	{#if ApparatStore.elTrigger}
		<ApparatPopover
			resetPopup={closeApparatOnInteraction}
			onMouseEnter={onMouseEnterApparatPopover}
			onMouseLeave={onMouseLeaveApparatPopover}
			elTrigger={ApparatStore.elTrigger}
			dreissiger={ApparatStore.dreissiger}
			verse={ApparatStore.verse}
			title={ApparatStore.title}
			structure_info={ApparatStore.structure_info}
			reading_info={ApparatStore.reading_info}
		/>
	{/if}

	<!-- Fassungen Content -->
	{#if synchro}
		<FassungenSyncContent
			resetPopup={closeApparatOnInteraction}
			content={localPages.pages}
			distributions={localPages.distributions}
			titles={composureTitles}
			{nextPrevButton}
		/>
	{:else}
		<div class="grid lg:grid-cols-4 gap-4 my-4">
			{#each localPages.pages as fassung, i}
				<div>
					{#if fassung.length >= 2}
						<!-- when at least 2 pages are loaded, the one for the currect thirties should be loaded aswell  -->
						<FassungenContent
							resetPopup={closeApparatOnInteraction}
							pages={fassung}
							distribution={localPages.distributions[i]}
							title={composureTitles[i]}
							{nextPrevButton}
						/>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</section>
