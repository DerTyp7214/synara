import { docHtml } from '$lib/docs/html'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ data, fetch }) => ({
  ...data,
  html: await docHtml(data.file, data.path, fetch),
})
