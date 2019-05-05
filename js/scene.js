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
var tube;
var ring;
var lathe;
var boxes = new Array();

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
var playerVelocity = new THREE.Vector3();

// How fast the player will move
var PLAYERSPEED = 500.0;


var MOVESPEED = 30,
    LOOKSPEED = 0.075


init();

function init() {
  clock = new THREE.Clock();
  listenForPlayerMovement();

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

	// 2. camera aka player
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
  controls = new THREE.PointerLockControls(camera, dom);
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

	// add items to scene (this is the rotating box)
	// var heroGeometry = new THREE.BoxGeometry( 1, 1, 1 );//cube
	// var heroMaterial = new THREE.MeshStandardMaterial( { color: 0x883333 } );
	// hero = new THREE.Mesh( heroGeometry, heroMaterial );
	// hero.castShadow=true;
	// hero.receiveShadow=false;
	// hero.position.y=2;
	// scene.add( hero );

  // create the background
  sceneSubject = [new Background(scene), new Key(scene), new RandomCube(scene), new Obstacles(scene)];

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

  // OLD ORBITCONTROLS, NO LONGER USED
	// orbitControl = new THREE.OrbitControls( camera, renderer.domElement );//helper to rotate around in scene
	// orbitControl.addEventListener( 'change', render );
	// orbitControl.enableDamping = true;
	// orbitControl.dampingFactor = 0.8;
	// orbitControl.enableZoom = true;

	//var helper = new THREE.CameraHelper( sun.shadow.camera );
	//scene.add( helper );// enable to see the light cone

	window.addEventListener('resize', onWindowResize, false);//resize callback
}

function animate(){
    //animate
    // hero.rotation.x += 0.01;
    // hero.rotation.y += 0.01;

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    render();

    // keep requesting renderer
    requestAnimationFrame(animate);

    var delta = clock.getDelta();
    animatePlayer(delta);
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

function listenForPlayerMovement() {

    // A key has been pressed
    var onKeyDown = function(event) {

    switch (event.keyCode) {

      case 38: // up
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true;
        break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;
    }
  };

  // A key has been released
    var onKeyUp = function(event) {

    switch (event.keyCode) {

      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;
    }
  };

  // Add event listeners for when movement keys are pressed and released
  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
}

function animatePlayer(delta) {
  // Gradual slowdown
  playerVelocity.x -= playerVelocity.x * 10.0 * delta;
  playerVelocity.z -= playerVelocity.z * 10.0 * delta;

  if (moveForward) {
    playerVelocity.z -= PLAYERSPEED * delta;
  }
  if (moveBackward) {
    playerVelocity.z += PLAYERSPEED * delta;
  }
  if (moveLeft) {
    playerVelocity.x -= PLAYERSPEED * delta;
  }
  if (moveRight) {
    playerVelocity.x += PLAYERSPEED * delta;
  }
  if( !( moveForward || moveBackward || moveLeft ||moveRight)) {
    // No movement key being pressed. Stop movememnt
    playerVelocity.x = 0;
    playerVelocity.z = 0;
  }
  controls.getObject().translateX(playerVelocity.x * delta);
  controls.getObject().translateZ(playerVelocity.z * delta);
}
