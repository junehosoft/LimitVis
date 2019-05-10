/*global THREE*/

/****************************** SCENE GLOBAL VARS ******************************/
var sceneWidth;
var sceneHeight;
var camera;
var scene;
var renderer;
var dom;
var hero;
var key = [];
var newkey;
var sceneSubject;
var pointLight;
var lightOrb;
var door = [];
var fogDensity;
var nearFog;
var farFog;
var cube;
var glowBox;

/****************************** ROOM VARS *************************************/
var ground;
var backWall;
var leftWall;
var rightWall;
var frontWall; // front means facing player initially

var backDist = 200;
var leftDist = -250;
var rightDist = 250;
var frontDist = -200;

// obstacles in the game
var boxes = new Array();
var orbs = [];
var glows = [];
var collidableObjects = []; // An array of collidable objects used later
var NUMLIGHTORBS = 50;
var PLAYERCOLLISIONDIST = 20;
var PLAYERLIGHTDIST = 10;

/****************************** CONTROL VARS **********************************/
var blocker = document.getElementById('blocker');
//var orbitControl;

// control global variables
var player;
var controls;
var controlsEnabled = false;
// Flags to determine which direction the player is moving
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var clock;
// Velocity vector for the player
//var playerVelocity = new THREE.Vector3();

// How fast the player will move
//var PLAYERSPEED = 500.0;


var MOVESPEED = 30,
    LOOKSPEED = 0.075


init();

function init() {
  clock = new THREE.Clock();
  //listenForPlayerMovement();

	// set up the scene
	createScene();

	//call game loop
  getPointerLock();
  animate();

  //console.log("hello");
}

function createScene(){
	// 1. set up scene
  sceneWidth=window.innerWidth;
  sceneHeight=window.innerHeight;
  scene = new THREE.Scene();//the 3d scene
  // fogDensity = 0.01;
  // scene.fog = new THREE.FogExp2(0xf0fff0, fogDensity); //enable fog

  // 1.5. fog effect
  fogColor = new THREE.Color(0xfba500);
  scene.background = fogColor;
  farFog = 50;
  nearFog = 1;
  scene.fog = new THREE.Fog(fogColor, nearFog, farFog);

	// 2. camera
  camera = new THREE.PerspectiveCamera( 75, sceneWidth / sceneHeight, .4, 2000 );//perspective camera
  camera.position.y = 2;
  camera.position.z = 10;
  scene.add(camera);

	// 3. renderer
  renderer = new THREE.WebGLRenderer({alpha:true});//renderer with transparent backdrop
	renderer.setClearColor(0xcce0ff, 1); // enable fog (??)
	// renderer.setClearColor(scene.fog.color); // sets it to the grass color
  renderer.shadowMap.enabled = true;//enable shadow
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize( sceneWidth, sceneHeight );
  dom = document.getElementById('container');
	dom.appendChild(renderer.domElement);

  // setup player movement
  controls = new THREE.PlayerControls(camera, dom);
  scene.add(controls.getObject());

	// 4. lights
  pointLight = new THREE.PointLight( 0xeeef94, 5, 10);
  pointLight.visible = true;
  scene.add( pointLight );

  // setup time
  clock = new THREE.Clock();
  clock.start();

  // create the background
  sceneSubject = [new Background(scene), new Key(scene), new RandomCube(scene), new Obstacles(scene), new Door(scene)];
  // console.log("COLLIDABLE OBJECTS")
  // console.log(collidableObjects)
  for (let i = 0; i < NUMLIGHTORBS; i++)
    sceneSubject.push(new LightOrb(scene));

  // // different colors at face vertices create gradient effect
  // var cubeMaterial = new THREE.MeshBasicMaterial(
  //   { color: 0xffffff, vertexColors: THREE.VertexColors }
  // );

  // var color, face, numberOfSides, vertexIndex;

  // var faceIndices = ['a', 'b', 'c', 'd'];

  // // cube gradient trial
  // var size = 5;
  // var point;
  // var cubeGeometry = new THREE.CubeGeometry (size, size, size, 1, 1, 1,);
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
  //   side: THREE.BackSide,
  //   blending: THREE.AdditiveBlending,
  //   transparent: true
  // });

  // cube = new THREE.Mesh(cubeGeometry, customGlow);
  // cube.position.set(10,10,0);
  // scene.add(cube);

	//var helper = new THREE.CameraHelper( sun.shadow.camera );
	//scene.add( helper );// enable to see the light cone

	window.addEventListener('resize', onWindowResize, false);//resize callback
}

function animate(){
    //animate
    for (let i = 0; i < NUMLIGHTORBS; i++) {

      orbs[i].rotation.x += 0.01;
      orbs[i].rotation.y += 0.01;
      glows[i].rotation.x += 0.01;
      glows[i].rotation.y += 0.01;

    }


    pointLight.intensity -= 0.005;

    // if (farFog > nearFog) farFog -= 0.06; // COMMENT THIS BACK IN LATER
    scene.fog = new THREE.Fog(fogColor, nearFog, farFog);

    // fogCounter += 0.0005;
    // scene.fog = new THREE.FogExp2(0xf0fff0, fogCounter); //fog grows denser

    render();

    // keep requesting renderer
    requestAnimationFrame(animate);

    var delta = clock.getDelta();

    // update light position
    let currentPos = controls.getObject().position;
    pointLight.position.set(currentPos.x + 6, 5, currentPos.z + 6);
    if (pointLight.distance > 0.01)
      pointLight.distance -= 0.05*delta;

    // check if near light
    getLight();

    controls.animatePlayer(delta);
}

