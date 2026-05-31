import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

// Verssynopse is not prerendered in this fork. Its data needs the
// TEI Publisher / eXist-DB stack which we do not run in CI. Users are
// redirected client-side to the upstream deployment (see +page.svelte
// and URL_UPSTREAM in $lib/constants).
export const prerender = false;
export const ssr = false;

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const verseparts = params?.verse?.split('-');
	if (verseparts[0].length === 1) {
		return redirect(302, `${base}/verssynopse/${params.thirties}/0${params.verse}`);
	}
	return {};
}
