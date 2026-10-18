// Animation frames for the Disney characters: [stand, talking] in generateFrameNumbers format.
// Any other NPC (Bug, Obrer, Rapunzel...) gets a single-frame stand/talking animation.
export const DISNEY_FRAMES = {
	'Bèstia': [{ frames: [2, 11] }, { frames: [0, 1, 2, 3, 8, 10] }],
	'Aladdin': [{ start: 37, end: 38 }, { start: 37, end: 40 }],
	'Malèfica': [{ frames: [0, 3] }, { start: 0, end: 5 }],
	'Gaston': [{ frames: [0, 2] }, { start: 0, end: 5 }],
	'Geni': [{ frames: [1, 3] }, { start: 1, end: 5 }],
	'Peter Pan': [{ frames: [38, 39] }, { start: 38, end: 42 }],
	'Pluto': [{ frames: [9, 21] }, { frames: [4, 8, 25, 34, 32, 33] }],
	'Simba': [{ frames: [5, 7] }, { start: 2, end: 9 }],
	'Hades': [{ frames: [97, 98] }, { frames: [101, 103, 104, 107, 108, 110] }],
};

export const DEFAULT_FRAMES = [{ start: 0, end: 0 }, { start: 0, end: 0 }];

// The hosts are drawn with a static frame (no animations, no vertical offset)
export const HOSTS = ['Xavi', 'Miriam'];

// Bug looks at the player when close: frame when near / far
export const BUG_FRAMES = { near: 23, far: 29, barking: 24, nearDistance: 100 };

// Characters that float up and down: amplitude in pixels
export const FLYING_NPCS = { 'Peter Pan': 20, 'Geni': 4 };
