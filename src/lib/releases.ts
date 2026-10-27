/*
 * Release channels, download URLs and the shared Stable/Dev channel state for /download/ and /server/.
 * Everything that talks to GitHub runs in the browser only (pages are prerendered).
 */
import { replaceState } from '$app/navigation';

export type Channel = 'stable' | 'dev';
export const CHANNELS: { id: Channel; label: string }[] = [
	{ id: 'stable', label: 'Stable' },
	{ id: 'dev', label: 'Dev' }
];

/** Read `?channel=dev` from a URL. Anything else means stable. */
export function channelFromUrl(url: URL): Channel {
	return url.searchParams.get('channel') === 'dev' ? 'dev' : 'stable';
}

/** Mirror the channel into the address bar without a navigation. Stable is the default and drops the param. */
export function writeChannelToUrl(channel: Channel) {
	const url = new URL(window.location.href);
	if (channel === 'dev') url.searchParams.set('channel', 'dev');
	else url.searchParams.delete('channel');
	if (url.href !== window.location.href) replaceState(url, {});
}

/* ---------------- Server image ---------------- */

const IMAGE = 'ghcr.io/dertyp7214/synara';

/**
 * `:latest` is only published from the server's release branch, which has not shipped yet.
 * Flip this to true once `ghcr.io/dertyp7214/synara:latest` exists.
 */
export const STABLE_SERVER_IMAGE_PUBLISHED = false;

export function serverTag(channel: Channel): string {
	return channel === 'stable' && STABLE_SERVER_IMAGE_PUBLISHED ? 'latest' : 'latest-dev';
}
export function serverImage(channel: Channel): string {
	return `${IMAGE}:${serverTag(channel)}`;
}
/** True when the stable channel had to fall back to the dev image. */
export function serverFallsBack(channel: Channel): boolean {
	return channel === 'stable' && !STABLE_SERVER_IMAGE_PUBLISHED;
}

/* ---------------- Compose files (reviewed against synara-api; only the tag changes) ---------------- */

const MINIMAL_COMPOSE = `services:
  synara:
    image: ghcr.io/dertyp7214/synara:latest-dev
    ports:
      - "8080:8080"
    environment:
      CLIENT_ID: admin                          # initial admin user (first run)
      CLIENT_SECRET: change-me                  # initial admin password
      JWT_SECRET: change-me-to-a-long-random-string
      DB_URL: jdbc:sqlite:/data/synara.db           # SQLite database file inside the data volume
      # CREDENTIALS_ENCRYPTION_KEY: ""          # openssl rand -base64 32
    volumes:
      - synara_data:/data
      - synara_config:/home/appuser/.config
      - synara_tiddl:/home/appuser/.tiddl
      - synara_backups:/backups
    restart: unless-stopped

volumes:
  synara_data:
  synara_config:
  synara_tiddl:
  synara_backups:
`;

const POSTGRES_COMPOSE = `services:
  synara:
    image: ghcr.io/dertyp7214/synara:latest-dev
    ports:
      - "8080:8080"
    environment:
      CLIENT_ID: admin                          # initial admin user (first run)
      CLIENT_SECRET: change-me                  # initial admin password
      JWT_SECRET: change-me-to-a-long-random-string
      DB_DRIVER: org.postgresql.Driver
      DB_URL: jdbc:postgresql://db:5432/synara
      DB_USER: postgres
      DB_PASSWORD: change-me-db-password
      # CREDENTIALS_ENCRYPTION_KEY: ""          # openssl rand -base64 32
    volumes:
      - synara_data:/data
      - synara_config:/home/appuser/.config
      - synara_tiddl:/home/appuser/.tiddl
      - synara_backups:/backups
    depends_on:
      db: { condition: service_healthy }
    restart: unless-stopped

  db:
    image: postgres:15
    command: -N 1000                            # Synara opens many connections
    environment:
      POSTGRES_DB: synara
      POSTGRES_PASSWORD: change-me-db-password
    volumes:
      - postgres:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      start_period: 15s
    restart: unless-stopped

volumes:
  synara_data:
  synara_config:
  synara_tiddl:
  synara_backups:
  postgres:
`;

