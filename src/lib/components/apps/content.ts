/*
 * /apps/ copy as data. Product claims come from the fact-checked copy in home/content.ts and
 * download/content.ts (imported, not retyped). Captions only name what a screenshot shows.
 * No semicolons in copy.
 */
import { apps, features, setupSteps } from '$lib/components/home/content';
import { android, apple, desktop, intro } from '$lib/components/download/content';
import type { ShotKey } from './shots';

const feature = (title: string) => {
	const f = features.find((x) => x.title === title);
	if (!f) throw new Error(`Unknown feature: ${title}`);
	return f.title;
};
const appItem = (app: string, item: string) => {
	const found = apps.find((a) => a.name === app)?.items.find((i) => i === item);
	if (!found) throw new Error(`Unknown app item: ${app} / ${item}`);
	return found;
};

export const page = {
	title: 'Apps',
	lead: intro.lead
};

export type Shot = {
	key: ShotKey;
	caption: string;
	alt: string;
	/** A second shot of the same screen, revealed with a slider (RevealShot). */
	reveal?: { key: ShotKey; alt: string; label: string; note: string };
};
export type Frame = 'iphone' | 'pixel' | 'window';

export type AppPlatform = {
	id: 'apple' | 'android' | 'desktop';
	/** Short name for the jump links. */
	short: string;
	title: string;
	body: string;
	/** Platforms, as chips. */
	platforms: string[];
	soon?: boolean;
	download?: { href: string; label: string };
	frame: Frame;
	hero: Shot;
	screens: Shot[];
	/** Connect, log in, listen. */
	setup: Shot[];
	extras: (Shot & { frame: 'card' | 'pixel-top' | 'watch' | 'window'; tint?: 'light-years' | 'directionless' })[];
	/** The setup sheets shown after the first login. */
	sheets?: SetupSheet[];
};

export type SetupSheet = {
	title: string;
	shot: ShotKey;
	alt: string;
	features: { name: string; body: string; on: PlatformRow[] }[];
};

/** Platform ids for the setup-sheet chips, in display order. */
export const PLATFORM_ORDER = ['iphone', 'ipad', 'mac', 'tv', 'watch', 'android', 'desktop'] as const;
export type PlatformId = (typeof PLATFORM_ORDER)[number];
export const platformNames: Record<PlatformId, string> = {
	iphone: 'iPhone',
	ipad: 'iPad',
	mac: 'Mac',
	tv: 'Apple TV',
	watch: 'Apple Watch',
	android: 'Android',
	desktop: 'Desktop'
};

/** Where each setup feature exists, from the verified feature x platform matrix (app source, 2026-10-27).
 * iPad shares every iPhone feature except CarPlay. */
const ON = {
	sync: ['iphone', 'ipad', 'mac', 'desktop'],
	controlled: ['iphone', 'ipad', 'mac', 'tv', 'android', 'desktop'],
	controls: ['iphone', 'ipad', 'mac', 'watch', 'desktop'],
	lockScreen: ['iphone', 'ipad', 'mac', 'desktop'],
	podcasts: ['iphone', 'ipad', 'mac', 'watch', 'android', 'desktop'],
	calendar: ['iphone', 'ipad', 'mac'],
	recaps: ['iphone', 'ipad', 'android']
} satisfies Record<string, PlatformId[]>;

/** One chip row: an optional caption, then the platforms. */
export type PlatformRow = { label?: string; platforms: PlatformId[] };
const on = (platforms: PlatformId[], label?: string): PlatformRow => ({ label, platforms });

/** The sheets the iOS app shows after the first login. Captions follow the sheets' own text. */
export const sheetsIntro = {
	title: 'After you log in',
	body: 'The app asks how this device should work with your others. You can change this any time in Settings.'
};

/** The setup sequence, from setupSteps ("Open the app, enter your server's address and log in."). */
export const setup = {
	title: 'Connect, log in, listen',
	body: setupSteps[2],
	steps: ["Enter your server's address", 'Log in', 'Listen']
};

