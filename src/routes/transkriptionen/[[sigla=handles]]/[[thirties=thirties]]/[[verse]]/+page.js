import { URL_STATIC_API, URL_UPSTREAM } from '$lib/constants';
import { metadata } from '$lib/data/metadata';
import filenameFromHandleAndId from '$lib/functions/filenameFromHandleAndId';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	if (!params.sigla) {
		return error(404, params.verse);
	} else if (!params.thirties) {
		return error(404, [params.sigla, params.verse].join('/'));
	}
	const { codices, fragments } = await metadata;
	const sigla = params.sigla?.split('-');

	/** @type string | boolean */
	let thirties = params.thirties ?? '1';
	/** @type string | boolean */
	let verse = params.verse?.padStart(2, '0') ?? '01';

	const ranges = await fetch(`${URL_STATIC_API}/json/contiguous_ranges.json`).then((res) =>
		res.json()
	);
	const pageMeta = sigla?.map((handle) => {
		return fetch(`${URL_STATIC_API}/json/metadata-ms-page/${handle}.json`).then((r) => r.json());
	});

	// if params.thirties is not defined, we need to find the lowest thirty & verse that exists in all siglas
	if (sigla?.length === 1) {
		if (!params.thirties) {
			thirties = false;
			(await pageMeta[0])[sigla[0]].forEach((/** @type {{id: String, l: String[]}} **/ page) => {
				if (page.id.includes(`${sigla[0]}001`)) {
					const [tThirty, tVerse] = page.l[0].split('.');
					if (!thirties || Number(tThirty) < Number(thirties)) {
						thirties = tThirty;
						verse = tVerse;
					}
				}
			});
		} else if (!params.verse && typeof thirties === 'string') {
			verse = false;
			(await pageMeta[0])[sigla[0]].some((/** @type {{id: String, l: String[]}} **/ page) => {
				const newVerse = page.l
					.find((/** @type {String} **/ l) => l?.startsWith(String(thirties)))
					?.split('.')[1];
				if (newVerse) {
					verse = newVerse;
					return true;
				}
			});
		}
	}

	const meta = sigla?.map(async (handle, i) => {
		const data = await pageMeta[i];
		/**  @type {{ iiif: string | Promise<any>, id: string, tpData: Promise<{content: string}>, overlay: string }[]} */
		let returnObjects = [];
		if (thirties) {
			const selectedIndex = data[handle].findIndex(
				(/** @type {{ l: string, id:string | string[]; }} */ entry) =>
					entry.l.includes(`${thirties}.${verse}`)
			);
			if (selectedIndex === -1) {
				console.warn(`No page found for ${handle} with thirties ${thirties} and verse ${verse}.`);
				// loop through the l array of all pages and find the page that contains the thirties that is closest to the requested thirties
				const closestPages = data[handle].reduce(
					(closest, current, i, array) => {
						const lowestThirties = Number(current.l[0]?.split('.')[0]);
						if (lowestThirties < Number(thirties)) {
							let returnArray = [];
							if (i > 0) {
								returnArray.push(array[i - 1]);
							}
							returnArray.push({ ...current, active: true });
							if (i < array.length - 1) {
								returnArray.push(array[i + 1]);
							}
							return returnArray;
						}
						return closest;
					},
					[{ ...data[handle][0], active: true }, data[handle][1]]
				);
				returnObjects = closestPages;
			} else {
				if (selectedIndex > 0) {
					returnObjects.push(data[handle][selectedIndex - 1] ?? {});
				}
				returnObjects.push({ ...data[handle][selectedIndex], active: true });
				if (selectedIndex <= data[handle].length - 1) {
					returnObjects.push(data[handle][selectedIndex + 1] ?? {});
				}
			}
		} else {
			returnObjects = [data[handle][0], data[handle][1]];
		}
		returnObjects.map((returnObject) => {
			if (returnObject.iiif && typeof returnObject.iiif === 'string') {
				returnObject.iiif = fetch(returnObject.iiif).then((res) => {
					if (!res.ok) {
						console.error('Failed to fetch iiif', res);
						return false;
					}
					return res.json();
				});
			}
			if (returnObject.id) {
				returnObject.tpData = fetch(
					`${URL_UPSTREAM}/transkriptionen/data/${handle.toLowerCase()}/${returnObject.id}`
				).then((r) => {
					return r.json();
				});

				returnObject.overlay = `${URL_STATIC_API}/svg/${filenameFromHandleAndId(handle, returnObject.id)}.svg`;
			}
			return returnObject;
		});
		return returnObjects.length
			? returnObjects
			: [{ tpData: false, iiif: false, page: false, overlay: false }];
	});

	return {
		thirties,
		verse,
		codices,
		fragments,
		content: sigla?.map((witnes, i) => {
			return {
				sigla: witnes,
				meta: meta ? meta[i] : false
			};
		}),
		ranges: ranges['contiguous-ranges'].filter((r) => sigla?.includes(r.label)),
		pageMeta: (await Promise.all(pageMeta)).map((data, i) => {
			return data[sigla[i]].map((page) => {
				return { id: page.id, l: page.l[0], iiif: page.iiif };
			});
		})
	};
}
