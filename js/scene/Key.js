function Key(scene) {
  this.time = 0;
  let loader = new THREE.STLLoader();
  loader.load('objects/Key.stl', function (geometry) {
    let material = new THREE.MeshBasicMaterial(
      { color: 0xfdfd96} );
    key = new THREE.Mesh(geometry, material);
    
    var index = Math.floor(Math.random() * 64);
    {
      let x = (index / 10 * 50) - 175;
      let z = (index % 10 * 50) - 175;
      key.position.set(x,1.5,z);
      key.rotation.set(0,0,0);
      key.scale.set(.6,.6,.6);
      console.log(key.position);
    }
    key.castShadow = true;
    // key.receiveShadow = true;
    scene.add(key);

  });

  this.update = function(delta) {
    this.time += delta;
    key.position.y = Math.sin(this.time * Math.PI) * 0.5 + 1.5;
  }


}
