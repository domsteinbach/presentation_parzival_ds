<script>
	import Popover from './Popover.svelte';

	/**
	 * Renders the Parzival citation block.
	 *
	 * `mode` selects between an inline `<p>` and a `Popover` whose trigger is
	 * the word "Zitierempfehlung" and whose content is the inline `<p>` plus
	 * a copy-to-clipboard button. In popup mode `aria-haspopup="dialog"` is
	 * set on the trigger button.
	 *
	 * `citation.variant` inserts a string after "Digitale Ausgabe":
	 * `'bare'` -> nothing, `'fassungen'` -> ` nach Fassungen`,
	 * `'eintextedition'` -> `, Eintextedition`.
	 *
	 * @typedef {{
	 *   mode?: 'inline' | 'popup',
	 *   citation: {
	 *     variant?: 'bare' | 'fassungen' | 'eintextedition'
	 *   }
	 * }} Props
	 */

	/** @type {Props} */
	let { mode = 'inline', citation } = $props();

	const lead = $derived.by(() => {
		const insert =
			citation.variant === 'fassungen'
				? ' nach Fassungen'
				: citation.variant === 'eintextedition'
					? ', Eintextedition'
					: '';
		return `Wolfram von Eschenbach, ›Parzival‹, Digitale Ausgabe${insert}, hg. von Michael Stolz in Zusammenarbeit mit Stefan Abel und einem internationalen Editionsteam, `;
	});

	const tail = ' (Zugriff: [aktuelles Datum])';
	const plainText = $derived(`${lead}parzival.unibe.ch${tail}`);

	/** @type {'idle' | 'success' | 'error'} */
	let copyStatus = $state('idle');
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let resetTimer;

	function scheduleReset() {
		clearTimeout(resetTimer);
		resetTimer = setTimeout(() => {
			copyStatus = 'idle';
		}, 2000);
	}

	async function copyCitation() {
		try {
			await navigator.clipboard.writeText(plainText);
			copyStatus = 'success';
		} catch {
			// Clipboard API can reject in insecure contexts or when permission
			// is denied. Surface the failure inline so the user can fall back to
			// manual selection.
			copyStatus = 'error';
		}
		scheduleReset();
	}
</script>

{#snippet body()}
	<p>{lead}parzival.unibe.ch{tail}</p>
{/snippet}

{#if mode === 'popup'}
	<Popover ariaHaspopup="dialog">
		{#snippet trigger()}Zitierempfehlung{/snippet}
		{#snippet content()}
			<div class="flex flex-col gap-2">
				<div class="flex items-start gap-3">
					<div class="min-w-0">{@render body()}</div>
					<button
						type="button"
						onclick={copyCitation}
						aria-label={copyStatus === 'success'
							? 'Zitierempfehlung kopiert'
							: 'Zitierempfehlung in die Zwischenablage kopieren'}
						title="In die Zwischenablage kopieren"
						class="btn-icon preset-filled-surface-50-950 shrink-0"
					>
						{#if copyStatus === 'success'}
							<i class="fa-solid fa-check" aria-hidden="true"></i>
						{:else}
							<i class="fa-solid fa-copy" aria-hidden="true"></i>
						{/if}
					</button>
				</div>
				<p aria-live="polite" class="min-h-[1.25rem] text-sm">
					{#if copyStatus === 'error'}
						Kopieren fehlgeschlagen. Bitte den Text manuell markieren und kopieren.
					{/if}
				</p>
			</div>
		{/snippet}
	</Popover>
{:else}
	{@render body()}
{/if}
