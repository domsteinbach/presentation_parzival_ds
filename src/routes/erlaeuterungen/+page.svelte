<script>
	import H2Hoverable from '$lib/components/H2Hoverable.svelte';
	import ErlaeuterungenEintextEdition from '$lib/components/erlaeuterungen-components/ErlaeuterungenEintextEdition.svelte';
	import ErlaeuterungenFassungsedition from '$lib/components/erlaeuterungen-components/ErlaeuterungenFassungsedition.svelte';
	import ErlaeuterungenTranskriptionen from '$lib/components/erlaeuterungen-components/ErlaeuterungenTranskriptionen.svelte';
	import Zitierempfehlung from '$lib/components/Zitierempfehlung.svelte';
</script>

<svelte:head>
	<title>Erläuterungen</title>
</svelte:head>

<div class="container mx-auto typography">
	<h1 class="h1 mb-4">
		Erläuterungen zur Fassungsedition, zur Eintextedition und zu den Transkriptionen
	</h1>
	<div class="flex items-baseline justify-between gap-4 flex-wrap">
		<H2Hoverable name="Fassungsedition"></H2Hoverable>
		<Zitierempfehlung mode="popup" citation={{ variant: 'fassungen' }} />
	</div>
	<ErlaeuterungenFassungsedition />
	<div class="flex items-baseline justify-between gap-4 flex-wrap">
		<H2Hoverable name="Eintextedition (Kritische Edition im PDF-Format)"></H2Hoverable>
		<Zitierempfehlung mode="popup" citation={{ variant: 'eintextedition' }} />
	</div>
	<ErlaeuterungenEintextEdition />
	<div class="flex items-baseline justify-between gap-4 flex-wrap">
		<H2Hoverable name="Transkriptionen (auch relevant für die Darstellung in der Verssynopse)"
		></H2Hoverable>
		<Zitierempfehlung mode="popup" citation={{ variant: 'bare' }} />
	</div>
	<ErlaeuterungenTranskriptionen />
</div>
