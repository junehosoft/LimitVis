/*global THREE*/

var sceneWidth;
var sceneHeight;
var camera;
var scene;
var renderer;
var dom;
var hero;
var sun;
var ground;
var orbitControl;

init();
function init() {
	// set up the scene
	createScene();

	//call game loop
  update();

  console.log("hello");
}

function createScene(){
	// 1. set up scene
  sceneWidth=window.innerWidth;
  sceneHeight=window.innerHeight;
  scene = new THREE.Scene();//the 3d scene
  scene.fog = new THREE.Fog(0x00ff00, 50, 800); //enable fog

	// 2. camera
  camera = new THREE.PerspectiveCamera( 60, sceneWidth / sceneHeight, 0.1, 1000 );//perspective camera
	camera.position.y = 4;
	camera.position.z = 15;
	scene.add(camera);

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

	//Set up shadow properties for the sun light
	sun.shadow.mapSize.width = 256;
	sun.shadow.mapSize.height = 256;
	sun.shadow.camera.near = 0.5;
	sun.shadow.camera.far = 50 ;
	scene.add(sun);

	//add items to scene
	var heroGeometry = new THREE.BoxGeometry( 1, 1, 1 );//cube
	var heroMaterial = new THREE.MeshStandardMaterial( { color: 0x883333 } );
	hero = new THREE.Mesh( heroGeometry, heroMaterial );
	hero.castShadow=true;
	hero.receiveShadow=false;
	hero.position.y=2;
	scene.add( hero );

	var planeGeometry = new THREE.PlaneGeometry( 5, 5, 4, 4 );
	var planeMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } )

	ground = new THREE.Mesh( planeGeometry, planeMaterial );
	ground.receiveShadow = true;
	ground.castShadow=false;
	ground.rotation.x=-Math.PI/2;
	scene.add( ground );

	orbitControl = new THREE.OrbitControls( camera, renderer.domElement );//helper to rotate around in scene
	orbitControl.addEventListener( 'change', render );
	//orbitControl.enableDamping = true;
	//orbitControl.dampingFactor = 0.8;
	orbitControl.enableZoom = true;

	//var helper = new THREE.CameraHelper( sun.shadow.camera );
	//scene.add( helper );// enable to see the light cone

	window.addEventListener('resize', onWindowResize, false);//resize callback
}

function update(){
  //animate
  hero.rotation.x += 0.01;
  hero.rotation.y += 0.01;
  render();
	requestAnimationFrame(update); //request next update
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