export const platforms: AppPlatform[] = [
	{
		id: 'apple',
		short: 'Apple',
		title: 'iPhone, iPad, Mac and more',
		body: apple.body,
		platforms: ['iPhone', 'iPad', 'Mac', 'Apple TV', 'Apple Watch', 'CarPlay'],
		soon: true,
		frame: 'iphone',
		hero: { key: 'ios-now-playing', caption: 'Now playing', alt: 'Synara on iPhone playing Red Giant by Stellardrone, with the Light Years cover' },
		screens: [
			{
				key: 'ios-home',
				caption: 'Colorful Home Cards',
				alt: 'The iPhone home screen of Synara with neutral cards for Liked Songs, Downloaded Songs, Mixes, Radio and Listening Stats',
				// The setting's name in the iOS app (Settings > General, settings_colorful_home_cards_title).
				reveal: {
					key: 'ios-home-colorful',
					alt: 'The same home screen with Colorful Home Cards on: pink, green, purple, orange and cyan cards',
					label: 'Reveal the colorful home cards',
					note: 'A switch in Settings, under General, on iPhone and iPad.'
				}
			},
			{ key: 'ios-album', caption: 'Album', alt: 'The Light Years album by Stellardrone on iPhone, with Play and Shuffle buttons and the track list' },
			{ key: 'ios-lyrics', caption: feature('Synced lyrics'), alt: 'Synced lyrics for The Nest by Josh Woodward on iPhone, with the current line highlighted' },
			{ key: 'ios-stats', caption: 'Listening stats', alt: 'Listening stats on iPhone for all time: listens, time listened, streaks and top songs' }
		],
		setup: [
			{ key: 'ios-connect', caption: setup.steps[0], alt: 'The Connect to Synara screen on iPhone with server host and port fields' },
			{ key: 'ios-login', caption: setup.steps[1], alt: 'The Sign In screen on iPhone with username and password fields' },
			{ key: 'ios-now-playing', caption: setup.steps[2], alt: 'Synara on iPhone playing Red Giant by Stellardrone' }
		],
		extras: [
			{ key: 'ios-widget', frame: 'card', caption: 'Home Screen widget', alt: 'The Synara Home Screen widget on iPhone showing The Nest by Josh Woodward, with play and skip buttons' },
			{ key: 'ios-watch', frame: 'watch', tint: 'directionless', caption: 'Apple Watch', alt: 'Synara on Apple Watch playing My Luck by Broke For Free' }
		],
		sheets: [
			{
				title: 'Sync This Device',
				shot: 'ios-setup-sync',
				alt: 'The Sync This Device sheet on iPhone with switches for Sync Queue, Sync settings and Sync scrobbler accounts, and a Turn On Sync button',
				features: [
					{ name: 'Sync Queue', body: 'Keeps the play queue the same on all your devices. While a device is playing, changes from another device show up as a banner instead of being applied right away.', on: [on(ON.sync)] },
					{ name: 'Sync settings', body: 'Keeps your preferences the same on every device signed in to this account.', on: [on(ON.sync)] },
					{ name: 'Sync scrobbler accounts', body: 'Encrypts your ListenBrainz and Last.fm credentials with a passphrase before they leave the device. You use the same passphrase on every device.', on: [on(ON.sync)] }
				]
			},
			{
				title: 'Remote control',
				shot: 'ios-setup-remote',
				alt: 'The Remote control sheet on iPhone with switches for Allow remote control and Lock screen controls, and a Continue button',
				features: [
					{ name: 'Allow remote control', body: 'Other devices signed in to your account can control playback on this device.', on: [on(ON.controlled, 'Can be controlled'), on(ON.controls, 'Controls other devices')] },
					{ name: 'Lock screen controls', body: "The lock screen, Control Center and your headphone buttons show and control the device you're controlling. On the Mac this is called Media controls. On desktop the system media controls do the same (MPRIS on Linux, the Windows media controls, Now Playing on macOS).", on: [on(ON.lockScreen)] }
				]
			},
			{
				title: 'Optional features',
				shot: 'ios-setup-optional',
				alt: 'The Optional features sheet on iPhone with switches for podcasts, Release Calendar, Weekly Recap and Monthly Recap, and a Continue button',
				features: [
					{ name: 'Podcasts', body: 'Adds podcasts to Library and Home with their own player, kept apart from your music.', on: [on(ON.podcasts)] },
					{ name: 'Release Calendar', body: 'Keeps upcoming releases in a dedicated Synara calendar and refreshes it daily.', on: [on(ON.calendar)] },
					{ name: 'Weekly and Monthly Recap', body: 'Your top artist and track of the past week on Monday mornings, and of the past month on the 1st.', on: [on(ON.recaps)] }
				]
			}
		]
	},
	{
		id: 'android',
		short: 'Android',
		title: 'Synara for Android',
		body: android.body,
		platforms: [apps.find((a) => a.name === 'Android')!.note],
		download: { href: '/download/', label: 'Download' },
		frame: 'pixel',
		hero: { key: 'android-now-playing', caption: 'Now playing', alt: 'Synara on Android playing Light Years by Stellardrone' },
		screens: [
			{ key: 'android-home', caption: 'Home', alt: 'The Android home screen of Synara with Liked Songs, Downloaded Songs, Radio, Mixes, Listening Stats and recently played albums' },
			{ key: 'android-album', caption: 'Album', alt: 'The Light Years album by Stellardrone on Android with its track list' },
			{ key: 'android-lyrics', caption: feature('Synced lyrics'), alt: 'Synced lyrics on Android, with the current line highlighted' },
			{ key: 'android-stats', caption: 'Listening stats', alt: 'Listening stats on Android for all time: listens, time listened, streaks and top songs' }
		],
		setup: [
			{ key: 'android-connect', caption: setup.steps[0], alt: 'The Setup Synara Server screen on Android with host and port fields' },
			{ key: 'android-login', caption: setup.steps[1], alt: 'The Login screen on Android with username and password fields' },
			{ key: 'android-now-playing', caption: setup.steps[2], alt: 'Synara on Android playing Light Years by Stellardrone' }
		],
		extras: [
			{ key: 'android-widget', frame: 'card', tint: 'light-years', caption: appItem('Android', 'A home screen player widget'), alt: 'The Synara player widget on an Android home screen showing Light Years by Stellardrone, with previous, pause and next buttons' },
			{ key: 'android-notification', frame: 'pixel-top', tint: 'light-years', caption: 'Media controls', alt: 'Android quick settings with the Synara media controls for Light Years by Stellardrone' }
		]
	},
	{
		id: 'desktop',
		short: 'Desktop',
		title: 'Synara for desktop',
		body: desktop.body,
		platforms: ['Linux (x64)', 'Windows (x64)', 'macOS (Apple Silicon)'],
		download: { href: '/download/', label: 'Download' },
		frame: 'window',
		hero: { key: 'desktop-album', caption: 'Album', alt: 'The Synara desktop app showing the Light Years album by Stellardrone, with the library sidebar and the player bar' },
		screens: [
			{ key: 'desktop-visualizer', caption: appItem('Desktop', 'Fullscreen visualizer and lyrics'), alt: 'The fullscreen player on desktop with the Light Years cover over a starfield and a waveform visualizer' },
			{ key: 'desktop-library', caption: 'Library', alt: 'The albums in the desktop library, shown as a grid of covers' },
			{ key: 'desktop-stats', caption: 'Listening stats', alt: 'Listening stats on desktop with totals, streaks and a listen clock by hour and weekday' }
		],
		setup: [
			{ key: 'desktop-connect', caption: setup.steps[0], alt: 'The Connect to Synara Server dialog on desktop with host, port and path fields' },
			{ key: 'desktop-login', caption: setup.steps[1], alt: 'The Login dialog on desktop with username and password fields' },
			{ key: 'desktop-album', caption: setup.steps[2], alt: 'The Synara desktop app showing the Light Years album by Stellardrone' }
		],
		extras: [
			{ key: 'desktop-lyrics', frame: 'window', caption: feature('Synced lyrics'), alt: 'Synced lyrics in the fullscreen player on desktop for The Nest by Josh Woodward' },
			{ key: 'desktop-queue', frame: 'window', caption: 'Queue', alt: 'The queue beside the Light Years cover in the fullscreen player on desktop' }
		]
	}
];