function render(){
  renderer.render(scene, camera);//draw
}

function onWindowResize() {
	//resize & align
	sceneHeight = window.innerHeight;
	sceneWidth = window.innerWidth;
	renderer.setSize(sceneWidth, sceneHeight);
	camera.aspect = sceneWidth/sceneHeight;
	camera.updateProjectionMatrix();
}

function getPointerLock() {
  document.onclick = function () {
    dom.requestPointerLock();
  }
  document.addEventListener('pointerlockchange', lockChange, false);
}

function lockChange() {
    // Turn on controls
    if (document.pointerLockElement === dom) {
        // Hide blocker and instructions
        blocker.style.display = "none";
        controls.enabled = true;
    // Turn off the controls
    } else {
      // Display the blocker and instruction
        blocker.style.display = "";
        controls.enabled = false;
    }
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function radiansToDegrees(radians) {
  return radians * 180 / Math.PI;
}

function getLight() {

  let currentPos = controls.getObject().position;

  for (let i = 0; i < orbs.length; i++) {
    let dist = new THREE.Vector3().subVectors(orbs[i].position, currentPos).length();
    if (dist < PLAYERLIGHTDIST) {
      console.log("GOT A LIGHT")
      // remove the object
      let childIndex = scene.children.indexOf(orbs[i]);
      scene.children.splice(childIndex, 1);
      orbs.splice(i, 1);
      NUMLIGHTORBS--;
      // scene.remove(scene.getObjectByName(orbs[i].name));
      pointLight.distance *= 1.005;
      pointLight.intensity += 0.05;
    }
  }


}

function detectPlayerDeath() {
  // console.log(pointLight.intensity)
  if (pointLight.intensity <= 0) {
    return true;
  }
  return false;
}

function detectPlayerCollision() {
  // rotation matrix to apply direction vector
  var rotationMat;

  // get direction of camera
  var cameraDirection = controls.getDirection(new THREE.Vector3()).clone();

  // check which direction we're moving
  if (moveBackward) {
    rotationMat = new THREE.Matrix4();
    rotationMat.makeRotationY(degreesToRadians(180));
  } else if (moveLeft) {
    rotationMat = new THREE.Matrix4();
    rotationMat.makeRotationY(degreesToRadians(90));
  } else if (moveRight) {
    rotationMat = new THREE.Matrix4();
    rotationMat.makeRotationY(degreesToRadians(270));
  }

  // player isn't moving forward, apply rotation matrix needed
  if (rotationMat !== undefined)
    cameraDirection.applyMatrix4(rotationMat);

  // apply ray to new player camera
  var rayCaster = new THREE.Raycaster(controls.getObject().position, cameraDirection);

  // if our ray hit a colidable object return true
  if (rayIntersect(rayCaster, PLAYERCOLLISIONDIST, collidableObjects))
    return true;
  else return false;

}

function detectDoorFound() {
  var rotationMat;

  // get direction of camera
  var cameraDirection = controls.getDirection(new THREE.Vector3()).clone();

  // check direction we're moving
  if (moveBackward) {
    rotationMat = new THREE.Matrix4();
    rotationmat.makeRotationY(degree(180));
  } else if (moveLeft) {
    rotationmat = new THREE.Matrix4();
    rotationMat.makeROtationY(degreesToRadians(90));
  } else if (moveRight) {
    rotationMat = new THREE.Matrix4();
    rotationmat.makeRotationY(degreesToRadians(270));
  }
  // player isn't moving forward, apply rotation matrix needed
  if (rotationMat !== undefined)
  cameraDirection.applyMatrix4(rotationMat);

  // apply ray to new player camera
  var rayCaster = new THREE.Raycaster(controls.getObject().position, cameraDirection);

  // if our ray hit a collidable object return true
  if (rayIntersect(rayCaster, PLAYERCOLLISIONDIST, door)) {
    console.log("a door was found");
    return true;
  }
  return false;


}

function detectKeyFound() {
  var rotationMat;

  // get direction of camera
  var cameraDirection = controls.getDirection(new THREE.Vector3()).clone();

  // check direction we're moving
  if (moveBackward) {
    rotationMat = new THREE.Matrix4();
    rotationmat.makeRotationY(degree(180));
  } else if (moveLeft) {
    rotationmat = new THREE.Matrix4();
    rotationMat.makeROtationY(degreesToRadians(90));
  } else if (moveRight) {
    rotationMat = new THREE.Matrix4();
    rotationmat.makeRotationY(degreesToRadians(270));
  }
  // player isn't moving forward, apply rotation matrix needed
  if (rotationMat !== undefined)
  cameraDirection.applyMatrix4(rotationMat);

  // apply ray to new player camera
  var rayCaster = new THREE.Raycaster(controls.getObject().position, cameraDirection);

  // if our ray hit a collidable object return true
  if (rayIntersect(rayCaster, PLAYERCOLLISIONDIST, key)) {
    console.log("a key was found");
    return true;
  }
  return false;


}


function rayIntersect(ray, distance, objects) {
    if (Array.isArray(objects)) {
      var intersects = ray.intersectObjects(objects);
      for (var i = 0; i < intersects.length; i++) {
          // Check if there's a collision
          if (intersects[i].distance < distance) {
              return true;
          }
      }
    } else {
      var intersect = ray.intersectObject(objects);
      if (intersect.distance < distance) {
        return true;
      }
    }
    return false;
}
