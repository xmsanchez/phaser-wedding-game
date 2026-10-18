// Level4 puzzle: boxes must be opened in a given order.
// press() returns 'wrong' (sequence reset), 'progress' or 'solved'.
export default class BoxPuzzle {
	constructor(solution) {
		this.solution = solution;
		this.pressed = [];
		this.solved = false;
	}

	press(order) {
		if (this.solved) return 'solved';
		this.pressed.push(order);
		const isPrefix = this.pressed.every((value, i) => value === this.solution[i]);
		if (!isPrefix) {
			this.reset();
			return 'wrong';
		}
		if (this.pressed.length === this.solution.length) {
			this.solved = true;
			return 'solved';
		}
		return 'progress';
	}

	reset() {
		this.pressed = [];
	}
}
