// Inventory items: frame in the 'objects' spritesheet and the text used in "Has trobat ..."
export const ITEMS = {
	key: { frame: 18, label: 'una clau' },
	map: { frame: 8, label: 'un mapa' },
	clock: { frame: 5 },
	bruixola: { frame: 30 },
	pal: { frame: 31 },
	vestit: { frame: 32 },
};

export const itemFrame = (item) => ITEMS[item]?.frame ?? 0;
export const itemLabel = (item) => ITEMS[item]?.label ?? item;
