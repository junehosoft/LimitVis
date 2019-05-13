function Key(scene) {

  let loader = new THREE.STLLoader();
  loader.load('Key.stl', function (geometry) {
    let material = new THREE.MeshBasicMaterial(
      { color: 0xff0000} );
    key = new THREE.Mesh(geometry, material);
    
    var index = Math.floor(Math.random() * 64);
    {
      let x = (index / 10 * 50) - 175;
      let z = (index % 10 * 50) - 175;
      key.position.set(x,2,z);
      key.rotation.set(0,0,0);
      key.scale.set(.6,.6,.6);
      console.log(key.position);
    }
    key.castShadow = true;
    // key.receiveShadow = true;
    scene.add(key);

  });


  this.update = function(time) {


  }

}
