import Phaser from 'phaser'

export default class BaseScene extends Phaser.Scene {
  constructor(key) {
    super({ key: key })
  }

  init() {
    // Initialize the shared data
    this.data.set('inventory', [])
    this.data.set('interactedNPCs', [])
    this.data.set('firstInteraction', true)
  }

  // Add any common methods or functions related to shared data here
  // For example, you could have methods to add items to the inventory,
  // interact with NPCs, etc.
}
