import { PUBLIC_LINKRESOLVER_API_KEY } from '$env/static/public'

export type ShareType = 'song' | 'album' | 'artist'

export interface ShareParams {
  type: ShareType
  title: string | null
  artists: string[]
  durationMs: number | null
  mbid: string | null
  isrc: string | null
  barcode: string | null
}

export interface ShareMeta {
  title?: string
  album?: string
  artist?: string
  cover?: string
  durationMs?: number
}

export interface ShareLink {
  name: string
  url: string
}

export interface ShareResult {
  meta: ShareMeta
  links: ShareLink[]
}

export const platforms = [
  { id: 'spotify', name: 'Spotify' },
  { id: 'appleMusic', name: 'Apple Music' },
  { id: 'youtubeMusic', name: 'YouTube Music' },
  { id: 'soundcloud', name: 'SoundCloud' },
  { id: 'deezer', name: 'Deezer' },
  { id: 'tidal', name: 'Tidal' },
  { id: 'bandcamp', name: 'Bandcamp' },
  { id: 'napster', name: 'Napster' },
  { id: 'amazonMusic', name: 'Amazon Music' },
  { id: 'discogs', name: 'Discogs' },
] as const

type PlatformId = (typeof platforms)[number]['id']

/** The fields read from an iTunes Search/Lookup API result. */
interface ItunesResult {
  trackName?: string
  collectionName?: string
  artistName?: string
  collectionArtistName?: string
  artworkUrl100?: string
  trackTimeMillis?: number
}

interface ItunesResponse {
  results?: ItunesResult[]
}

/** linkresolver.synara.audio `/resolve?…&metadata=true`. */
interface ResolverResponse {
  metadata?: {
    title?: string
    album?: string
    artist?: string
    cover?: string
    durationMs?: number
  }
  links?: Partial<Record<PlatformId, string>>
}

/** MusicBrainz `?inc=url-rels&fmt=json`, only the relation URLs. */
interface MusicBrainzResponse {
  relations?: { url?: { resource?: string } }[]
}

export const mbDomainMap: Record<string, string> = {
  'open.spotify.com': 'Spotify',
  'music.apple.com': 'Apple Music',
  'itunes.apple.com': 'Apple Music',
  'music.youtube.com': 'YouTube Music',
  'soundcloud.com': 'SoundCloud',
  'deezer.com': 'Deezer',
  'tidal.com': 'Tidal',
  'bandcamp.com': 'Bandcamp',
  'music.amazon.com': 'Amazon Music',
  'napster.com': 'Napster',
  'discogs.com': 'Discogs',
}

export function parseShareParams(search: URLSearchParams): ShareParams {
  const t = search.get('type')
  const type: ShareType = t === 'album' || t === 'artist' ? t : 'song'
  const duration = Number(search.get('duration'))
  return {
    type,
    title: search.get('title'),
    artists: search.getAll('artist'),
    durationMs: Number.isFinite(duration) && duration > 0 ? duration : null,
    mbid: search.get('mbid'),
    isrc: search.get('isrc'),
    barcode: search.get('barcode'),
  }
}

export function musicBrainzPath(type: ShareType): 'recording' | 'release' | 'artist' {
  return type === 'album' ? 'release' : type === 'artist' ? 'artist' : 'recording'
}

export function musicBrainzUrl(p: ShareParams): string | null {
  return p.mbid ? `https://musicbrainz.org/${musicBrainzPath(p.type)}/${p.mbid}` : null
}

async function getJson<T>(url: string, signal: AbortSignal, init?: RequestInit): Promise<T | null> {
  const r = await fetch(url, { ...init, signal })
  return r.ok ? ((await r.json()) as T) : null
}