const FULL_COMPOSE = `services:
  synara:
    image: ghcr.io/dertyp7214/synara:latest-dev
    ports: ["8080:8080"]
    environment:
      CLIENT_ID: admin
      CLIENT_SECRET: change-me
      JWT_SECRET: change-me-to-a-long-random-string
      # CREDENTIALS_ENCRYPTION_KEY: ""
      # SERVER_SSL_SUPPORTED: "true"            # if your HTTPS proxy sends no X-Forwarded-Proto
      DB_DRIVER: org.postgresql.Driver
      DB_URL: jdbc:postgresql://db:5432/synara
      DB_USER: postgres
      DB_PASSWORD: change-me-db-password
      REDIS_HOST: redis-cluster
      REDIS_PORT: "7000"
      AUDIO_EMBED_URL: http://audio-embed:8200
      RECSYS_DATA_DIR: /recsys
    volumes:
      - synara_data:/data
      - synara_config:/home/appuser/.config
      - synara_tiddl:/home/appuser/.tiddl
      - synara_backups:/backups
      - recsys_data:/recsys
    depends_on:
      db: { condition: service_healthy }
      redis-cluster: { condition: service_healthy }
    restart: unless-stopped

  db:
    image: postgres:15
    command: -N 1000                            # Synara opens many connections
    environment:
      POSTGRES_DB: synara
      POSTGRES_PASSWORD: change-me-db-password
    volumes: ["postgres:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      start_period: 15s
    restart: unless-stopped

  redis-cluster:
    image: ghcr.io/dertyp7214/synara-redis-cluster:latest-dev
    environment:
      NODES: "3"
      REPLICAS: "0"
      PORT_START: "7000"
      HOST: redis-cluster
      MAXMEMORY: 1gb
      MAXMEMORY_POLICY: allkeys-lfu
    volumes: ["redis_data:/data"]
    healthcheck:
      test: ["CMD-SHELL", "redis-cli -p 7000 cluster info | grep -q cluster_state:ok"]
      interval: 10s
      start_period: 15s
    restart: unless-stopped

  audio-embed:
    image: ghcr.io/dertyp7214/synara-audio-embed:latest-dev
    volumes: ["synara_data:/data:ro"]
    restart: unless-stopped

  recsys:
    image: ghcr.io/dertyp7214/synara-recsys:latest-dev
    volumes: ["recsys_data:/data"]
    restart: unless-stopped

volumes:
  synara_data:
  synara_config:
  synara_tiddl:
  synara_backups:
  recsys_data:
  postgres:
  redis_data:
`;

function withTag(compose: string, channel: Channel) {
	const tag = serverTag(channel);
	return tag === 'latest-dev' ? compose : compose.replaceAll(/(ghcr\.io\/dertyp7214\/[a-z-]+):latest-dev/g, `$1:${tag}`);
}
export const minimalCompose = (channel: Channel) => withTag(MINIMAL_COMPOSE, channel);
export const postgresCompose = (channel: Channel) => withTag(POSTGRES_COMPOSE, channel);
export const fullCompose = (channel: Channel) => withTag(FULL_COMPOSE, channel);

/* ---------------- Android ---------------- */

const ANDROID_REPO = 'DerTyp7214/Synara';
export const ANDROID_TAG: Record<Channel, string> = { stable: 'latest-android', dev: 'latest-dev-android' };
export const androidApkUrl = (channel: Channel) =>
	`https://github.com/${ANDROID_REPO}/releases/download/${ANDROID_TAG[channel]}/Synara.apk`;

export type AndroidInfo = { updated: string; size: number };

/* ---------------- Desktop ---------------- */

const DESKTOP_REPO = 'DerTyp7214/SynaraDesktop';
const DESKTOP_DEV_BASE = `https://github.com/${DESKTOP_REPO}/releases/download/latest-dev`;

export type DesktopOs = 'linux' | 'windows' | 'macos';
export type DesktopFileKind = 'deb' | 'tar' | 'msi' | 'dmg';
export type DesktopFile = { kind: DesktopFileKind; os: DesktopOs; suffix: string; label: string; format: string; ext: string };
/** Order matters: the first file matching the visitor's OS is the recommended one. */
export const DESKTOP_FILES: DesktopFile[] = [
	{ kind: 'deb', os: 'linux', suffix: 'linux-x64.deb', label: 'Linux', format: 'Debian / Ubuntu', ext: '.deb' },
	{ kind: 'tar', os: 'linux', suffix: 'linux-x64.tar.gz', label: 'Linux', format: 'Portable archive', ext: '.tar.gz' },
	{ kind: 'msi', os: 'windows', suffix: 'windows-x64.msi', label: 'Windows', format: 'Installer', ext: '.msi' },
	{ kind: 'dmg', os: 'macos', suffix: 'macos-arm64.dmg', label: 'macOS (Apple Silicon)', format: 'Disk image', ext: '.dmg' }
];
export function recommendedDesktopFile(os: VisitorOs): DesktopFileKind | null {
	return DESKTOP_FILES.find((f) => f.os === os)?.kind ?? null;
}
export type DesktopVariant = 'Synara' | 'ClassicApp';
export type DesktopLinks = Record<DesktopFileKind, string>;

/**
 * TODO(stable desktop release): there is no stable desktop release yet, so both channels use the rolling
 * `latest-dev` release (fixed asset names, updated on every push to master, also hosts the pacman repo).
 * When a rolling stable release exists, set this to its download base,
 * `https://github.com/DerTyp7214/SynaraDesktop/releases/download/<its tag>`, and check that its asset names
 * match `desktopLinks()`. Never point it at a frozen `v<version>` snapshot.
 */
