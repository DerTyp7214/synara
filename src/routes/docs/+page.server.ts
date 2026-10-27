import { loadDoc } from '$lib/docs/load';
import { pageData } from '$lib/docs/page-data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { nav } = await parent();
	return pageData(await loadDoc('README.md'), nav);
};