/** iTunes: direct lookup by isrc/upc, else search (album falls back to song). Normalised to ShareMeta. */
async function fetchItunes(p: ShareParams, signal: AbortSignal): Promise<ShareMeta | null> {
  const query = [p.title ?? '', ...p.artists].join(' ').trim()
  const encoded = encodeURIComponent(query).replace(/%20/g, '+')
  const search = async (entity: string): Promise<ItunesResult | null> => {
    const d = await getJson<ItunesResponse>(
      `https://itunes.apple.com/search?term=${encoded}&entity=${entity}&limit=1`,
      signal
    )
    return d?.results?.[0] ?? null
  }

  let hit: ItunesResult | null = null
  const directId = p.type === 'song' ? p.isrc : p.type === 'album' ? p.barcode : null
  if (directId) {
    const param = p.type === 'song' ? 'isrc' : 'upc'
    const d = await getJson<ItunesResponse>(
      `https://itunes.apple.com/lookup?${param}=${encodeURIComponent(directId)}`,
      signal
    )
    hit = d?.results?.[0] ?? null
  }
  if (!hit && query) {
    if (p.type === 'artist') hit = await search('musicArtist')
    else {
      hit = await search(p.type === 'album' ? 'album' : 'song')
      if (!hit && p.type === 'album') hit = await search('song')
    }
  }
  if (!hit) return null

  const cover = hit.artworkUrl100?.replace('100x100', '600x600')
  if (p.type === 'artist') return { title: hit.artistName, artist: hit.artistName }
  if (p.type === 'album') {
    return {
      title: hit.collectionName,
      album: hit.collectionName,
      artist: hit.collectionArtistName ?? hit.artistName,
      cover,
    }
  }
  return {
    title: hit.trackName,
    album: hit.collectionName,
    artist: hit.artistName,
    cover,
    durationMs: hit.trackTimeMillis,
  }
}

async function fetchResolver(
  p: ShareParams,
  signal: AbortSignal
): Promise<{ meta: ShareMeta | null; links: ShareLink[] }> {
  const id = p.type === 'song' ? p.isrc : p.type === 'album' ? p.barcode : null
  if (!id) return { meta: null, links: [] }
  const param = p.type === 'song' ? 'isrc' : 'upc'
  const data = await getJson<ResolverResponse>(
    `https://linkresolver.synara.audio/resolve?${param}=${encodeURIComponent(id)}&metadata=true`,
    signal,
    { headers: { 'X-API-Key': PUBLIC_LINKRESOLVER_API_KEY } }
  )
  if (!data) return { meta: null, links: [] }
  const m = data.metadata
  const meta: ShareMeta | null = m
    ? {
        title: m.title,
        album: p.type === 'album' ? m.title : (m.album ?? m.title),
        artist: m.artist,
        cover: m.cover,
        durationMs: m.durationMs,
      }
    : null
  const links = platforms.flatMap((pl) => {
    const url = data.links?.[pl.id]
    return url ? [{ name: pl.name, url }] : []
  })
  return { meta, links }
}

async function fetchMusicBrainzLinks(p: ShareParams, signal: AbortSignal): Promise<ShareLink[]> {
  if (!p.mbid) return []
  const data = await getJson<MusicBrainzResponse>(
    `https://musicbrainz.org/ws/2/${musicBrainzPath(p.type)}/${encodeURIComponent(p.mbid)}?inc=url-rels&fmt=json`,
    signal
  )
  const out: ShareLink[] = []
  for (const rel of data?.relations ?? []) {
    const resource = rel?.url?.resource
    if (!resource) continue
    try {
      const host = new URL(resource).hostname.replace(/^www\./, '')
      const name = mbDomainMap[host]
      if (name && !out.some((l) => l.name === name)) out.push({ name, url: resource })
    } catch {
      /* ignore malformed url */
    }
  }
  return out
}

function mergeMeta(base: ShareMeta | null, over: ShareMeta | null): ShareMeta {
  const filled = Object.entries(over ?? {}).filter(([, v]) => v != null && v !== '')
  return { ...(base ?? {}), ...(Object.fromEntries(filled) as ShareMeta) }
}

/**
 * Resolves metadata + streaming links. iTunes and the link resolver run in parallel;
 * MusicBrainz is only consulted when the resolver produced no links.
 * `onUpdate` fires as soon as metadata/links arrive. Aborting rejects nothing: it just stops updates.
 */
export async function resolveShare(
  p: ShareParams,
  signal: AbortSignal,
  onUpdate: (r: ShareResult) => void
): Promise<ShareResult> {
  let itunes: ShareMeta | null = null
  let resolver: ShareMeta | null = null
  let links: ShareLink[] = []
  const emit = () => {
    if (!signal.aborted) onUpdate({ meta: mergeMeta(itunes, resolver), links })
  }

  const itunesTask = fetchItunes(p, signal)
    .then((m) => {
      itunes = m
      emit()
    })
    .catch((e) => {
      if (!signal.aborted) console.error('iTunes lookup failed', e)
    })

  const linkTask = (async () => {
    try {
      const r = await fetchResolver(p, signal)
      resolver = r.meta
      links = r.links
      emit()
      if (links.length === 0) {
        links = await fetchMusicBrainzLinks(p, signal)
        emit()
      }
    } catch (e) {
      if (!signal.aborted) console.error('Failed to fetch streaming links', e)
    }
  })()

  await Promise.all([itunesTask, linkTask])
  return { meta: mergeMeta(itunes, resolver), links }
}
