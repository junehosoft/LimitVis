/*global THREE*/

/****************************** SCENE GLOBAL VARS ******************************/
var sceneWidth;
var sceneHeight;
var camera;
var scene;
var renderer;
var dom;
var light;
var key;
var sceneSubject;
var lightOrb;
var door;
var fogDensity;
var nearFog;
var farFog;
var cube;
var glowBox;
var flashlight; 
var flashlightRad;
var circleGeo; // geometry for flashlightRad
var circleMat;
var foundKey = false;
var doorFound = false;
var firstTimeDoor = true;
var firstTimeKey = true;

/****************************** FLAGS *****************************************/
var random = false;
var DEBUG = false;

/****************************** ROOM VARS *************************************/
var ground;
var backWall;
var leftWall;
var rightWall;
var frontWall; // front means facing player initially

var backDist = 200;
var leftDist = -200;
var rightDist = 200;
var frontDist = -200;

// obstacles in the game
var boxes = [];
var orbs = [];
var glows = [];
var collidableObjects = []; // An array of collidable objects used later
var NUMLIGHTORBS = 50;
var PLAYERCOLLISIONDIST = 5;
var PLAYERLIGHTDIST = 7;
var PLAYERDOORDIST = 8;

/****************************** CONTROL VARS **********************************/
var blocker = document.getElementById('blocker');
var endgameAlert = document.getElementById('endgameAlert');
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


var MOVESPEED = 30,
    LOOKSPEED = 0.075

getPointerLock();
init();

function init() {
  clock = new THREE.Clock();
  //listenForPlayerMovement();

	// set up the scene
	createScene();

	//call game loop
  getPointerLock();
  document.onclick = function () {
    animate();
  }

  //console.log("hello");
}

function createScene(){
	// 1. set up scene
  sceneWidth=window.innerWidth;
  sceneHeight=window.innerHeight;
  scene = new THREE.Scene();//the 3d scene
  fogDensity = 0.009;
  if (DEBUG == false)
    scene.fog = new THREE.FogExp2(0xe2c06f, fogDensity); //enable fog
  scene.background = new THREE.Color(0xe2c06f);

  // 1.5. fog effect
  // fogColor = new THREE.Color(0xfba500);
  // scene.background = fogColor;
  // farFog = 50;
  // nearFog = 1;
  // scene.fog = new THREE.Fog(fogColor, nearFog, farFog);

	// 2. camera
  camera = new THREE.PerspectiveCamera( 75, sceneWidth / sceneHeight, .4, 2000 );//perspective camera
  camera.position.y = 2;
  camera.position.z = 0;
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
  if (DEBUG == true) {
    console.log("test")
    scene.add(new THREE.AmbientLight(0x666666));
    light = new THREE.DirectionalLight(0xe3e8f2, 1.75);
    light.position.set(50, 200, 100);
    light.position.multiplyScalar(1.3);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    let d = 300;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;
    light.shadow.camera.far = 1000;
    scene.add(light);
  }
  // testing for ambient light
  scene.add(new THREE.AmbientLight(0x8e8b8b));
  scene.add(new THREE.DirectionalLight(0x8f939b, 1.75));
  
  flashlight = new THREE.PointLight(0xffffff, 10, 10);
  flashlight.position.set(0, 0, 0);
  flashlight.visible = true;
  scene.add(flashlight);

  // radius of flashlight circle 
  circleGeo = new THREE.CircleGeometry(flashlight.distance*0.6, 64, 3);
  circleGeo.vertices.shift();
  circleMat = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 1,});
  flashlightRad = new THREE.LineLoop(circleGeo, circleMat);
  flashlightRad.rotation.x = -Math.PI/2;
  scene.add(flashlightRad);

  // setup time
  clock = new THREE.Clock();
  clock.start();

  // create the background
  sceneSubject = [new Background(scene), new Key(scene), new Door(scene)];
  if (random) {
    for (let i = 0; i < 15; i++) 
      sceneSubject.push(new Cube(scene));
  } else {
    let dimensions = new THREE.Vector3(30, 100, 30);
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (i == 5 && j == 5)
          continue;
        let position = new THREE.Vector3(i * 50 - 250, 0, j * 50 - 250);
        sceneSubject.push(new Cube(scene, dimensions, position));
      }
    }
  }
  for (let i = 0; i < NUMLIGHTORBS; i++)
    sceneSubject.push(new LightOrb(scene));
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

    // get the key to spin or bounce
    if (scene.children.indexOf(key) >= 0) {
      key.rotation.y += 0.01;
    }

    // pointLight.intensity -= 0.005;

    // if (farFog > nearFog) farFog -= 0.06; // COMMENT THIS BACK IN LATER
    // scene.fog = new THREE.Fog(fogColor, nearFog, farFog);
    if (DEBUG == false) {
      fogDensity += 0.00004;
      scene.fog = new THREE.FogExp2(0xe2c06f, fogDensity); //fog grows denser
    }

    render();

    // keep requesting renderer
    requestAnimationFrame(animate);
    var delta = clock.getDelta();

    // update light position
    let currentPos = controls.getObject().position;
    circleGeo = new THREE.CircleGeometry(flashlight.distance*0.6, 64, 3);
    circleGeo.vertices.shift();
    flashlightRad.geometry = circleGeo;
    flashlight.position.set(currentPos.x, 6, currentPos.z);
    flashlightRad.position.set(currentPos.x, 0.1, currentPos.z);
    if (flashlight.distance > 0.01) 
      flashlight.distance -= 0.4*delta;
    if (flashlight.intensity > 1.01)
      flashlight.intensity -= 0.4*delta;

    

    // check if near light
    getLight();

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

