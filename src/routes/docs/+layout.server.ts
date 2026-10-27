import { nav } from '$lib/docs/load'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = () => ({ nav: nav() })
