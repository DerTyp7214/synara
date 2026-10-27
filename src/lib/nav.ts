/** Site navigation shared by every design's header and footer. */
export type NavLink = { href: string; label: string };

/** Main navigation (header). */
export const mainLinks: NavLink[] = [
	{ href: '/#features', label: 'Features' },
	{ href: '/docs/', label: 'Docs' },
	{ href: '/server/', label: 'Server' },
	{ href: '/download/', label: 'Download' }
];

/** Footer: source code and releases on GitHub. */
export const sourceLinks: NavLink[] = [
	{ href: 'https://github.com/DerTyp7214/synara-api', label: 'Server source' },
	{ href: 'https://github.com/DerTyp7214/SynaraDesktop', label: 'Desktop app source' },
	{ href: 'https://github.com/DerTyp7214/Synara', label: 'Releases' }
];

/** Footer: pages on this site. */
export const siteLinks: NavLink[] = [
	{ href: '/docs/', label: 'Docs' },
	{ href: '/server/', label: 'Run a server' },
	{ href: '/download/', label: 'Download' },
	{ href: '/privacy/', label: 'Privacy' }
];

/** Whether a main-nav link is the current page. Hash links (in-page sections) never are. */
export function isActiveLink(href: string, pathname: string): boolean {
	if (href.includes('#')) return false;
	return pathname === href || pathname.startsWith(href);
}
