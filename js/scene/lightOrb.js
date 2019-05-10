 function LightOrb (scene) {
 
    // middle cube
    var cubeMaterial = new THREE.MeshBasicMaterial(
      { color: 0xffffff, vertexColors: THREE.VertexColors }
    );
    var size = 5;

    var cubeGeometry = new THREE.CubeGeometry (size, size, size, 1, 1, 1,);
    var customMaterial = new THREE.ShaderMaterial(
      {
        uniforms:
        {
          "c": {type: "f", value: .2},
          "p": {type: "f", value: 1.0},
          glowColor: {type: "c", value: new THREE.Color(0xffff00)},
          viewVector: {type: "v3", value: camera.position}
        },
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      }
    );

    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = Math.random()*400-200;
    cube.position.y = 2;
    cube.position.z = Math.random()*400-200;
    cube.receiveShadow = false;
    cube.scale.set(0.3,0.3,0.3)
    orbs.push(cube);
    scene.add(cube);

    // now let's add glow effect
    var glowCube = new THREE.CubeGeometry(size, size, size, 1,1,1);
    glowBox = new THREE.Mesh(glowCube, customMaterial.clone());
    glowBox.position.x = cube.position.x;
    glowBox.position.y = cube.position.y;
    glowBox.position.z = cube.position.z;
    glowBox.receiveShadow = false;
    glowBox.scale.set(0.35,0.35,0.35);
    glows.push(glowBox);
    scene.add(glowBox);

  this.update = function (time) {

  }

 }