/* ---- Demo content credits ---- */

export const demo = {
	title: 'Demo content',
	body: 'The screenshots show the apps connected to a demo server. The music on it is licensed under Creative Commons, and these are the albums whose covers appear above.'
};

export type Credit = { artist: string; album: string; year: string; licence: string; licenceUrl: string; source: string; note?: string };

const BY4 = { licence: 'CC BY 4.0', licenceUrl: 'https://creativecommons.org/licenses/by/4.0/' };

/** Every album whose cover appears in the screenshots on /apps/ (the desktop library shows all nine). */
export const credits: Credit[] = [
	{ artist: 'Stellardrone', album: 'Light Years', year: '2013', ...BY4, source: 'https://stellardrone.bandcamp.com/album/light-years' },
	{ artist: 'Broke For Free', album: 'Directionless EP', year: '2011', ...BY4, source: 'https://brokeforfree.bandcamp.com/album/directionless-ep' },
	{
		artist: 'Josh Woodward',
		album: 'Addressed to the Stars',
		year: '2016',
		...BY4,
		source: 'https://www.joshwoodward.com/song/thenest',
		note: 'The cover is the one that ships with the CC BY release.'
	},
	{ artist: 'Tale Twist', album: 'Wry Way', year: '2016', ...BY4, source: 'https://archive.org/details/tranz060TaleTwist-WryWay' },
	{
		artist: 'Andy G. Cohen',
		album: 'Through the Lens',
		year: '2015',
		...BY4,
		source: 'https://archive.org/details/Andy_G._Cohen_-_Through_The_Lens_Album',
		note: "The cover is derived from ‘My World is Upside Down’ by Katelyn Kenderdine (CC BY 3.0). ‘Bumbler’ uses ‘playground 04’ by klankbeeld (CC BY 3.0)."
	},
	{
		artist: 'Jahzzar',
		album: 'Bunk',
		year: '2012',
		licence: 'CC BY-SA 4.0',
		licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
		source: 'https://jahzzar.bandcamp.com/album/bunk'
	},
	{
		artist: 'Marco Trovatello',
		album: 'Not At All',
		year: '2018',
		...BY4,
		source: 'https://archive.org/details/Wuerfel23-Marco_Trovatello-Not_At_All',
		note: "Cover by Rosa and Ada Trovatello. The fire sound on ‘Southfolk’ is by Mike Koenig (CC BY 3.0)."
	},
	{
		artist: 'Hairy Larry and The Flying Hungarians',
		album: 'Blues For Peace',
		year: '2008',
		licence: 'CC BY 3.0',
		licenceUrl: 'https://creativecommons.org/licenses/by/3.0/',
		source: 'https://archive.org/details/blues_for_peace_cd'
	},
	{
		artist: 'Gregory Tait',
		album: 'Schumann: Kinderszenen, Op. 15 (Selections)',
		year: '2020',
		...BY4,
		source: 'https://archive.org/details/schumann-kinderszenen-op.-15',
		note: "The cover uses William-Adolphe Bouguereau’s ‘Childhood Idyll’ (1900), which is in the public domain."
	}
];
