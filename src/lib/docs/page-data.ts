import { flatNav, type DocPage, type NavGroup } from './load';

/**
 * Server data for a docs page. The rendered HTML is deliberately not part of it: SvelteKit would serialize it
 * into the page a second time. `+page.ts` supplies it instead (see `html.ts`).
 */
export function pageData(doc: DocPage, nav: NavGroup[]) {
	const flat = flatNav(nav);
	const href = doc.slug ? `/docs/${doc.slug}/` : '/docs/';
	const i = flat.findIndex((x) => x.href === href);
	const strip = (x: { title: string; href: string } | undefined) => (x ? { title: x.title, href: x.href } : null);
	return {
		title: doc.title,
		path: href,
		hasMermaid: doc.hasMermaid,
		// Docs that carry their own index list it under this heading; the TOC already is one.
		toc: doc.toc.filter((t) => t.text.trim().toLowerCase() !== 'table of contents'),
		editUrl: doc.editUrl,
		file: doc.file,
		sha: doc.sha.slice(0, 7),
		prev: i > 0 ? strip(flat[i - 1]) : null,
		next: i >= 0 && i < flat.length - 1 ? strip(flat[i + 1]) : null
	};
}
