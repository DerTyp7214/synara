/** Theme preference shared by the inline script in app.html and ThemeToggle. */
export type ThemePref = 'system' | 'light' | 'dark';

export const THEME_KEY = 'synara-theme';
const META_COLOR = { light: '#e6e5e0', dark: '#1c1c1e' } as const;

export function readThemePref(): ThemePref {
	try {
		const v = localStorage.getItem(THEME_KEY);
		return v === 'light' || v === 'dark' ? v : 'system';
	} catch {
		return 'system';
	}
}

export function applyThemePref(pref: ThemePref): void {
	const root = document.documentElement;
	try {
		if (pref === 'system') localStorage.removeItem(THEME_KEY);
		else localStorage.setItem(THEME_KEY, pref);
	} catch {
		/* storage unavailable: still apply for this page view */
	}
	const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
	if (pref === 'system') {
		root.removeAttribute('data-theme');
		metas.forEach((m) => {
			const light = m.media.includes('light');
			m.content = light ? META_COLOR.light : META_COLOR.dark;
		});
	} else {
		root.setAttribute('data-theme', pref);
		metas.forEach((m) => (m.content = META_COLOR[pref]));
	}
}
