function Key(scene) {

  let loader = new THREE.STLLoader();
  loader.load('Key.stl', function (geometry) {
    let material = new THREE.MeshPhongMaterial(
      { color: 0x63e7ff, specular: 0xcefdff, shininess: 200 } );
    newkey = new THREE.Mesh(geometry, material);

    newkey.position.set(10,2,0);
    newkey.rotation.set(0,0,0);
    newkey.scale.set(1,1,1);

    newkey.castShadow = true;
    newkey.receiveShadow = true;

    key.push(newkey);

    scene.add(newkey);

  });


  this.update = function(time) {


  }

}
