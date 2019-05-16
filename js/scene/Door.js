function Door(scene) {
  var object = new THREE.Object3D();
  this.object = object;
  let loader = new THREE.STLLoader();
  loader.load('objects/Portal.stl', function (geometry) {
    let material = new THREE.MeshBasicMaterial(
      { color: 0xfdfd96} );
    door = new THREE.Mesh(geometry, material);

    // door.position.set(0,5,10);
    door.position.set(-4.5, -4.5, 0);
    door.rotation.set(0,0,0);
    door.scale.set(.05,.05,.02);

    door.castShadow = true;
    door.receiveShadow = true;

    object.position.set(0, 5, 20);
    object.add(door);
    
    scene.add(object);

  });

  this.update = function() {
    this.object.rotation.z += 0.05;
  }

}
