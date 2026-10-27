/**
 * Theme (light/dark) and design (Retro/Modern) preferences, shared by the inline script in app.html,
 * ThemeToggle, DesignToggle and the design store. Keep the values here in sync with app.html.
 */
export type ThemePref = 'system' | 'light' | 'dark';
export type DesignPref = 'retro' | 'modern';

export const THEME_KEY = 'synara-theme';
export const DESIGN_KEY = 'synara-design';

/** theme-color META values and pre-paint backgrounds: design x theme (Modern from tokens.css). */
export const META_COLOR = {
	retro: { light: '#e6e5e0', dark: '#1c1c1e' },
	modern: { light: '#f1f1f1', dark: '#0e0e0e' }
} as const;

export function readThemePref(): ThemePref {
	try {
		const v = localStorage.getItem(THEME_KEY);
		return v === 'light' || v === 'dark' ? v : 'system';
	} catch {
		return 'system';
	}
}

/**
 * The design that is applied right now. The inline script in app.html has already resolved
 * `?design=`, localStorage and the default into the <html> attribute, so that is the source of truth.
 */
export function readDesignPref(): DesignPref {
	if (typeof document === 'undefined') return 'modern';
	return document.documentElement.getAttribute('data-design') === 'modern' ? 'modern' : 'retro';
}

/** Point the theme-color META tags at the current design x theme. */
function syncThemeColor(): void {
	const root = document.documentElement;
	const colors = META_COLOR[readDesignPref()];
	const theme = root.getAttribute('data-theme');
	document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
		if (theme === 'light' || theme === 'dark') m.content = colors[theme];
		else m.content = m.media.includes('light') ? colors.light : colors.dark;
	});
}

export function applyThemePref(pref: ThemePref): void {
	const root = document.documentElement;
	try {
		if (pref === 'system') localStorage.removeItem(THEME_KEY);
		else localStorage.setItem(THEME_KEY, pref);
	} catch {
		/* storage unavailable: still apply for this page view */
	}
	if (pref === 'system') root.removeAttribute('data-theme');
	else root.setAttribute('data-theme', pref);
	syncThemeColor();
}

/** Apply and remember a design. The HTML ships with data-design="modern"; Retro removes the attribute. */
export function applyDesignPref(pref: DesignPref): void {
	const root = document.documentElement;
	try {
		localStorage.setItem(DESIGN_KEY, pref);
	} catch {
		/* storage unavailable: still apply for this page view */
	}
	if (pref === 'modern') root.setAttribute('data-design', 'modern');
	else root.removeAttribute('data-design');
	syncThemeColor();
}
