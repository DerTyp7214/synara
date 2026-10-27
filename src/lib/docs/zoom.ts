/**
 * Pan and zoom for rendered Mermaid diagrams. No dependencies: pointer events plus a CSS transform.
 *
 * attachZoom(pre) turns a rendered `<pre class="mermaid">` into
 *   .mmd-panel > (.mmd-bar: legend, readout, keys) + .mmd-viewport (focusable) > .mmd-stage > svg
 * The transform survives a re-render of the same element (theme change), via a WeakMap.
 */

type View = { s: number; x: number; y: number; touched: boolean };

const MIN = 0.25;
const MAX = 4;
/** Below this the labels get hard to read, so the initial fit doesn't go lower. */
const READABLE = 0.6;
/** How much of the diagram must stay inside the viewport when dragging. */
const KEEP = 48;

const saved = new WeakMap<HTMLElement, View>();

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function headingAbove(el: HTMLElement): string {
	let n: Element | null = el;
	while (n) {
		let p: Element | null = n.previousElementSibling;
		while (p) {
			if (/^H[1-4]$/.test(p.tagName)) return p.textContent?.trim() ?? '';
			p = p.previousElementSibling;
		}
		n = n.parentElement;
		if (n?.tagName === 'ARTICLE') break;
	}
	return '';
}

function naturalSize(svg: SVGSVGElement) {
	const vb = svg.viewBox?.baseVal;
	if (vb && vb.width && vb.height) return { w: vb.width, h: vb.height };
	const r = svg.getBoundingClientRect();
	return { w: r.width || 400, h: r.height || 300 };
}

function key(label: string, text: string, extra = '') {
	const b = document.createElement('button');
	b.type = 'button';
	b.className = `key key-sm mmd-key ${extra}`;
	b.setAttribute('aria-label', label);
	b.title = label;
	b.textContent = text;
	return b;
}

type Zoomer = { fit: () => void; destroy: () => void };

