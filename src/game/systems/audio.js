import { MUSIC } from '../data/assets.js';

// Queues the music files a level needs (skipping the ones already cached)
export function queueMusic(scene, keys) {
	keys.forEach((key) => {
		if (!scene.cache.audio.exists(key)) scene.load.audio(key, MUSIC[key]);
	});
}

// Starts the level tracks; they are destroyed when the scene shuts down
export function startMusic(scene, tracks) {
	scene.music = tracks.map(({ key, loop, volume }) => {
		const sound = scene.sound.add(key, { loop, volume });
		sound.play();
		return sound;
	});
	scene.events.once('shutdown', () => {
		scene.music.forEach((sound) => sound.destroy());
		scene.music = [];
	});
}

// Adds a track while the level is running and fades it in
export function fadeInTrack(scene, key, { loop = true, volume, duration }) {
	const sound = scene.sound.add(key, { loop, volume: 0.001 });
	scene.music.push(sound);
	sound.play();
	scene.tweens.add({ targets: sound, volume, duration });
}

export function fadeOutMusic(scene, duration = 400) {
	scene.music.forEach((sound) => {
		scene.tweens.add({ targets: sound, volume: 0, duration, onComplete: () => sound.stop() });
	});
}

// One-shot sound effect: Phaser destroys it once it finishes
export function playSfx(scene, key, config) {
	scene.sound.play(key, config);
}

export const playChestSound = (scene) => playSfx(scene, 'audio_chest_opened', { volume: 0.4 });

// Plays a sound several times in a row (e.g. Pluto's barks)
export function playRepeated(scene, key, times, config) {
	const sound = scene.sound.add(key, config);
	let remaining = times;
	sound.on('complete', () => {
		remaining -= 1;
		if (remaining > 0) sound.play();
		else sound.destroy();
	});
	sound.play();
}
