/**
 * Modern motion helpers (DESIGN.md, "Modern > Motion"). View Transitions only on Modern, only where
 * supported, never under prefers-reduced-motion; otherwise the update just happens.
 */

export function prefersReducedMotion(): boolean {
	return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Whether a Modern view transition may run now. */
export function canTransition(): boolean {
	return (
		typeof document !== 'undefined' &&
		'startViewTransition' in document &&
		document.documentElement.getAttribute('data-design') === 'modern' &&
		!prefersReducedMotion()
	);
}

/** Run `update` inside a short crossfade (theme and design switches). */
export function crossfade(update: () => void): void {
	if (!canTransition()) {
		update();
		return;
	}
	const root = document.documentElement;
	root.classList.add('m-vt-fade');
	const t = document.startViewTransition(update);
	t.finished.finally(() => root.classList.remove('m-vt-fade'));
}