/** Wire pan/zoom onto a viewport + stage pair. Returns controls. */
function wire(
	viewport: HTMLElement,
	stage: HTMLElement,
	size: { w: number; h: number },
	readout: HTMLElement,
	initial: View | undefined,
	onChange: (v: View) => void
): Zoomer & { zoomBy: (f: number) => void; reset: () => void } {
	const v: View = initial ? { ...initial } : { s: 1, x: 0, y: 0, touched: false };

	const apply = () => {
		const vw = viewport.clientWidth;
		const vh = viewport.clientHeight;
		const cw = size.w * v.s;
		const ch = size.h * v.s;
		v.x = clamp(v.x, Math.min(KEEP - cw, 0), Math.max(vw - KEEP, 0));
		v.y = clamp(v.y, Math.min(KEEP - ch, 0), Math.max(vh - KEEP, 0));
		stage.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.s})`;
		readout.textContent = `${Math.round(v.s * 100)}%`;
		onChange(v);
	};

	const fit = () => {
		const vw = viewport.clientWidth;
		const vh = viewport.clientHeight;
		const pad = 16;
		const aw = vw - pad * 2;
		const ah = vh - pad * 2;
		// Fit the whole diagram, never above natural size.
		let s = Math.min(1, aw / size.w, ah / size.h);
		// If that makes the labels too small, stay readable instead: fit the height (natural size when it fits
		// vertically) and let the reader pan sideways.
		if (s < READABLE) s = clamp(Math.min(1, ah / size.h), READABLE, 1);
		v.s = s;
		v.x = size.w * s <= vw ? (vw - size.w * s) / 2 : pad;
		v.y = size.h * s <= vh ? (vh - size.h * s) / 2 : pad;
		v.touched = false;
		apply();
	};

	const zoomAt = (cx: number, cy: number, f: number) => {
		const s = clamp(v.s * f, MIN, MAX);
		const k = s / v.s;
		v.x = cx - (cx - v.x) * k;
		v.y = cy - (cy - v.y) * k;
		v.s = s;
		v.touched = true;
		apply();
	};
	const zoomBy = (f: number) => zoomAt(viewport.clientWidth / 2, viewport.clientHeight / 2, f);
	const local = (e: { clientX: number; clientY: number }) => {
		const r = viewport.getBoundingClientRect();
		return [e.clientX - r.left, e.clientY - r.top] as const;
	};

	// Pointers: one pans, two pinch.
	const pts = new Map<number, { x: number; y: number }>();
	let pinch: { d: number; mx: number; my: number } | null = null;
	const onDown = (e: PointerEvent) => {
		if (e.button !== 0 && e.pointerType === 'mouse') return;
		viewport.setPointerCapture(e.pointerId);
		pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
		viewport.classList.add('grabbing');
		if (pts.size === 2) {
			const [a, b] = [...pts.values()];
			pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
		}
	};
	const onMove = (e: PointerEvent) => {
		const prev = pts.get(e.pointerId);
		if (!prev) return;
		const cur = { x: e.clientX, y: e.clientY };
		pts.set(e.pointerId, cur);
		if (pts.size === 1) {
			v.x += cur.x - prev.x;
			v.y += cur.y - prev.y;
			v.touched = true;
			apply();
		} else if (pts.size === 2 && pinch) {
			const [a, b] = [...pts.values()];
			const d = Math.hypot(a.x - b.x, a.y - b.y);
			const mx = (a.x + b.x) / 2;
			const my = (a.y + b.y) / 2;
			v.x += mx - pinch.mx;
			v.y += my - pinch.my;
			const [lx, ly] = local({ clientX: mx, clientY: my });
			if (pinch.d > 0) zoomAt(lx, ly, d / pinch.d);
			pinch = { d, mx, my };
		}
	};
	const onUp = (e: PointerEvent) => {
		pts.delete(e.pointerId);
		if (pts.size < 2) pinch = null;
		if (!pts.size) viewport.classList.remove('grabbing');
	};
	// Ctrl/⌘ + wheel and trackpad pinch (reported as ctrl+wheel) zoom; a plain wheel scrolls the page.
	const onWheel = (e: WheelEvent) => {
		if (!e.ctrlKey && !e.metaKey) return;
		e.preventDefault();
		const [lx, ly] = local(e);
		zoomAt(lx, ly, Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0025)));
	};
	const onDbl = (e: MouseEvent) => {
		const [lx, ly] = local(e);
		zoomAt(lx, ly, e.shiftKey ? 1 / 1.6 : 1.6);
	};
	const onKey = (e: KeyboardEvent) => {
		const step = e.shiftKey ? 120 : 40;
		const moves: Record<string, [number, number]> = {
			ArrowLeft: [step, 0],
			ArrowRight: [-step, 0],
			ArrowUp: [0, step],
			ArrowDown: [0, -step]
		};
		if (moves[e.key]) {
			v.x += moves[e.key][0];
			v.y += moves[e.key][1];
			v.touched = true;
			apply();
		} else if (e.key === '+' || e.key === '=') zoomBy(1.25);
		else if (e.key === '-' || e.key === '_') zoomBy(0.8);
		else if (e.key === '0') fit();
		else return;
		e.preventDefault();
	};

	viewport.addEventListener('pointerdown', onDown);
	viewport.addEventListener('pointermove', onMove);
	viewport.addEventListener('pointerup', onUp);
	viewport.addEventListener('pointercancel', onUp);
	viewport.addEventListener('wheel', onWheel, { passive: false });
	viewport.addEventListener('dblclick', onDbl);
	viewport.addEventListener('keydown', onKey);
	const ro = new ResizeObserver(() => (v.touched ? apply() : fit()));
	ro.observe(viewport);

	if (initial?.touched) apply();
	else fit();

	return {
		fit,
		zoomBy,
		reset: fit,
		destroy: () => {
			ro.disconnect();
			viewport.removeEventListener('pointerdown', onDown);
			viewport.removeEventListener('pointermove', onMove);
			viewport.removeEventListener('pointerup', onUp);
			viewport.removeEventListener('pointercancel', onUp);
			viewport.removeEventListener('wheel', onWheel);
			viewport.removeEventListener('dblclick', onDbl);
			viewport.removeEventListener('keydown', onKey);
		}
	};
}

function build(svg: SVGSVGElement, label: string, opts: { fullscreen: boolean }) {
	const size = naturalSize(svg);
	svg.setAttribute('width', String(size.w));
	svg.setAttribute('height', String(size.h));
	svg.style.maxWidth = 'none';
	svg.style.width = `${size.w}px`;
	svg.style.height = `${size.h}px`;

	const panel = document.createElement('div');
	panel.className = 'mmd-panel';
	const bar = document.createElement('div');
	bar.className = 'mmd-bar';
	const legend = document.createElement('span');
	legend.className = 'legend';
	legend.textContent = 'Diagram';
	const readout = document.createElement('span');
	readout.className = 'readout mmd-readout';
	readout.setAttribute('aria-hidden', 'true');
	const keys = document.createElement('span');
	keys.className = 'mmd-keys';
	const zin = key('Zoom in', '+');
	const zout = key('Zoom out', '−');
	const reset = key('Reset view', 'Reset');
	const full = opts.fullscreen ? key('Open full screen', 'Full screen') : key('Close full screen', 'Close');
	keys.append(zout, zin, reset, full);
	bar.append(legend, readout, keys);

	const viewport = document.createElement('div');
	viewport.className = 'mmd-viewport';
	viewport.tabIndex = 0;
	viewport.setAttribute('role', 'group');
	viewport.setAttribute('aria-roledescription', 'zoomable diagram');
	viewport.setAttribute('aria-label', `Diagram${label ? `: ${label}` : ''}, zoomable. Arrow keys pan, plus and minus zoom, 0 resets.`);
	const stage = document.createElement('div');
	stage.className = 'mmd-stage';
	stage.append(svg);
	viewport.append(stage);
	panel.append(bar, viewport);
	return { panel, viewport, stage, readout, zin, zout, reset, full, size };
}

function openFullscreen(svg: SVGSVGElement, label: string, returnFocus: HTMLElement) {
	const dialog = document.createElement('dialog');
	dialog.className = 'mmd-dialog';
	dialog.setAttribute('aria-label', `Diagram${label ? `: ${label}` : ''}`);
	const clone = svg.cloneNode(true) as SVGSVGElement;
	const ui = build(clone, label, { fullscreen: false });
	dialog.append(ui.panel);
	document.body.append(dialog);
	dialog.showModal();
	const z = wire(ui.viewport, ui.stage, ui.size, ui.readout, undefined, () => {});
	ui.zin.onclick = () => z.zoomBy(1.25);
	ui.zout.onclick = () => z.zoomBy(0.8);
	ui.reset.onclick = () => z.fit();
	ui.full.onclick = () => dialog.close();
	dialog.addEventListener('close', () => {
		z.destroy();
		dialog.remove();
		returnFocus.focus();
	});
	ui.viewport.focus();
}

/** Wrap a rendered Mermaid diagram in a pan/zoom panel. Call again after each re-render. */
export function attachZoom(pre: HTMLElement): () => void {
	const svg = pre.querySelector('svg');
	if (!svg) return () => {};
	const label = headingAbove(pre);
	const ui = build(svg, label, { fullscreen: true });
	pre.replaceChildren(ui.panel);

	// Height: comfortable, but no taller than the diagram needs.
	const max = Math.round(Math.min(Math.max(280, window.innerHeight * 0.5), 560));
	ui.viewport.style.height = `${Math.max(160, Math.min(max, ui.size.h + 32))}px`;

	const z = wire(ui.viewport, ui.stage, ui.size, ui.readout, saved.get(pre), (v) => saved.set(pre, { ...v }));
	ui.zin.onclick = () => z.zoomBy(1.25);
	ui.zout.onclick = () => z.zoomBy(0.8);
	ui.reset.onclick = () => z.fit();
	ui.full.onclick = () => openFullscreen(svg, label, ui.full);
	return z.destroy;
}
