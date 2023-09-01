import $ from 'jquery';
import browser from 'webextension-polyfill';
import { isPageDataResponse } from './types/pageData';

export function getUrlParams() {
	const urlParams = new URLSearchParams(window.location.search);
	const params = new Map<string, string>();
	for (const [key, value] of urlParams) {
		params.set(key, value);
	}
	return params;
}

$(async function () {
	console.log('Mafia Engine has loaded.');
	console.log('This should only be called on forum.mafiascum.net');

	const urlParams = getUrlParams();
	if (!(urlParams.has('t') || urlParams.has('p'))) return console.log('Page is not a topic or post.');

	let url = `https://forum.mafiascum.net/viewtopic.php?`; //t=${urlParams.get('t')}&p=${urlParams.get('p')}`
	if (urlParams.has('t')) url += `t=${urlParams.get('t')}`;
	if (urlParams.has('p')) url += `p=${urlParams.get('p')}`;

	const pageData = await fetchPageData(url);
	console.log('Page Data from Background Script', pageData);
});

async function fetchPageData(url: string) {
	try {
		const pageData = await browser.runtime.sendMessage({ action: 'getPageData', url: url });
		if (!isPageDataResponse(pageData)) return null;

		return pageData;
	} catch (err) {
		console.error(err);
		return null;
	}
}
