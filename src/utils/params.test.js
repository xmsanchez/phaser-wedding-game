import { describe, expect, it } from 'vitest';
import { decodeInvite, encodeInvite, getInviteParams, inviteQuery } from './params.js';

describe('decodeInvite', () => {
	it('decodes the links that were sent to guests', () => {
		// Real format from the README examples (note the trailing newline in the JSON)
		expect(decodeInvite('eyJwbGF5ZXJOYW1lIjoiWGF2aSIsICJzZXgiOiAibWFuIn0K')).toEqual({
			playerName: 'Xavi',
			sex: 'man',
			raw: 'eyJwbGF5ZXJOYW1lIjoiWGF2aSIsICJzZXgiOiAibWFuIn0K',
		});
		expect(decodeInvite('eyJwbGF5ZXJOYW1lIjoiTWlyaWFtIiwgInNleCI6ICJ3b21hbiJ9Cg==')).toMatchObject({
			playerName: 'Miriam',
			sex: 'woman',
		});
	});

	it('decodes UTF-8 names', () => {
		const raw = encodeInvite({ playerName: 'Mònica Ñúñez', sex: 'woman' });
		expect(decodeInvite(raw)).toMatchObject({ playerName: 'Mònica Ñúñez', sex: 'woman' });
	});

	it('restores a + that the query string turned into a space', () => {
		const raw = encodeInvite({ playerName: 'Pere>>', sex: 'woman' });
		expect(raw).toContain('+');
		expect(decodeInvite(raw.replace(/\+/g, ' '))).toMatchObject({ playerName: 'Pere>>', raw });
	});

	it('falls back to defaults for missing or broken input', () => {
		const defaults = { playerName: '', sex: 'man', raw: '' };
		expect(decodeInvite(null)).toEqual(defaults);
		expect(decodeInvite(undefined)).toEqual(defaults);
		expect(decodeInvite('')).toEqual(defaults);
		expect(decodeInvite('not base64!!')).toEqual(defaults);
		expect(decodeInvite(btoa('not json'))).toEqual(defaults);
	});

	it('sanitises unexpected field values', () => {
		const raw = btoa(JSON.stringify({ playerName: 42, sex: 'robot' }));
		expect(decodeInvite(raw)).toMatchObject({ playerName: '', sex: 'man' });
	});
});

describe('getInviteParams / inviteQuery', () => {
	it('reads the parameters query argument', () => {
		const raw = encodeInvite({ playerName: 'Test', sex: 'man' });
		expect(getInviteParams(inviteQuery(raw))).toMatchObject({ playerName: 'Test', raw });
	});

	it('builds an empty query when there is no invitation', () => {
		expect(inviteQuery('')).toBe('');
	});
});