const STABLE_DESKTOP_BASE: string | null = null;
export const STABLE_DESKTOP_PUBLISHED = STABLE_DESKTOP_BASE !== null;

/** True when the stable channel had to fall back to the dev builds. */
export function desktopFallsBack(channel: Channel): boolean {
	return channel === 'stable' && !STABLE_DESKTOP_PUBLISHED;
}
function desktopBase(channel: Channel): string {
	return channel === 'stable' && STABLE_DESKTOP_BASE ? STABLE_DESKTOP_BASE : DESKTOP_DEV_BASE;
}

/** Download links for one app variant on a channel. Asset names are fixed on rolling releases. */
export function desktopLinks(channel: Channel, variant: DesktopVariant): DesktopLinks {
	const base = desktopBase(channel);
	const out = {} as DesktopLinks;
	for (const f of DESKTOP_FILES) out[f.kind] = `${base}/${variant}-${f.suffix}`;
	return out;
}

/** pacman.conf entry for the repo hosted on the channel's rolling release. */
export function pacmanSnippet(channel: Channel) {
	return `[synara]
SigLevel = Optional TrustAll
Server = ${desktopBase(channel)}`;
}

/* ---------------- GitHub API (client-side, cached per tab) ---------------- */

type GhAsset = { name: string; browser_download_url: string; updated_at: string; size: number };
type GhRelease = { tag_name: string; draft: boolean; published_at: string | null; assets: GhAsset[] };

const CACHE_MS = 10 * 60 * 1000;

async function ghCached<T>(path: string, signal?: AbortSignal): Promise<T> {
	const key = `synara-gh:${path}`;
	try {
		const hit = JSON.parse(sessionStorage.getItem(key) ?? 'null');
		if (hit && Date.now() - hit.at < CACHE_MS) return hit.data;
	} catch {
		/* storage unavailable */
	}
	const res = await fetch(`https://api.github.com/repos/${path}`, {
		headers: { Accept: 'application/vnd.github+json' },
		signal
	});
	if (!res.ok) throw new Error(`GitHub API ${res.status}`);
	const data = (await res.json()) as T;
	try {
		sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
	} catch {
		/* ignore */
	}
	return data;
}
const ghReleases = (repo: string, signal?: AbortSignal) => ghCached<GhRelease[]>(`${repo}/releases?per_page=20`, signal);
const ghReleaseByTag = (repo: string, tag: string, signal?: AbortSignal) =>
	ghCached<GhRelease>(`${repo}/releases/tags/${tag}`, signal);

/** When the desktop builds on the dev release were last updated (newest Synara-* asset). Null when unknown. */
export async function fetchDesktopUpdated(signal?: AbortSignal): Promise<string | null> {
	const rel = await ghReleaseByTag(DESKTOP_REPO, 'latest-dev', signal);
	const dates = rel.assets.filter((a) => a.name.startsWith('Synara-')).map((a) => a.updated_at);
	return dates.sort().at(-1) ?? null;
}

/** Upload date and size of Synara.apk on both Android tags. (Synara-metadata.json can't be read: no CORS.) */
export async function fetchAndroidInfo(signal?: AbortSignal): Promise<Partial<Record<Channel, AndroidInfo>>> {
	const releases = await ghReleases(ANDROID_REPO, signal);
	const out: Partial<Record<Channel, AndroidInfo>> = {};
	for (const ch of ['stable', 'dev'] as Channel[]) {
		const apk = releases.find((r) => r.tag_name === ANDROID_TAG[ch])?.assets.find((a) => a.name === 'Synara.apk');
		if (apk) out[ch] = { updated: apk.updated_at, size: apk.size };
	}
	return out;
}

/* ---------------- Formatting / platform detection ---------------- */

export function formatDate(iso: string) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return '';
	return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
export function formatSize(bytes: number) {
	return `${Math.round(bytes / 1024 / 1024)} MB`;
}

export type VisitorOs = DesktopOs | 'android' | 'ios' | null;

export function detectOs(): VisitorOs {
	if (typeof navigator === 'undefined') return null;
	const uaData = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData;
	const p = (uaData?.platform ?? '').toLowerCase();
	const ua = navigator.userAgent.toLowerCase();
	if (p === 'android' || ua.includes('android')) return 'android';
	if (/iphone|ipad|ipod/.test(ua) || (ua.includes('macintosh') && navigator.maxTouchPoints > 1)) return 'ios';
	if (p === 'windows' || ua.includes('windows')) return 'windows';
	if (p === 'macos' || ua.includes('mac os')) return 'macos';
	if (p === 'linux' || p === 'chrome os' || ua.includes('linux') || ua.includes('x11')) return 'linux';
	return null;
}
