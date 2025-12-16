import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

export type ThemeName = 
	| 'modern'
	| 'hamlindigo'
	| 'wintry'
	| 'rocket'
	| 'sahara'
	| 'vintage'
	| 'seafoam'
	| 'crimson'
	| 'catppuccin'
	| 'cerberus'
	| 'concord'
	| 'fennec'
	| 'legacy'
	| 'mint'
	| 'mona'
	| 'nosh'
	| 'nouveau'
	| 'pine'
	| 'reign'
	| 'rose'
	| 'terminus'
	| 'vox'

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY_THEME = 'synara-theme';
const STORAGE_KEY_MODE = 'synara-mode';

const DEFAULT_THEME: ThemeName = 'crimson';

function getStoredTheme(): ThemeName {
	if (!browser || typeof localStorage === 'undefined') return DEFAULT_THEME;
	try {
		const stored = localStorage.getItem(STORAGE_KEY_THEME);
		return (stored as ThemeName) || DEFAULT_THEME;
	} catch {
		return DEFAULT_THEME;
	}
}

function getStoredMode(): ThemeMode {
	if (!browser || typeof localStorage === 'undefined') {
		if (typeof window !== 'undefined' && window.matchMedia) {
			return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}
		return 'dark';
	}
	try {
		const stored = localStorage.getItem(STORAGE_KEY_MODE);
		if (stored === 'light' || stored === 'dark') {
			return stored;
		}
		if (typeof window !== 'undefined' && window.matchMedia) {
			return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}
		return 'dark';
	} catch {
		if (typeof window !== 'undefined' && window.matchMedia) {
			return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}
		return 'dark';
	}
}

let initialTheme: ThemeName = DEFAULT_THEME;
let initialMode: ThemeMode = 'dark';

if (browser) {
	try {
		initialTheme = getStoredTheme();
		initialMode = getStoredMode();
	} catch {
	}
}

export const theme: Writable<ThemeName> = writable(initialTheme);
export const mode: Writable<ThemeMode> = writable(initialMode);

function applyTheme(themeValue: ThemeName, modeValue: ThemeMode) {
	if (!browser || typeof document === 'undefined') return;
	
	try {
		const html = document.documentElement;
		html.setAttribute('data-theme', themeValue);
		if (modeValue === 'dark') {
			document.documentElement.classList.remove('light');
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
			document.documentElement.classList.add('light');
		}
	} catch (error) {
		console.error('Failed to apply theme:', error);
	}
}

if (browser) {
	let currentThemeValue = initialTheme;
	let currentModeValue = initialMode;
	
	theme.subscribe((themeValue) => {
		currentThemeValue = themeValue;
		applyTheme(themeValue, currentModeValue);
	});
	
	mode.subscribe((modeValue) => {
		currentModeValue = modeValue;
		applyTheme(currentThemeValue, modeValue);
	});
	
	let themeInitialSync = true;
	let modeInitialSync = true;
	
	theme.subscribe((value) => {
		if (themeInitialSync) {
			themeInitialSync = false;
			return;
		}
		try {
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem(STORAGE_KEY_THEME, value);
			}
		} catch (error) {
			console.error('Failed to save theme to localStorage:', error);
		}
	});
	
	mode.subscribe((value) => {
		if (modeInitialSync) {
			modeInitialSync = false;
			return;
		}
		try {
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem(STORAGE_KEY_MODE, value);
			}
		} catch (error) {
			console.error('Failed to save mode to localStorage:', error);
		}
	});
}

if (browser) {
	try {
		applyTheme(initialTheme, initialMode);
	} catch {
	}
	
	window.addEventListener('DOMContentLoaded', () => {
		try {
			applyTheme(initialTheme, initialMode);
		} catch {
		}
	});
}

export const themeStore = {
	get theme() {
		let value: ThemeName = DEFAULT_THEME;
		theme.subscribe((v) => { value = v; })();
		return value;
	},
	
	get mode() {
		let value: ThemeMode = 'dark';
		mode.subscribe((v) => { value = v; })();
		return value;
	},
	
	setTheme(newTheme: ThemeName) {
		try {
			theme.set(newTheme);
		} catch (error) {
			console.error('Failed to set theme:', error);
		}
	},
	
	setMode(newMode: ThemeMode) {
		try {
			mode.set(newMode);
		} catch (error) {
			console.error('Failed to set mode:', error);
		}
	},
	
	toggleMode() {
		let currentMode: ThemeMode = 'dark';
		mode.subscribe((v) => { currentMode = v; })();
		themeStore.setMode(currentMode === 'dark' ? 'light' : 'dark');
	},
	
	getThemes(): ThemeName[] {
		return [
			'modern',
			'hamlindigo',
			'wintry',
			'rocket',
			'sahara',
			'vintage',
			'seafoam',
			'crimson',
			'catppuccin',
			'cerberus',
			'concord',
			'fennec',
			'legacy',
			'mint',
			'mona',
			'nosh',
			'nouveau',
			'pine',
			'reign',
			'rose',
			'terminus',
			'vox',
		];
	}
};
