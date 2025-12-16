<script lang="ts">
	import { themeStore, theme, mode, type ThemeName, type ThemeMode } from '$lib/stores/theme';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let isOpen = $state(false);
	let menuRef: HTMLDivElement | undefined = $state();
	let mounted = $state(false);
	let themes: ThemeName[] = $state([]);

	function handleClickOutside(event: MouseEvent) {
		if (menuRef && !menuRef.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isOpen = false;
		}
	}

	function selectTheme(newTheme: ThemeName) {
		try {
			theme.set(newTheme);
			isOpen = false;
		} catch (error) {
			console.error('Failed to set theme:', error);
		}
	}

	function selectMode(newMode: ThemeMode) {
		try {
			mode.set(newMode);
		} catch (error) {
			console.error('Failed to set mode:', error);
		}
	}

	function toggleMenu() {
		isOpen = !isOpen;
	}

	onMount(() => {
		mounted = true;
		try {
			themes = themeStore.getThemes();
		} catch (error) {
			console.error('Failed to load themes:', error);
			themes = ['crimson'];
		}
		if (browser) {
			document.addEventListener('click', handleClickOutside);
			document.addEventListener('keydown', handleKeydown);
			return () => {
				document.removeEventListener('click', handleClickOutside);
				document.removeEventListener('keydown', handleKeydown);
			};
		}
	});

	function formatThemeName(theme: ThemeName): string {
		return theme
			.split('-')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
</script>

{#if mounted}
<div class="relative" bind:this={menuRef}>
	<button
		class="btn-icon btn-icon-lg"
		onclick={toggleMenu}
		aria-label="Change theme"
		aria-expanded={isOpen}
		aria-haspopup="true"
		title="Theme Settings"
	>
		{#if $mode === 'dark'}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
			</svg>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="12" r="5"></circle>
				<line x1="12" y1="1" x2="12" y2="3"></line>
				<line x1="12" y1="21" x2="12" y2="23"></line>
				<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
				<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
				<line x1="1" y1="12" x2="3" y2="12"></line>
				<line x1="21" y1="12" x2="23" y2="12"></line>
				<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
				<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
			</svg>
		{/if}
	</button>

	{#if isOpen}
		<div
			class="theme-menu"
			role="menu"
			transition:fade={{ duration: 150 }}
		>
			<div class="theme-menu-section">
				<div class="theme-menu-label">Mode</div>
				<div class="theme-mode-toggle">
					<button
						class="theme-mode-btn"
						class:active={$mode === 'light'}
						onclick={() => selectMode('light')}
						role="menuitem"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<circle cx="12" cy="12" r="5"></circle>
							<line x1="12" y1="1" x2="12" y2="3"></line>
							<line x1="12" y1="21" x2="12" y2="23"></line>
							<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
							<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
							<line x1="1" y1="12" x2="3" y2="12"></line>
							<line x1="21" y1="12" x2="23" y2="12"></line>
							<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
							<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
						</svg>
						<span>Light</span>
					</button>
					<button
						class="theme-mode-btn"
						class:active={$mode === 'dark'}
						onclick={() => selectMode('dark')}
						role="menuitem"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
						</svg>
						<span>Dark</span>
					</button>
				</div>
			</div>

			<div class="theme-menu-section">
				<div class="theme-menu-label">Theme</div>
				<div class="theme-list" role="group">
					{#each themes as themeName}
						<button
							class="theme-item"
							class:active={$theme === themeName}
							onclick={() => selectTheme(themeName)}
							role="menuitemradio"
							aria-checked={$theme === themeName}
						>
							<div class="theme-preview">
								<div class="theme-preview-color" style="background: var(--color-primary-500, #0FBA81);"></div>
								<div class="theme-preview-color" style="background: var(--color-secondary-500, #4F46E5);"></div>
							</div>
							<span>{formatThemeName(themeName)}</span>
							{#if $theme === themeName}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="check-icon"
								>
									<polyline points="20 6 9 17 4 12"></polyline>
								</svg>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
{/if}

<style>
	.theme-menu {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		background: var(--color-surface-50-900-token);
		border: 1px solid var(--color-surface-200-800-token);
		border-radius: var(--theme-rounded-container);
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
		padding: 0.75rem;
		min-width: 240px;
		max-width: 280px;
		z-index: 1000;
		overflow: hidden;
	}

	.theme-menu-section {
		margin-bottom: 0.75rem;
	}

	.theme-menu-section:last-child {
		margin-bottom: 0;
	}

	.theme-menu-label {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-surface-600-400-token);
		margin-bottom: 0.5rem;
		padding: 0 0.5rem;
	}

	.theme-mode-toggle {
		display: flex;
		gap: 0.25rem;
		background: var(--color-surface-100-900-token);
		border-radius: var(--theme-rounded-base);
		padding: 0.25rem;
	}

	.theme-mode-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border-radius: calc(var(--theme-rounded-base) - 2px);
		border: none;
		background: transparent;
		color: var(--color-surface-600-400-token);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.theme-mode-btn:hover {
		background: var(--color-surface-200-800-token);
		color: var(--color-surface-900-50-token);
	}

	.theme-mode-btn.active {
		background: var(--color-primary-500);
		color: var(--on-primary);
	}

	.theme-mode-btn svg {
		flex-shrink: 0;
	}

	.theme-list {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		max-height: 300px;
		overflow-y: auto;
	}

	.theme-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.625rem 0.75rem;
		border-radius: var(--theme-rounded-container);
		border: none;
		background: transparent;
		color: var(--color-surface-900-50-token);
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
		width: 100%;
	}

	.theme-item:hover {
		background: var(--color-surface-100-900-token);
	}

	.theme-item.active {
		background: var(--color-primary-500/10);
		color: var(--color-primary-500);
		font-weight: 600;
	}

	.theme-preview {
		display: flex;
		gap: 0.25rem;
		flex-shrink: 0;
	}

	.theme-preview-color {
		width: 12px;
		height: 12px;
		border-radius: 2px;
		border: 1px solid var(--color-surface-300-700-token);
	}

	.theme-item span {
		flex: 1;
	}

	.check-icon {
		flex-shrink: 0;
		color: var(--color-primary-500);
	}

	/* Scrollbar styling */
	.theme-list::-webkit-scrollbar {
		width: 6px;
	}

	.theme-list::-webkit-scrollbar-track {
		background: transparent;
	}

	.theme-list::-webkit-scrollbar-thumb {
		background: var(--color-surface-300-700-token);
		border-radius: 3px;
	}

	.theme-list::-webkit-scrollbar-thumb:hover {
		background: var(--color-surface-400-600-token);
	}
</style>

