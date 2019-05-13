function Door(scene) {

    let loader = new THREE.STLLoader();
    loader.load('hoop.stl', function (geometry) {
      let material = new THREE.MeshNormalMaterial(
        { } );
      door = new THREE.Mesh(geometry, material);
  
      // door.position.set(0,5,10);
      door.position.set(0, 6, 20);
      door.rotation.set(0,0,0);
      door.scale.set(.1,.1,.1);
  
      door.castShadow = true;
      door.receiveShadow = true;
      
      scene.add(door);
  
    });
  
  
    this.update = function(time) {
  
  
    }
  
  }
  