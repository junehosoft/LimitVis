function RandomCube(scene) {
  // random cubes
  for (let i = 0; i < 7; i++) {
    let width = Math.round(Math.random()*50+10);
    let height = Math.round(Math.random()*200+100);
    let depth = Math.round(Math.random()*50+10);
    let boxGeo = new THREE.BoxGeometry(width, height, depth);

    boxMaterial = new THREE.MeshPhongMaterial({
      color: 0xaaaaaa,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1.0,
    });

    box = new THREE.Mesh(boxGeo, boxMaterial);
    box.position.x = Math.random()*400-200;// for some reason these are clustering
    box.position.y = 0;
    box.position.z = Math.random()*400-200;
    box.receiveShadow = true;
    box.castShadow = true;
    scene.add(box);
    boxes.push(box);
    // console.log(boxes)

    collidableObjects.push(box);


  }

  this.update = function(time) {

  }
}
