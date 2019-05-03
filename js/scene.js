/*global THREE*/

var sceneWidth;
var sceneHeight;
var camera;
var scene;
var renderer;
var dom;
var hero;
var sun;
var key;

// room boundaries
var ground;
var backWall;
var leftWall;
var rightWall;
var frontWall; // front means facing player initially

var backDist = 200;
var leftDist = -250;
var rightDist = 250;
var frontDist = -200;
//var orbitControl;
var player;
var controls;
var clock;
var velocity = new THREE.Vector3();

// obstacles in the game
var tube;
var ring;
var lathe;
var boxes = new Array();

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
  //console.log(camera.position);

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

	// add items to scene (this is the rotating box)
	// var heroGeometry = new THREE.BoxGeometry( 1, 1, 1 );//cube
	// var heroMaterial = new THREE.MeshStandardMaterial( { color: 0x883333 } );
	// hero = new THREE.Mesh( heroGeometry, heroMaterial );
	// hero.castShadow=true;
	// hero.receiveShadow=false;
	// hero.position.y=2;
	// scene.add( hero );
  const sceneSubject = [new Background(scene)];

  // key
  let loader = new THREE.STLLoader();
  loader.load('Key.stl', function (geometry) {
    let material = new THREE.MeshPhongMaterial(
      { color: 0x63e7ff, specular: 0xcefdff, shininess: 200 } );
    key = new THREE.Mesh(geometry, material);

    key.position.set(0,2,0);
    key.rotation.set(0,0,0);
    key.scale.set(1,1,1);

    key.castShadow = true;
    key.receiveShadow = true;

    scene.add(key);

  });

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


  // add in objects/obstacles
  function CustomSinCurve( scale ) {
  	THREE.Curve.call( this );
  	this.scale = ( scale === undefined ) ? 1 : scale;
  }

  CustomSinCurve.prototype = Object.create( THREE.Curve.prototype );
  CustomSinCurve.prototype.constructor = CustomSinCurve;

  CustomSinCurve.prototype.getPoint = function ( t ) {

  	var tx = t * 3 - 1.5;
  	var ty = Math.sin( 2 * Math.PI * t );
  	var tz = 0;
  	return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );
  };

  var path = new CustomSinCurve(10);
  var tubeGeometry = new THREE.TubeGeometry( path, 50, 5, 8, false );
  var tubeMat = new THREE.MeshBasicMaterial( { color: 0x3044c9 } );
  var tube = new THREE.Mesh( tubeGeometry, tubeMat );
  tube.rotation.x = -Math.PI/2;
  tube.position.y = 0;
  tube.position.z = -75;
  scene.add(tube);

  var points = [];
  for ( var i = 0; i < 10; i ++ ) {
  	points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
  }
  var latheGeometry = new THREE.LatheGeometry( points );
  var latheMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  lathe = new THREE.Mesh(latheGeometry, latheMaterial );
  lathe.rotation.x = -Math.PI;
  lathe.position.z = 100;
  lathe.position.x = 80;
  scene.add( lathe );

  // add in torus later

  // random cubes
  console.log(boxes)
  for (let i = 0; i < 5; i++) {
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
    console.log(boxes)


  }


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
    // hero.rotation.x += 0.01;
    // hero.rotation.y += 0.01;

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

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
