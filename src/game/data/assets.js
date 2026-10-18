// Asset manifest. Everything here is loaded up front by MainMenu, except MUSIC,
// which each level loads on demand (see BaseLevel.preload).

export const IMAGES = {
	tileset_field: 'assets/tilesets/tileset_field/tileset.png',
	tileset_evening: 'assets/tilesets/tileset_field/tileset_evening.png',
	tileset_night: 'assets/tilesets/tileset_field/tileset_night.png',
	sky_night: 'assets/tilesets/sky_night/sky_night.png',
	tileset_jungle: 'assets/tilesets/tileset_jungle/tileset_jungle_embed.png',
	tileset_jungle_evening: 'assets/tilesets/tileset_jungle/tileset_jungle_embed_evening.png',
	swamp: 'assets/tilesets/tileset_swamp/swamp.png',
	swamp_bg: 'assets/tilesets/tileset_swamp/swamp_bg.png',
	livingroom: 'assets/tilesets/house-inside/livingroom.png',
	castle_outside: 'assets/tilesets/tileset_castle/castle_outside.png',
	castle_inside: 'assets/tilesets/tileset_castle/castle_inside.png',
	'house-outside': 'assets/tilesets/house-outside/house-outside.png',
};

const sheet = (path, frameWidth, frameHeight) => ({ path, frameWidth, frameHeight });

export const SPRITESHEETS = {
	logo: sheet('assets/spritesheets/logo_pixelart_medium_white.png', 395, 420),
	npc_xavi: sheet('assets/spritesheets/npcs/xavi.png', 32, 32),
	npc_mi: sheet('assets/spritesheets/npcs/mi.png', 32, 32),
	npc_bug: sheet('assets/spritesheets/npcs/bug.png', 32, 32),
	npc_bunny: sheet('assets/spritesheets/npcs/bunny.png', 45, 45),
	npc_bestia: sheet('assets/spritesheets/npcs/disney/bestia.png', 64, 64),
	npc_aladdin: sheet('assets/spritesheets/npcs/disney/aladdin.png', 45, 60),
	npc_gaston: sheet('assets/spritesheets/npcs/disney/gaston.png', 45, 60),
	npc_malefica: sheet('assets/spritesheets/npcs/disney/malefica.png', 50, 70),
	npc_peter: sheet('assets/spritesheets/npcs/disney/peter.png', 45, 60),
	npc_geni: sheet('assets/spritesheets/npcs/disney/geni.png', 65, 85),
	npc_pluto: sheet('assets/spritesheets/npcs/disney/pluto.png', 65, 45),
	npc_rapunzel: sheet('assets/spritesheets/npcs/disney/rapunzel.png', 35, 50),
	npc_simba: sheet('assets/spritesheets/npcs/disney/simba.png', 35, 35),
	npc_hades: sheet('assets/spritesheets/npcs/disney/hades.png', 35, 85),
	npc_stan: sheet('assets/spritesheets/npcs/stan.png', 66, 66),
	npc_fairy: sheet('assets/spritesheets/npcs/fairy.png', 64, 64),
	npc_worker: sheet('assets/spritesheets/npcs/worker.png', 32, 32),
	lantern: sheet('assets/spritesheets/objects/lantern_illuminated.png', 96, 141),
	treasure: sheet('assets/spritesheets/objects/treasure.png', 16, 16),
	objects: sheet('assets/spritesheets/objects/objects.png', 16, 16),
	fire: sheet('assets/spritesheets/objects/fire1.png', 16, 16),
};

// The player sprite depends on the guest (see the invitation params)
export const PLAYER_SHEETS = {
	man: sheet('assets/spritesheets/player/player.png', 32, 32),
	woman: sheet('assets/spritesheets/player/player_woman.png', 32, 32),
};

export const TILEMAPS = {
	'house-inside': 'assets/maps/house-inside.json',
	'house-outside': 'assets/maps/house-outside.json',
	'house-outside-castle-direction': 'assets/maps/house-outside-castle-direction.json',
	level1: 'assets/maps/level1.json',
	level2: 'assets/maps/level2.json',
	level3: 'assets/maps/level3.json',
	level4: 'assets/maps/level4.json',
	level5: 'assets/maps/level5.json',
};

// Short sound effects
export const SFX = {
	audio_chest_opened: 'assets/audio/new_item.mp3',
	audio_dog_bark: 'assets/audio/dog_bark2.mp3',
	audio_footsteps: 'assets/audio/footsteps.mp3',
	audio_piano_s1: 'assets/audio/piano/C5.mp3',
	audio_piano_s2: 'assets/audio/piano/D5.mp3',
	audio_piano_s3: 'assets/audio/piano/E5.mp3',
	audio_piano_s4: 'assets/audio/piano/F5.mp3',
	audio_piano_s5: 'assets/audio/piano/G5.mp3',
};

// Background music and ambience, loaded lazily per level
export const MUSIC = {
	background_music_house: 'assets/audio/music/PerituneMaterial_Dawning_Tale.mp3',
	background_music_woods2: 'assets/audio/music/PerituneMaterial_SnowChill_loop.mp3',
	background_music_bunny2: 'assets/audio/music/Run-Amok.mp3',
	background_music_tangled: 'assets/audio/tangled_revamped.mp3',
	background_music_tangled_real: 'assets/audio/tangled_can_see_the_light.mp3',
	audio_birds: 'assets/audio/nature_birds.mp3',
};

// Music presets used by the level configs: [{ key, loop, volume }]
export const TRACKS = {
	house: [{ key: 'background_music_house', loop: true, volume: 0.2 }],
	houseOutside: [{ key: 'audio_birds', loop: true, volume: 0.2 }],
	field: [{ key: 'audio_birds', loop: false, volume: 0.4 }],
	jungle: [
		{ key: 'background_music_woods2', loop: true, volume: 0.2 },
		{ key: 'audio_birds', loop: false, volume: 0.4 },
	],
	swamp: [{ key: 'background_music_bunny2', loop: true, volume: 0.2 }],
	night: [{ key: 'background_music_tangled_real', loop: false, volume: 0.4 }],
};
