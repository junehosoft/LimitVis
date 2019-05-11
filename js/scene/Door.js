function Door(scene) {

    let loader = new THREE.STLLoader();
    loader.load('dungeon_door.stl', function (geometry) {
      let material = new THREE.MeshPhongMaterial(
        { color: 0x63e7ff, specular: 0xcefdff, shininess: 200 } );
      door = new THREE.Mesh(geometry, material);
  
      door.position.set(0,5,10);
      // door.position.set(0, 5, 20);
      door.rotation.set(0,0,0);
      door.scale.set(.25,.25,.25);
  
      door.castShadow = true;
      door.receiveShadow = true;
      
      scene.add(door);
  
    });
  
  
    this.update = function(time) {
  
  
    }
  
  }
  