export default class Camera {
    constructor() {}
	
    setCamera(scene, zoom) {
		// Set up camera to follow the player
		const camera = scene.cameras.main;
		camera.startFollow(scene.player);
		camera.setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels);

		// Set up camera zoom
		camera.setZoom(zoom);
    }

    setCameraLastScene(scene, zoom) {
		// Set up camera to follow the player
		const camera = scene.cameras.main;
		camera.setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels);
		camera.scrollX = scene.map.widthInPixels - camera.width;

		// Set up camera zoom
		camera.setZoom(zoom); 
    }
}