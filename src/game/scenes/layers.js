// Layer presets for the maps shared by several scenes
export const HOUSE_INSIDE = {
	map: 'house-inside',
	tilesets: { room: ['livingroom', 'livingroom'] },
	layers: [
		{ name: 'bg_background', tileset: 'room' },
		{ name: 'fg_background', tileset: 'room' },
		{ name: 'ground_bg', tileset: 'room' },
		{ name: 'ground_fg', tileset: 'room', collide: true },
		{ name: 'ground_decorations', tileset: 'room' },
		{ name: 'decorations', tileset: 'room' },
	],
	collision: [0, 1400],
	zoom: 2.4,
};

export const HOUSE_OUTSIDE = {
	map: 'house-outside',
	tilesets: { outside: ['house-outside', 'house-outside'] },
	layers: [
		{ name: 'bg_background', tileset: 'outside' },
		{ name: 'ground_fg', tileset: 'outside', collide: true },
	],
	collision: [0, 1400],
	zoom: 2.4,
};

// Jungle backgrounds used by the forest levels, with parallax scrolling
export const jungleBackground = (tileset, field) => [
	{ name: 'bg_5', tileset, scroll: 0.7 },
	{ name: 'bg_4', tileset, scroll: 0.8 },
	{ name: 'bg_3', tileset, scroll: 0.9 },
	{ name: 'bg_2', tileset },
	{ name: 'top_bg4', tileset: field },
	{ name: 'top_bg3', tileset: field },
];
