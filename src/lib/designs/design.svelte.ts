/**
 * The active design, as a rune store. Use it to gate JavaScript (animation loops, observers, fetches)
 * that only one design needs. Do NOT use it to choose markup: prerendered HTML is the same for both
 * designs, and the inline script in app.html picks the design before paint, so markup switches with
 * the `.design-retro` / `.design-modern` CSS pattern instead (see DESIGN.md, "Variants").
 *
 * On the server it is always 'modern' (the default). On the client it starts from the <html data-design> attribute
 * (set before any module runs), is re-read by `design.sync()` when the root layout mounts, and follows
 * `design.set()` from the toggle.
 */
import { applyDesignPref, readDesignPref, type DesignPref } from '$lib/theme';

let current = $state<DesignPref>(readDesignPref());

export const design = {
	/** 'retro' | 'modern' */
	get current(): DesignPref {
		return current;
	},
	get isModern(): boolean {
		return current === 'modern';
	},
	get isRetro(): boolean {
		return current === 'retro';
	},
	/** Apply, persist and publish a design. */
	set(next: DesignPref) {
		applyDesignPref(next);
		current = next;
	},
	/** Re-read the <html> attribute. */
	sync() {
		current = readDesignPref();
	}
};
