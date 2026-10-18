// Objects of a group (or a single object) currently overlapping the player
export function overlapping(scene, target) {
	if (!target) return [];
	const objects = target.getChildren ? target.getChildren() : target;
	const found = [];
	scene.physics.world.overlap(scene.player, objects, (player, obj) => found.push(obj));
	return found;
}

// Shows the "B" hint over the objects the player can interact with right now
export function updateHints(scene, group) {
	if (!group) return;
	group.getChildren().forEach((obj) => obj.container.setVisible(false));
	overlapping(scene, group).forEach((obj) => {
		// Doors are always interactable; treasures only until opened
		if (obj.kind === 'door' || !obj.opened) obj.container.setVisible(true);
	});
}
