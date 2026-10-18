import DialogQueue from './DialogQueue.js';
import { mainMenu } from '../data/dialogs.ca.js';

const PADDING = 20;

// Message box rendered on the UIScene. show() queues dialogs; advance() is driven by the
// interact input (B button / ENTER) and fires onComplete after the last line is dismissed.
export default class DialogBox {
	constructor(scene) {
		this.scene = scene;
		this.queue = null;
		this.pending = [];
		this.objects = [];
	}

	get isOpen() {
		return this.queue !== null;
	}

	show(lines, onComplete) {
		if (!lines || lines.length === 0) return;
		if (this.isOpen) {
			this.pending.push([lines, onComplete]);
			return;
		}
		this.queue = new DialogQueue(lines, onComplete);
		this.render(this.queue.current);
	}

	advance() {
		if (!this.isOpen) return;
		this.clear();
		const line = this.queue.next();
		if (line !== undefined) {
			this.render(line);
			return;
		}

		const finished = this.queue;
		this.queue = null;
		finished.complete();
		if (!this.isOpen && this.pending.length > 0) this.show(...this.pending.shift());
	}

	render(message) {
		const { scene } = this;
		const camera = scene.cameras.main;
		const boxWidth = camera.width - 50;
		const centerX = camera.centerX;
		const centerY = camera.centerY - 80;
		const wrap = { mode: 'word', width: boxWidth - PADDING * 2 };

		// The box is created first so it is drawn below the text; it is sized once the text is measured
		const box = scene.add.graphics().setScrollFactor(0);

		// **text** is highlighted in red bold
		const bbcode = message.replace(/\*\*(.*?)\*\*/g, '[color=#ff0000][b]$1[/b][/color]');
		const text = scene.add.rexBBCodeText(centerX, centerY - 10, bbcode, { fontSize: '52px', fill: '#ffffff', wrap });
		text.setOrigin(0.5).setScrollFactor(0);

		const boxHeight = Math.max(text.height + PADDING * 2 + 60, 100);
		const boxY = centerY - boxHeight / 2;
		box.fillStyle(0x000000, 0.85);
		box.fillRect(centerX - boxWidth / 2, boxY, boxWidth, boxHeight);
		box.lineStyle(2, 0xffffff);
		box.strokeRect(centerX - boxWidth / 2, boxY, boxWidth, boxHeight);

		const hint = scene.add.rexBBCodeText(centerX, boxY + boxHeight - 45, mainMenu.continueHint, { fontSize: '32px', fill: '#ffffff', wrap });
		hint.setOrigin(0.5, 0).setScrollFactor(0);

		this.objects.push(box, text, hint);
	}

	clear() {
		this.objects.forEach((obj) => obj.destroy());
		this.objects = [];
	}

	destroy() {
		this.clear();
		this.queue = null;
		this.pending = [];
	}
}
