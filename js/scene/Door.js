function Door(scene) {

    let loader = new THREE.STLLoader();
    loader.load('dungeon_door.stl', function (geometry) {
      let material = new THREE.MeshPhongMaterial(
        { color: 0x63e7ff, specular: 0xcefdff, shininess: 200 } );
      door = new THREE.Mesh(geometry, material);
  
      door.position.set(-50,5,-200);
      door.rotation.set(0,0,0);
      door.scale.set(.25,.25,.25);
  
      door.castShadow = true;
      door.receiveShadow = true;
  
      collidableObjects.push(door);
        
      scene.add(door);
  
    });
  
  
    this.update = function(time) {
  
  
    }
  
  }
  