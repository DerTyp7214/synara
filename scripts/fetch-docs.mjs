// Fetches the synara-api docs (docs/ + README.md) into .docs-src/ via a sparse, depth-1 clone.
// SYNARA_DOCS_DIR=/path/to/synara_api/docs skips the clone and is used by the loader directly.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dest = join(root, '.docs-src')
const repo = process.env.SYNARA_DOCS_REPO ?? 'https://github.com/DerTyp7214/synara-api'
const git = (args, cwd = root) =>
  execFileSync('git', args, { cwd, stdio: ['ignore', 'pipe', 'inherit'] })
    .toString()
    .trim()

if (process.env.SYNARA_DOCS_DIR) {
  console.log(`[fetch-docs] SYNARA_DOCS_DIR set (${process.env.SYNARA_DOCS_DIR}), skipping clone`)
  process.exit(0)
}

try {
  if (!existsSync(join(dest, '.git'))) {
    mkdirSync(dest, { recursive: true })
    git(['init', '-q'], dest)
    git(['remote', 'add', 'origin', repo], dest)
    git(['sparse-checkout', 'set', '--no-cone', '/docs/', '/README.md'], dest)
  }
  git(['fetch', '-q', '--depth=1', 'origin', 'HEAD'], dest)
  git(['checkout', '-q', '-f', 'FETCH_HEAD'], dest)
  const sha = git(['rev-parse', 'HEAD'], dest)
  writeFileSync(join(dest, '.sha'), sha + '\n')
  console.log(`[fetch-docs] synara-api docs at ${sha.slice(0, 7)}`)
} catch (err) {
  if (existsSync(join(dest, 'docs')) && existsSync(join(dest, '.sha'))) {
    console.warn(
      `[fetch-docs] refresh failed (${err.message}); using cached ${readFileSync(join(dest, '.sha'), 'utf8').trim().slice(0, 7)}`
    )
  } else {
    console.error(`[fetch-docs] failed: ${err.message}`)
    process.exit(1)
  }
}
