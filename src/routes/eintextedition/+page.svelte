<script>
	import ExpandableContent from '$lib/components/ExpandableContent.svelte';
	import ErlaeuterungenEintextEdition from '$lib/components/erlaeuterungen-components/ErlaeuterungenEintextEdition.svelte';
	import Zitierempfehlung from '$lib/components/Zitierempfehlung.svelte';
</script>

<svelte:head>
	<title>Eintextedition</title>
</svelte:head>

<div class="container mx-auto typography">
	<div class="flex items-baseline justify-between gap-4 flex-wrap">
		<h1 class="min-w-0">Eintextedition</h1>
		<Zitierempfehlung mode="popup" citation={{ variant: 'eintextedition' }} />
	</div>
	<ExpandableContent clampClass="line-clamp-3" class="mb-8 typography">
		<ErlaeuterungenEintextEdition />
	</ExpandableContent>
	<embed
		src="https://data.parzival.digitaleditions.ch/api/pdf/Parzival_Eintextedition.pdf"
		width="100%"
		height="800px"
		type="application/pdf"
	/>
</div>
