function Key(scene) {

  let loader = new THREE.STLLoader();
  loader.load('Key.stl', function (geometry) {
    let material = new THREE.MeshToonMaterial(
      { color: 0xdaa520} );
    key = new THREE.Mesh(geometry, material);

    key.position.set(10,2,0);
    key.rotation.set(0,0,0);
    key.scale.set(.6,.6,.6);

    key.castShadow = true;
    // key.receiveShadow = true;
    scene.add(key);

  });


  this.update = function(time) {


  }

}
