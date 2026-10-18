// Add ?debug=1 to the URL to see physics bodies and game logs
export const DEBUG = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug');

export function debug(...args) {
	if (DEBUG) console.log('[game]', ...args);
}
