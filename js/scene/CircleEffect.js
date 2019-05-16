function CircleEffect(scene) {
    var object = new THREE.Object3D();
    this.object = object;
    this.points;

    object.position.y = 1;
    scene.add(object);

    this.update = function() {
        this.object.position.x = controls.getPosition().x;
        this.object.position.z = controls.getPosition().z;
    }

    this.start = function() {
        object.children = [];
    }
}