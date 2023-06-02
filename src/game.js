import Phaser from 'phaser'
import MainMenu from './scenes/MainMenu'
import PreLevel from './scenes/PreLevel'
import UIScene from './scenes/UIScene'
import Level0 from './scenes/Level0'
import Level1Prev from './scenes/Level1Prev'
import Level1 from './scenes/Level1'
import Level2Prev from './scenes/Level2Prev'
import Level2Prev2 from './scenes/Level2Prev2'
import Level2 from './scenes/Level2'
import Level3Prev from './scenes/Level3Prev'
import Level3Prev2 from './scenes/Level3Prev2'
import Level3 from './scenes/Level3'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 1200,
    scale: {
        // mode: Phaser.Scale.ENVELOP,
		mode: Phaser.Scale.FIT,
    },
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 1000 },
			// debug: true
		}
	},
	render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true
    },
	scene: [ 
		MainMenu,
		PreLevel,
		UIScene,
		Level0,
		Level1Prev,
		Level1,
		Level2Prev,
		Level2Prev2,
		Level2,
		Level3Prev,
		Level3Prev2,
		Level3,
	]
}

export default new Phaser.Game(config)
