<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { URL_UPSTREAM } from '$lib/constants';

	let target = $derived(`${URL_UPSTREAM}/verssynopse/${page.params.thirties}/${page.params.verse}`);

	onMount(() => {
		window.location.replace(target);
	});
</script>

<svelte:head>
	<title>Weiterleitung zur Verssynopse</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<p>
	Die Verssynopse wird auf <a href={target}>{target}</a> weitergeleitet.
</p>
