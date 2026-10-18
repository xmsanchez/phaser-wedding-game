import { useEffect } from 'react';
import Phaser from 'phaser';
import config from '../../game/config.js';

function Game({ invite }) {
	useEffect(() => {
		let game = null;
		// Create the game on the next tick: React StrictMode mounts/unmounts/mounts synchronously in dev,
		// and two overlapping games would clash on Phaser's global plugin cache.
		const timer = setTimeout(() => {
			game = new Phaser.Game({
				...config,
				// Make the invitation available to every scene before the first one starts
				callbacks: { preBoot: (g) => g.registry.set('invite', invite) },
			});
			if (import.meta.env.DEV) window.__game = game;
		});

		return () => {
			clearTimeout(timer);
			game?.destroy(true);
		};
	}, [invite]);

	return <div id="phaser-game" />;
}

export default Game;
