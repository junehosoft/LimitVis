// initializes the player 
function Player() {
    this.position = new THREE.Vector3();
    this.camera = new THREE.PerspectiveCamera( 60, sceneWidth / sceneHeight, 0.1, 1000 );//perspective camera
	this.camera.position.y = 4;
	this.camera.position.z = 15;
	scene.add(camera);
}

