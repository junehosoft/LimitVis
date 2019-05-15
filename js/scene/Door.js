function Door(scene) {

    let loader = new THREE.STLLoader();
    loader.load('objects/Transmutationcircle.stl', function (geometry) {
      let material = new THREE.MeshBasicMaterial(
        { color: 0xfdfd96} );
      door = new THREE.Mesh(geometry, material);
  
      // door.position.set(0,5,10);
      door.position.set(0, 0, 20);
      door.rotation.set(0,0,0);
      door.scale.set(.05,.05,.02);
  
      door.castShadow = true;
      door.receiveShadow = true;
      
      scene.add(door);
  
    });
  
  
    this.update = function(time) {
  
  
    }
  
  }
  