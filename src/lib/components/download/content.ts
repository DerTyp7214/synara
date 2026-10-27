/*
 * /download/ copy as data, so the presentation can be restyled without touching the facts.
 * Release logic (URLs, tags, OS detection) lives in $lib/releases.ts.
 */

export const intro = {
	title: 'Download Synara',
	lead: "The apps are free. They connect to a Synara server you run yourself, so start there if you don't have one yet."
};

export const channelNotes = {
	stable: 'Release builds. Android has one; desktop and the server have none yet, so they use the current dev builds.',
	dev: 'Built from the latest commit. New features first, and sometimes new bugs.'
} as const;

export const desktop = {
	body: 'Linux and Windows (x64), macOS (Apple Silicon). Fullscreen visualizer and lyrics, Discord rich presence, and MPRIS plus a D-Bus API on Linux.',
	classic: 'The same app in a standard system window, for setups where the transparent custom window causes problems.',
	/** Shown on Stable while there is no stable desktop release (see STABLE_DESKTOP_BASE in releases.ts). */
	fallback: 'No stable release yet. These are the current builds from the dev channel.'
};

export const android = {
	body: 'Android 12 and newer. Offline downloads, a home screen player widget and a sleep timer.',
	install: 'Install the APK directly; allow installs from your browser when Android asks.'
};

export const apple = {
	body: 'Native apps for iPhone, iPad, Mac, Apple TV, Apple Watch and CarPlay are in the works.',
	/** Shown to visitors on iOS. */
	meanwhile: 'Until then, a Subsonic-compatible player can connect to your server.'
};

export const server = {
	body: 'A Docker image. Run it with Compose on any machine you control.',
	fallback: 'No stable server image yet. Use the dev channel image below.'
};
