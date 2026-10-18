import { describe, expect, it, vi } from 'vitest';
import DialogQueue from './DialogQueue.js';
import Inventory from './Inventory.js';
import BoxPuzzle from './BoxPuzzle.js';

// Minimal stand-in for Phaser's registry
const fakeRegistry = () => {
	const data = new Map();
	return { get: (k) => data.get(k), set: (k, v) => data.set(k, v) };
};

describe('DialogQueue', () => {
	it('walks the lines and completes once, after the last one', () => {
		const onComplete = vi.fn();
		const lines = ['a', 'b'];
		const queue = new DialogQueue(lines, onComplete);

		expect(queue.current).toBe('a');
		expect(queue.next()).toBe('b');
		expect(onComplete).not.toHaveBeenCalled();
		expect(queue.next()).toBeUndefined();
		expect(queue.done).toBe(true);

		queue.complete();
		queue.complete();
		expect(onComplete).toHaveBeenCalledTimes(1);
	});

	it('never mutates the caller array (it used to be emptied)', () => {
		const lines = ['a', 'b', 'c'];
		const queue = new DialogQueue(lines);
		while (queue.next() !== undefined);
		expect(lines).toEqual(['a', 'b', 'c']);
	});

	it('accepts a single string', () => {
		const queue = new DialogQueue('only');
		expect(queue.current).toBe('only');
		expect(queue.next()).toBeUndefined();
	});
});

describe('Inventory', () => {
	it('adds, finds and notifies', () => {
		const inventory = new Inventory(fakeRegistry());
		const listener = vi.fn();
		inventory.onChange(listener);

		inventory.add('key');
		expect(inventory.has('key')).toBe(true);
		expect(listener).toHaveBeenCalledWith(['key']);
	});

	it('removes the requested item, not the last one (old pop() bug)', () => {
		const inventory = new Inventory(fakeRegistry());
		inventory.add('key');
		inventory.add('pal');
		expect(inventory.remove('key')).toBe(true);
		expect(inventory.items).toEqual(['pal']);
		expect(inventory.remove('key')).toBe(false);
	});

	it('ignores empty contents', () => {
		const inventory = new Inventory(fakeRegistry());
		inventory.add('');
		inventory.add(undefined);
		expect(inventory.items).toEqual([]);
	});

	it('persists through the registry', () => {
		const registry = fakeRegistry();
		new Inventory(registry).add('map');
		expect(new Inventory(registry).has('map')).toBe(true);
	});
});

describe('BoxPuzzle', () => {
	const solution = [6, 4, 8, 2, 9, 1, 3, 7, 5];

	it('is solved with the right order', () => {
		const puzzle = new BoxPuzzle(solution);
		const results = solution.map((box) => puzzle.press(box));
		expect(results.slice(0, -1).every((r) => r === 'progress')).toBe(true);
		expect(results.at(-1)).toBe('solved');
	});

	it('resets on a wrong box', () => {
		const puzzle = new BoxPuzzle(solution);
		expect(puzzle.press(6)).toBe('progress');
		expect(puzzle.press(8)).toBe('wrong');
		expect(puzzle.pressed).toEqual([]);
		expect(puzzle.press(6)).toBe('progress');
	});
});
