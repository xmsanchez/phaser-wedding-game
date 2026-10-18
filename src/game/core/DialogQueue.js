// Pure dialog sequencing logic, independent from rendering.
// The caller's array is copied, never mutated, and onComplete runs once,
// after the last line has been dismissed.
export default class DialogQueue {
	constructor(lines, onComplete) {
		this.lines = Array.isArray(lines) ? [...lines] : [lines];
		this.index = 0;
		this.onComplete = onComplete;
	}

	get current() {
		return this.lines[this.index];
	}

	get done() {
		return this.index >= this.lines.length;
	}

	// Moves to the next line and returns it, or undefined when there are no more lines
	next() {
		if (!this.done) this.index += 1;
		return this.current;
	}

	complete() {
		const callback = this.onComplete;
		this.onComplete = null;
		callback?.();
	}
}
