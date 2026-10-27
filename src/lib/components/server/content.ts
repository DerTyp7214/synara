/*
 * /server/ copy as data. Facts were checked against synara-api (see docs/ENVIRONMENT_VARIABLES.md).
 * Strings may contain `backticks`; they render as inline code via content/Inline.svelte.
 */

export const intro = {
	title: 'Run your own server',
	lead: "Synara's server is open source under GPL-2.0 and ships as a Docker image. Start with one container and SQLite; add Postgres, a Redis cluster and the trained recommendation model when you want them.",
	envLead: "The environment variables you're most likely to touch."
};

export const requirements = [
	{ title: 'Docker with Compose', body: 'Any machine you control: a home server, a spare PC or a rented VPS.' },
	{ title: 'Storage for your library', body: 'Lossless files are large. Put the data volume on a disk with room to grow.' },
	{ title: 'A reachable address', body: 'Port 8080 on your network, or a reverse proxy with HTTPS for listening on the go.' }
];

/** Compose files offered on /server/, in switch order. The first one is the default. */
export const composeVariants = {
	sqlite: {
		label: 'SQLite',
		body: 'One container. The database is a SQLite file in the data volume, which is fine for personal libraries.'
	},
	postgres: { label: 'Postgres', body: 'Synara plus a Postgres database. Recommended for larger libraries.' },
	full: {
		label: 'Full',
		body: 'Postgres, a Redis cluster, audio embeddings and the trained recommendation model. Needs an x86-64 machine: the embedding and recommendation images are amd64-only.'
	}
} as const;

export const startCommands = 'docker compose up -d\ndocker compose logs -f synara';

export const firstSteps = [
	'Install the app from the download page and open it.',
	"Enter your server's address, for example `http://192.168.1.20:8080` or your HTTPS domain.",
	'Log in with the `CLIENT_ID` and `CLIENT_SECRET` from your compose file.'
];

export const notes = [
	{
		title: '/data is Synara’s own folder',
		body: '`/data` holds Synara’s data root (`/data/Synara/…`). Lossless files you already have can go into `/data/Synara/other`, which Synara indexes.'
	},
	{
		title: 'Owned by UID and GID 1000',
		body: 'The image runs as user 1000. If you swap the named volumes for bind mounts, make the folders writable for it: `sudo chown -R 1000:1000 ./data`.'
	},
	{
		title: 'SQLite or Postgres',
		body: 'SQLite needs no extra service, but search is simpler on it. Postgres is recommended for larger libraries and enables the full search index.'
	},
	{
		title: 'Redis has to be a cluster',
		body: 'Redis is optional; leave `REDIS_HOST` empty to run without it. Synara connects to Redis in cluster mode only. Pointed at a plain standalone Redis, the server fails to start, so use `synara-redis-cluster` as in the full file.'
	},
	{
		title: 'Behind an HTTPS proxy',
		body: 'Set `SERVER_SSL_SUPPORTED: "true"` if your HTTPS reverse proxy doesn’t send `X-Forwarded-Proto`, so apps know to use https/wss.'
	},
	{
		title: 'Upgrading from 0.0.1 or older',
		body: 'Run `ghcr.io/dertyp7214/synara:0.0.1-dev` until the log shows `Finished custom migration FillAlbumReleaseDates`, then update.'
	}
];

export const envVars: { name: string; body: string; def?: string }[] = [
	{
		name: 'CLIENT_ID, CLIENT_SECRET',
		body: 'Username and password of the initial admin. Created at startup if no user with that name exists; changing them later does not change the password.'
	},
	{ name: 'JWT_SECRET', body: 'Signs login tokens. Set a long random string.', def: 'changeme' },
	{ name: 'DB_URL', body: 'JDBC URL. Use an absolute path for SQLite: `jdbc:sqlite:/data/synara.db`.' },
	{ name: 'DB_DRIVER', body: '`org.postgresql.Driver` for Postgres.', def: 'org.sqlite.JDBC' },
	{ name: 'DB_USER, DB_PASSWORD', body: 'Database credentials (Postgres).' },
	{
		name: 'CREDENTIALS_ENCRYPTION_KEY',
		body: 'Encrypts credentials stored in admin settings. Generate with `openssl rand -base64 32` and keep it with your backups. If unset, Synara generates a key and stores it in the config volume.'
	},
	{
		name: 'SERVER_SSL_SUPPORTED',
		body: 'Set to `true` if your HTTPS reverse proxy doesn’t send `X-Forwarded-Proto`, so apps know to use https/wss.',
		def: 'false'
	},
	{
		name: 'REDIS_HOST, REDIS_PORT',
		body: 'Optional Redis; leave `REDIS_HOST` empty to run without it. Cluster mode only: pointed at a plain standalone Redis, the server fails to start.'
	},
	{ name: 'AUDIO_EMBED_URL', body: 'Audio embedding service. Empty disables it.' },
	{ name: 'RECSYS_DATA_DIR', body: 'Directory shared with the recommendation service. Empty disables it.' },
	{ name: 'PORT', body: 'Port the server listens on.', def: '8080' }
];

export const docLinks = [
	{
		href: '/docs/environment_variables/',
		title: 'Environment variables',
		body: 'Every setting, with defaults: importers, proxies, storage paths, metrics.'
	},
	{ href: '/docs/mcp/', title: 'MCP', body: 'Connect an AI assistant to your listening history, read-only.' },
	{ href: '/docs/plugins/', title: 'Plugins', body: 'Add importers, indexers, routes, tasks and screens.' },
	{
		href: '/docs/client_getting_started/',
		title: 'Build a client',
		body: 'REST, Kotlin RPC, Subsonic and MCP: pick an API and make your first call.'
	}
];
