import { error } from '@sveltejs/kit'
import { fileForSlug, listDocFiles, loadDoc, slugOf } from '$lib/docs/load'
import { pageData } from '$lib/docs/page-data'
import type { EntryGenerator, PageServerLoad } from './$types'

export const entries: EntryGenerator = () =>
  listDocFiles()
    .filter((f) => f !== 'README.md')
    .map((f) => ({ slug: slugOf(f) }))

export const load: PageServerLoad = async ({ params, parent }) => {
  const file = fileForSlug(params.slug)
  if (!file || file === 'README.md') error(404, 'Doc not found')
  const { nav } = await parent()
  return pageData(await loadDoc(file), nav)
}
