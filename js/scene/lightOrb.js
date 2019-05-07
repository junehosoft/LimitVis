 
 function lightOrb () {
  // light orbs
  var sphereLight = new THREE.SphereGeometry(1,10,10);
  var lightOrbMaterial = new THREE.MeshBasicMaterial(
    { color: 0xffffff, shininess: 200 }
  );

  lightOrb = new THREE.Mesh(sphereLight, lightOrbMaterial);
  lightOrb.position.set(4.0,4.0,4.0);
  lightOrb.receiveShadow = false;
  // lightOrb.castShadow = true;
  lightOrb.scale.set(0.5,0.5,0.5);
  scene.add(lightOrb);

  // now let's make them glow?
  var customGlow = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  });

  var glowSphere = new THREE.SphereGeometry(2, 20, 20);
  var glowBall = new THREE.Mesh(glowSphere, customGlow);
  glowBall.position.set(4.0,4.0,4.0);
  glowBall.scale.set(0.5,0.5,0.5);
  scene.add(glowBall);

  this.update = function (time) {

  }

 }