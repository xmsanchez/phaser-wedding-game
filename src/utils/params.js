// Invitation links carry the guest data as base64-encoded JSON:
//   /?parameters=<base64 of {"playerName": "Xavi", "sex": "man"}>

const DEFAULTS = { playerName: '', sex: 'man' };

export function decodeInvite(raw) {
	if (!raw) return { ...DEFAULTS, raw: '' };

	// URLSearchParams turns an unescaped '+' into a space, which is invalid base64
	const base64 = raw.trim().replace(/ /g, '+');
	try {
		// Decode as UTF-8 so names with accents (e.g. "Mònica") survive
		const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
		const data = JSON.parse(new TextDecoder().decode(bytes));
		return {
			playerName: typeof data.playerName === 'string' ? data.playerName : DEFAULTS.playerName,
			sex: data.sex === 'woman' ? 'woman' : 'man',
			raw: base64,
		};
	} catch {
		return { ...DEFAULTS, raw: '' };
	}
}

export function encodeInvite({ playerName, sex }) {
	const bytes = new TextEncoder().encode(JSON.stringify({ playerName, sex }));
	return btoa(String.fromCharCode(...bytes));
}

export function getInviteParams(search = window.location.search) {
	return decodeInvite(new URLSearchParams(search).get('parameters'));
}

// Query string to carry the invitation across pages ('' when there is none)
export function inviteQuery(raw) {
	return raw ? `?parameters=${encodeURIComponent(raw)}` : '';
}
