function Key(scene) {

  let loader = new THREE.STLLoader();
  loader.load('Key.stl', function (geometry) {
    let material = new THREE.MeshPhongMaterial(
      { color: 0x63e7ff, specular: 0xcefdff, shininess: 200 } );
    key = new THREE.Mesh(geometry, material);

    key.position.set(0,2,0);
    key.rotation.set(0,0,0);
    key.scale.set(1,1,1);

    key.castShadow = true;
    key.receiveShadow = true;

    collidableObjects.push(key);

    scene.add(key);

  });


  this.update = function(time) {


  }

}
