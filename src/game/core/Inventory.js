// Player inventory, persisted in the Phaser registry so it survives scene changes.
// Plain JS (no Phaser imports) so it can be unit-tested.
export default class Inventory {
	constructor(registry) {
		this.registry = registry;
		this.listeners = new Set();
		if (!Array.isArray(registry.get('inventory'))) registry.set('inventory', []);
	}

	get items() {
		return this.registry.get('inventory');
	}

	has(item) {
		return this.items.includes(item);
	}

	add(item) {
		if (item === undefined || item === null || item === '') return;
		this.registry.set('inventory', [...this.items, item]);
		this.notify();
	}

	// Removes one occurrence of the given item; returns whether it was there
	remove(item) {
		const index = this.items.indexOf(item);
		if (index === -1) return false;
		const items = [...this.items];
		items.splice(index, 1);
		this.registry.set('inventory', items);
		this.notify();
		return true;
	}

	onChange(listener) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	notify() {
		this.listeners.forEach((listener) => listener(this.items));
	}
}
