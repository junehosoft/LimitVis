/*global THREE*/

/****************************** SCENE GLOBAL VARS ******************************/
var sceneWidth;
var sceneHeight;
var camera;
var scene;
var renderer;
var dom;
var hero;
var sun;
var key;
var sceneSubject;
var lightOrb;

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
var collidableObjects = []; // An array of collidable objects used later
var PLAYERCOLLISIONDIST = 5;
var EPS = 0.1;

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
  // scene.fog = new THREE.FogExp2(0xf0fff0, 0.14); //enable fog

	// 2. camera
  camera = new THREE.PerspectiveCamera( 60, sceneWidth / sceneHeight, 1, 2000 );//perspective camera
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
	var hemisphereLight = new THREE.HemisphereLight(0xfffafa,0x000000, .9)
	scene.add(hemisphereLight);
	sun = new THREE.DirectionalLight( 0xffffff, 0.8);
	sun.position.set( 0,4,1 );
	sun.castShadow = true;

  // setup time
  clock = new THREE.Clock();
  clock.start();

	//Set up shadow properties for the sun light
	sun.shadow.mapSize.width = 256;
	sun.shadow.mapSize.height = 256;
	sun.shadow.camera.near = 0.5;
	sun.shadow.camera.far = 50 ;
	scene.add(sun);

  // create the scene 
  sceneSubject = [new Background(scene), new Key(scene), new Obstacles(scene)];
  for (let i = 0; i < 7; i++) {
    sceneSubject.push(new RandomCube(scene));
  }

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

  // different colors at face vertices create gradient effect
  var cubeMaterial = new THREE.MeshBasicMaterial(
    { color: 0xffffff, vertexColors: THREE.VertexColors }
  );

  var color, face, numberOfSides, vertexIndex;

  var faceIndices = ['a', 'b', 'c', 'd'];

  // cube gradient trial
  var size = 5;
  var point;
  var cubeGeometry = new THREE.CubeGeometry (size, size, size, 1, 1, 1,);
  for (var i = 0; i < cubeGeometry.faces.length; i++) {
    face = cubeGeometry.faces[i];
    // determine if current face is triangle or rectangle
    numberOfSides = (face instanceof THREE.Face3) ? 3 : 4;
    // assign color to each vertex of current face
    for (var j = 0; j < numberOfSides; j++) {
      vertexIndex = face[faceIndices[j]];
      // store coordinates of vertex
      point = cubeGeometry.vertices[vertexIndex];
      // initialize color variable
      color = new THREE.Color(0xffffff);
      color.setRGB(0.5 + point.x / size, 0.5 + point.y / size, 0.5 + point.z / size);
      face.vertexColors[j] = color;
    }
  }
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(10,10,0);
  scene.add(cube);

	//var helper = new THREE.CameraHelper( sun.shadow.camera );
	//scene.add( helper );// enable to see the light cone

	window.addEventListener('resize', onWindowResize, false);//resize callback
}

function animate(){
    //animate
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    render();

    // keep requesting renderer
    requestAnimationFrame(animate);

    var delta = clock.getDelta();
    controls.animatePlayer(delta);

    // console.log(controls.getObject().position)
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

/* This code was adapted from
https://docs.microsoft.com/en-us/windows/uwp/get-started/get-started-tutorial-game-js3d
*/

function rayIntersect(ray, distance) {
  var close = [];
  var intersects = ray.intersectObjects(collidableObjects);
  for (var i = 0; i < intersects.length; i++) {
    // If there's a collision, push into close
    if (intersects[i].distance < distance) {
      console.log(i);
      close.push[intersects[i]];
    }
  }
  if (close.length > 0)
    console.log("close", close.length);
  return close;
}
