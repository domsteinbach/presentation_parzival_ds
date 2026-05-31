export const URL_STATIC_API = `https://data.parzival.digitaleditions.ch/api`;

export const URL_TEI_PB = `http://localhost:8081/exist/apps/parzival/api`;

// Upstream prerendered page data (fassungen, transkriptionen, verssynopse).
// Used by the runtime fetches in this fork to avoid prerendering the full
// site locally — saves a lot of build time on preview deployments.
export const URL_UPSTREAM = `https://parzival.unibe.ch`;

export const URL_IIIF = `https://iiif.ub.unibe.ch/image/v3/parzival`;

export const summaryLabel = 'Fassungen';
export const fragmentLabel = 'Fragmente';

export const NUMBER_OF_PAGES = 827;
