/**
 * The rendered HTML of a docs page, without shipping it twice.
 *
 * Server data is serialized into the prerendered page, so a 1 MB doc would be embedded once as markup and once
 * as JSON. Instead the HTML comes from a universal load:
 * - on the server (prerender), straight from the docs pipeline;
 * - when the browser hydrates a prerendered doc, from the article that is already in the DOM;
 * - on client-side navigation, from the target's prerendered page.
 */
export async function docHtml(
  file: string,
  path: string,
  fetch: typeof globalThis.fetch
): Promise<string> {
  if (import.meta.env.SSR) {
    const { loadDoc } = await import('./load')
    return (await loadDoc(file)).html
  }
  const inDom = document.querySelector<HTMLElement>(`article[data-doc="${CSS.escape(file)}"]`)
  if (inDom && !inDom.dataset.hydrated) return inDom.innerHTML

  const res = await fetch(path)
  if (!res.ok) throw new Error(`Could not load ${path}: ${res.status}`)
  const doc = new DOMParser().parseFromString(await res.text(), 'text/html')
  return doc.querySelector<HTMLElement>('article[data-doc]')?.innerHTML ?? ''
}
