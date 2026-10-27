import { prefersReducedMotion } from './motion'

/**
 * Modern scroll reveal (Svelte action): a block that starts below the fold rises in (`m-rise-in`) when it
 * scrolls into view. Nothing moves on page load: blocks already on screen, Retro, reduced motion and
 * browsers without IntersectionObserver are left alone. Without JavaScript nothing is hidden.
 */
export function reveal(node: HTMLElement) {
  if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) return
  if (document.documentElement.getAttribute('data-design') !== 'modern') return
  if (node.getBoundingClientRect().top < window.innerHeight) return

  node.classList.add('m-reveal-pending')
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      node.classList.remove('m-reveal-pending')
      node.classList.add('m-rise-in')
      io.disconnect()
    },
    { rootMargin: '0px 0px -8% 0px' }
  )
  io.observe(node)
  return {
    destroy() {
      io.disconnect()
    },
  }
}
