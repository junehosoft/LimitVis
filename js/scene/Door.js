function Door(scene) {

    let loader = new THREE.STLLoader();
    loader.load('dungeon_door.stl', function (geometry) {
      let material = new THREE.MeshPhongMaterial(
        { color: 0x63e7ff, specular: 0xcefdff, shininess: 200 } );
      let newdoor = new THREE.Mesh(geometry, material);
  
      newdoor.position.set(-50,5,-200);
      newdoor.rotation.set(0,0,0);
      newdoor.scale.set(.25,.25,.25);
  
      newdoor.castShadow = true;
      newdoor.receiveShadow = true;
      
      door.push(newdoor);
      scene.add(newdoor);
  
    });
  
  
    this.update = function(time) {
  
  
    }
  
  }
  