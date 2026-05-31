import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

// Verssynopse is not built in this fork — redirect to the
// canonical first-page URL, which itself redirects to upstream
// (see [thirties=thirties]/[verse]/+page.svelte).
/** @type {import('./$types').PageLoad} */
export async function load() {
	return redirect(302, `${base}/verssynopse/1/01`);
}
