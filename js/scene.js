/*global THREE*/

var sceneWidth;
var sceneHeight;
var camera;
var scene;
var renderer;
var dom;
var hero;
var sun;

// room objects
var ground;
var backWall;
var leftWall;
var rightWall;
var frontWall; // front means facing player initially
//var orbitControl;
var player;
var controls;
var clock;
var velocity = new THREE.Vector3();

var MOVESPEED = 30,
    LOOKSPEED = 0.075

init();

function init() {
	// set up the scene
	createScene();

	//call game loop
  update();

  //console.log("hello");
}

function createScene(){
	// 1. set up scene
  sceneWidth=window.innerWidth;
  sceneHeight=window.innerHeight;
  scene = new THREE.Scene();//the 3d scene
  // scene.fog = new THREE.FogExp2(0xf0fff0, 0.14); //enable fog

	// 2. camera aka player
  camera = new THREE.PerspectiveCamera( 60, sceneWidth / sceneHeight, 0.1, 1000 );//perspective camera
  camera.position.y = 2;
  camera.position.z = 10;
  scene.add(camera);

  // setup player movement
  // controls = new THREE.PlayerControls(camera);
  //controls.movementSpeed = MOVESPEED;
  //controls.lookSpeed= LOOKSPEED;
  //controls.lookVertical = false;
  //controls.noFly = true;
  //controls.activeLook = false;
  //document.onkeydown = handleKeyDown;
  console.log(camera.position);

	// 3. renderer
  renderer = new THREE.WebGLRenderer({alpha:true});//renderer with transparent backdrop
	renderer.setClearColor(0xcce0ff, 1); // enable fog (??)
	// renderer.setClearColor(scene.fog.color); // sets it to the grass color
  renderer.shadowMap.enabled = true;//enable shadow
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize( sceneWidth, sceneHeight );
  dom = document.getElementById('TutContainer');
	dom.appendChild(renderer.domElement);

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

	// add items to scene
	var heroGeometry = new THREE.BoxGeometry( 1, 1, 1 );//cube
	var heroMaterial = new THREE.MeshStandardMaterial( { color: 0x883333 } );
	hero = new THREE.Mesh( heroGeometry, heroMaterial );
	hero.castShadow=true;
	hero.receiveShadow=false;
	hero.position.y=2;
	scene.add( hero );

	var planeGeometry = new THREE.PlaneGeometry(1000, 1000, 4);
	var planeMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
	ground = new THREE.Mesh( planeGeometry, planeMaterial );
	ground.receiveShadow = true;
	ground.castShadow = false;
	ground.rotation.x = -Math.PI/2;
  console.log("ground pos")
  console.log(ground.position.y)
  scene.add(ground);
  console.log(ground)


  // set up back wall
  var wallGeometry = new THREE.PlaneGeometry(600, 600);
  var wallMaterial = new THREE.MeshStandardMaterial({color: 0xdfaff7 });
  backWall = new THREE.Mesh(wallGeometry, wallMaterial);
  backWall.rotation.y = Math.PI;
  backWall.recieveShadow = true;
  backWall.castShadow = true;
  backWall.position.y = 50;
  backWall.position.z = 200;
  scene.add(backWall);

  // right wall
  rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
  rightWall.recieveShadow = true;
  rightWall.castShadow = true;
  rightWall.rotation.y = -Math.PI/2;
  rightWall.position.x = 250;
  rightWall.position.y = 50;
  scene.add(rightWall);

  // left wall
  leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
  leftWall.recieveShadow = true;
  leftWall.castShadow = true;
  leftWall.rotation.y = Math.PI/2;
  leftWall.position.x = -250;
  leftWall.position.y = 50;
  scene.add(leftWall);

  // front wall
  frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
  frontWall.recieveShadow = true;
  frontWall.castShadow = true;
  frontWall.position.y = 50;
  frontWall.position.z = -200;
  scene.add(frontWall);



	orbitControl = new THREE.OrbitControls( camera, renderer.domElement );//helper to rotate around in scene
	orbitControl.addEventListener( 'change', render );
	orbitControl.enableDamping = true;
	orbitControl.dampingFactor = 0.8;
	orbitControl.enableZoom = true;

	//var helper = new THREE.CameraHelper( sun.shadow.camera );
	//scene.add( helper );// enable to see the light cone

	window.addEventListener('resize', onWindowResize, false);//resize callback
}

function update(){
    //animate
    hero.rotation.x += 0.01;
    hero.rotation.y += 0.01;
    //var delta = clock.getDelta();
    //controls.update(delta); // Move camera
    //playerControls();
    render();
    requestAnimationFrame(update); //request next update
    //console.log(camera.position);
}

function playerControls() {
    // Are the controls enabled? (Does the browser have pointer lock?)
    if ( controls.controlsEnabled ) {

        // Save the current time
        var time = performance.now();
        // Create a delta value based on current time
        var delta = clock.getDelta();

        // Set the velocity.x and velocity.z using the calculated time delta
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        // As velocity.y is our "gravity," calculate delta
        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        if ( controls.moveForward ) {
            velocity.z -= 400.0 * delta;
        }

        if ( controls.moveBackward ) {
            velocity.z += 400.0 * delta;
        }

        if ( controls.moveLeft ) {
            velocity.x -= 400.0 * delta;
        }

        if ( controls.moveRight ) {
            velocity.x += 400.0 * delta;
        }

        // Update the position using the changed delta
        controls.getObject().translateX( velocity.x * delta );
        controls.getObject().translateY( velocity.y * delta );
        controls.getObject().translateZ( velocity.z * delta );

        // Prevent the camera/player from falling out of the 'world'
        if ( controls.getObject().position.y < 10 ) {

            velocity.y = 0;
            controls.getObject().position.y = 10;

        }

        // Save the time for future delta calculations
        prevTime = time;

    }
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

function handleKeyDown(keyEvent){

}