function getLight() {

  let currentPos = controls.getObject().position;

  for (let i = 0; i < orbs.length; i++) {
    let dist = new THREE.Vector3().subVectors(orbs[i].position, currentPos).length();
    if (dist < PLAYERCOLLISIONDIST) {
      console.log("GOT A LIGHT")
      // remove the object
      let orbIndex = scene.children.indexOf(orbs[i]);
      scene.children.splice(orbIndex, 1);
      orbs.splice(i, 1);

      let glowIndex = scene.children.indexOf(glows[i]);
      scene.children.splice(glowIndex, 1);
      glows.splice(i, 1);
      NUMLIGHTORBS--;

      flashlight.distance *= 1.15;
      circleGeo.radius *= 1.05;
      flashlight.intensity += 0.5;
      if (fogDensity >= 0.008) {
        fogDensity -= 0.008;
      } else {
        fogDensity = 0;
      }
      scene.fog = new THREE.FogExp2(fogDensity);

    }
  }
}

var fade_out = function() {
  instructions.innerHTML = ""; 
}

function detectPlayerDeath() {
  if (flashlight.distance < 0.5 || flashlight.intensity < 1.0)
    return true;
  return false;
}

function endGame() {
    blocker.style.display = '';
    instructions.innerHTML = "GAME OVER </br></br></br> Press CTRL + R to restart";
    gameOver = true;
    instructions.style.display = '';
    endgameAlert.style.display = 'none';
}

function wonGame() {
    blocker.style.display = '';
    instructions.innerHTML = "CONGRATULATIONS, YOU ESCAPED </br></br></br> Press CTRL + R to restart";
    gameOver = true;
    instructions.style.display = '';
    endgameAlert.style.display = 'none';
}

function gotKey() {
  blocker.style.display = '';
  instructions.innerHTML = "YOU FOUND THE KEY! FIND THE DOOR BEFORE YOUR LIGHT RUNS OUT.";
  gameOver = false;
  instructions.style.display = '';
  endgameAlert.style.display = 'none';
  
  setTimeout(fade_out, 3000);
}

function gotDoor() {
  blocker.style.display = '';
  instructions.innerHTML = "YOU CANNOT EXIT BEFORE YOU FIND THE KEY THAT UNLOCKS THIS DOOR.";
  gameOver = false;
  instructions.style.display = '';
  endgameAlert.style.display = 'none';
  
  setTimeout(fade_out, 3000);
}


/* This code was adapted from
https://docs.microsoft.com/en-us/windows/uwp/get-started/get-started-tutorial-game-js3d
*/

function rayIntersect(ray, distance, objects) {
  var close = [];
  //console.log(distance);
  if (Array.isArray(objects)) {
    var intersects = ray.intersectObjects(objects);
    for (var i = 0; i < intersects.length; i++) {
      // If there's a collision, push into close
      if (intersects[i].distance < distance) {
        //console.log(intersects[i].distance);
        close.push(intersects[i]);
      }
    }
  }
  else {
    var intersect = ray.intersectObject(objects);
      if (intersect.distance < distance) {
        close.push(intersect);
    }
  }
  //if (close.length > 0)
    //console.log("close", close.length);
  return close;
}
