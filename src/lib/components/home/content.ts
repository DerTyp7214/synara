/*
 * Home page copy as data, so the presentation can be restyled without touching the facts.
 * Only claims backed by the server/app code belong here.
 */

export type Platform = { id: 'android' | 'desktop' | 'apple'; name: string; detail: string; soon?: boolean };

/** Clients that connect to your server ("how it works"). */
export const platforms: Platform[] = [
	{ id: 'android', name: 'Android', detail: 'Android 12 and newer. Offline downloads, a player widget.' },
	{ id: 'desktop', name: 'Desktop', detail: 'Linux, Windows and macOS. Visualizer, lyrics, Discord presence.' },
	{ id: 'apple', name: 'Apple', detail: 'iOS, iPadOS, macOS, tvOS, watchOS and CarPlay.', soon: true }
];

/** What the server node in the diagram shows. */
export const serverFacts: { term: string; value: string; mono?: boolean }[] = [
	{ term: 'Library', value: 'FLAC, WAV, AIFF' },
	{ term: 'Streams as', value: 'Original, or Opus / AAC' },
	{ term: 'Database', value: 'SQLite or Postgres' },
	{ term: 'Lives at', value: 'your-server:8080', mono: true }
];

export const leadFeatures = {
	lossless: {
		title: 'Lossless at the source',
		body: 'Your library is kept in a lossless format: FLAC by default, or WAV/AIFF. Synara transcodes to Opus or AAC on the fly, or ahead of time, when a connection or download needs it; the lossless file stays untouched.',
		formats: ['Original', 'Opus', 'AAC']
	},
	imports: {
		title: 'Bring your music',
		body: 'Import into your own library from the services you already use. Tidal imports use your own account and include Dolby Atmos.',
		sources: ['Tidal', 'Apple Music', 'YouTube', 'SoundCloud']
	}
};

export const features: { title: string; body: string }[] = [
	{
		title: 'MusicBrainz metadata',
		body: 'Tracks, albums and artists are matched and enriched from MusicBrainz, so credits and release info stay consistent.'
	},
	{
		title: 'Synced lyrics',
		body: 'Lyrics from Better Lyrics, Unison, LyricsPlus, KuGou, LRCLIB and YouTube Music, or your own .lrc, .ttml and .lyricsfile.yaml files next to the tracks. Word-synced, line-synced or plain, depending on the source, and you can pin the version you prefer.'
	},
	{
		title: 'Scrobbling and history',
		body: 'The apps scrobble to ListenBrainz and Last.fm, and the server imports your ListenBrainz history.'
	},
	{
		title: 'Shared listens',
		body: 'Two accounts on the same server that use the same ListenBrainz account can be linked, so their plays count as one listening history in recent listens, stats and top lists, and optionally in recommendations. An admin can link any two accounts.'
	},
	{
		title: 'Multi-device playback',
		body: 'Share one queue across your devices, hand it from desktop to phone, and control playback on one device from another.'
	},
	{
		title: 'Radio and podcasts',
		body: 'Radio and recommendations built from your library and listening history, plus podcasts in the same apps.'
	},
	{
		title: 'Subsonic-compatible API',
		body: 'Keep using a Subsonic player you already like. It connects to `/rest` with a Subsonic password or API key you create in Synara.'
	},
	{
		title: 'MCP server',
		body: 'Let an AI assistant answer questions about your listening history. Read-only, nothing can be changed.'
	},
	{ title: 'Plugins', body: 'Add importers, indexers, routes, scheduled tasks or screens with a Kotlin or Java plugin.' },
	{ title: 'Philips Hue', body: 'Light sync during playback.' },
	{ title: 'Backups', body: 'Backups and restore.' }
];

export const apps: { name: string; note: string; soon?: boolean; items: string[] }[] = [
	{
		name: 'Desktop',
		note: 'Linux, Windows, macOS',
		items: ['MPRIS and a D-Bus API on Linux', 'Discord rich presence', 'Fullscreen visualizer and lyrics', 'Gapless playback']
	},
	{
		name: 'Android',
		note: 'Android 12 and newer',
		items: ['Offline downloads', 'A home screen player widget', 'Sleep timer']
	},
	{
		name: 'Apple',
		note: 'Coming soon',
		soon: true,
		items: ['iPhone and iPad', 'Mac', 'Apple TV and Apple Watch', 'CarPlay']
	}
];

export const setupSteps = [
	'Save the file as `compose.yaml` and change the secrets.',
	'Run `docker compose up -d`.',
	"Open the app, enter your server's address and log in."
];

/** Page copy around the components above. */
export const hero = {
	title: 'Your music, bit\u00a0for\u00a0bit.',
	lead: 'Synara is a music server you run on your own hardware. Your FLAC, WAV and AIFF files stay lossless, and native apps on Android and desktop play them the way they were recorded.',
	licence: 'The server is open source under GPL-2.0. The apps are free.',
	/** Format indicators on the front panel: the library formats above. */
	formats: ['FLAC', 'WAV', 'AIFF']
};

export const sections = {
	how: {
		title: 'One server. Every device you listen on.',
		lead: "You run Synara once, at home or on a server you rent. Your apps connect to it, wherever you are. Nothing goes through a service you don't control.",
		note: 'Also works with any Subsonic-compatible player, and with AI assistants that speak MCP.'
	},
	features: { title: 'Built for people who keep their own library.' },
	host: {
		title: 'Up in one compose file.',
		lead: 'The smallest setup is a single container with SQLite. Add Postgres, a Redis cluster and the trained recommendation model later, when your library grows.',
		postgres: 'Prefer Postgres?'
	},
	cta: {
		title: 'Get the apps.',
		lead: 'Desktop for Linux, Windows and macOS. Android 12 and newer. Apple apps are coming soon.'
	}
};
