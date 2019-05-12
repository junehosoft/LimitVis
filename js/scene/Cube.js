function Cube(scene, dimension, position) {
  if (dimension === undefined) {
  // random cubes
    var width = Math.round(Math.random()*50+10);
    var height = Math.round(Math.random()*200+100);
    var depth = Math.round(Math.random()*50+10);
    var boxGeo = new THREE.BoxGeometry(width, height, depth);
  } else {
    var boxGeo = new THREE.BoxGeometry(dimension.x, dimension.y, dimension.z);
  }
  boxMaterial = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1.0,
  });

  box = new THREE.Mesh(boxGeo, boxMaterial);
  if (pistion === undefined) {
    box.position.x = Math.random()*400-200;// for some reason these are clustering
    box.position.y = 0;
    box.position.z = Math.random()*400-200;
  } else {
    box.position.x = position.x;
    box.position.y = 0;
    box.position.z = position.z;
  }
  if (Math.abs(box.position.x) < PLAYERCOLLISIONDIST)
    box.position.x += PLAYERCOLLISIONDIST;

  if (Math.abs(box.position.z) < PLAYERCOLLISIONDIST)
    box.position.z += PLAYERCOLLISIONDIST;
  // box.receiveShadow = true;
  // box.castShadow = true;
  scene.add(box);
  boxes.push(box);
  // console.log(boxes)

  collidableObjects.push(box);
}

