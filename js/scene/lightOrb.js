 function LightOrb (scene) {
 
    // different colors at face vertices create gradient effect
    var cubeMaterial = new THREE.MeshBasicMaterial(
      { color: 0xffffff, vertexColors: THREE.VertexColors }
    );
  
    // var color, face, numberOfSides, vertexIndex;
  
    // var faceIndices = ['a', 'b', 'c', 'd'];
  
    // cube gradient trial
    var size = 5;
    // var point;
    var cubeGeometry = new THREE.CubeGeometry (size, size, size, 1, 1, 1,);
    // for (var i = 0; i < cubeGeometry.faces.length; i++) {
    //   face = cubeGeometry.faces[i];
    //   // determine if current face is triangle or rectangle
    //   numberOfSides = (face instanceof THREE.Face3) ? 3 : 4;
    //   // assign color to each vertex of current face
    //   for (var j = 0; j < numberOfSides; j++) {
    //     vertexIndex = face[faceIndices[j]];
    //     // store coordinates of vertex
    //     point = cubeGeometry.vertices[vertexIndex];
    //     // initialize color variable
    //     color = new THREE.Color(0xffffff);
    //     color.setRGB(0.5 + point.x / size, 0.5 + point.y / size, 0.5 + point.z / size);
    //     face.vertexColors[j] = color;
    //   }
    // }
  
    // var customGlow = new THREE.ShaderMaterial({
    //   uniforms: {},
    //   vertexShader: document.getElementById('vertexShader').textContent,
    //   fragmentShader: document.getElementById('fragmentShader').textContent,
    //   side: THREE.FrontSide,
    //   blending: THREE.AdditiveBlending,
    //   transparent: true
    // });

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
        // transparent: true
      }
    );

    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0,3,0);
    cube.scale.set(0.3,0.3,0.3)
    scene.add(cube);

    // now let's add glow effect
    var glowCube = new THREE.CubeGeometry(size, size, size, 1,1,1);
    glowBox = new THREE.Mesh(glowCube, customMaterial.clone());

    glowBox.position.set(0,3,0);
    glowBox.scale.set(0.35,0.35,0.35);
    scene.add(glowBox);
  

  // // light orbs
  // var sphereLight = new THREE.SphereGeometry(1,10,10);
  // var lightOrbMaterial = new THREE.MeshBasicMaterial(
  //   { color: 0xffffff, shininess: 200 }
  // );

  // lightOrb = new THREE.Mesh(sphereLight, lightOrbMaterial);
  // lightOrb.position.set(2.0,2.0,2.0);
  // lightOrb.receiveShadow = false;
  // // lightOrb.castShadow = true;
  // lightOrb.scale.set(0.5,0.5,0.5);
  // scene.add(lightOrb);

  // // now let's make them glow?
  // var customGlow = new THREE.ShaderMaterial({
  //   uniforms: {},
  //   vertexShader: document.getElementById('vertexShader').textContent,
  //   fragmentShader: document.getElementById('fragmentShader').textContent,
  //   side: THREE.BackSide,
  //   blending: THREE.AdditiveBlending,
  //   transparent: true
  // });

  // var glowSphere = new THREE.SphereGeometry(2, 20, 20);
  // var glowBall = new THREE.Mesh(glowSphere, customGlow);
  // glowBall.position.set(2.0,2.0,2.0);
  // glowBall.scale.set(0.5,0.5,0.5);
  // scene.add(glowBall);

  this.update = function (time) {

  }

 }