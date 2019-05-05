// initializes the player
THREE.PlayerControls = function(camera, domElement) {
	console.log(domElement)
	var scope = this;
	console.log(scope)

  this.position = new THREE.Vector3();
  this.velocity = new THREE.Vector3();

  this.domElement = ( domElement !== undefined ) ? domElement : document;

  this.position.x = camera.position.x;
  this.position.y = camera.position.y;
  this.position.z = camera.position.z;

  // The four arrow keys
	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

	// Mouse buttons
  this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };

	var euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		euler.setFromQuaternion( camera.quaternion );

		euler.y -= movementX * 0.002;
		euler.x -= movementY * 0.002;

		euler.x = Math.max( - PI_2, Math.min( PI_2, euler.x ) );

		camera.quaternion.setFromEuler( euler );
	};

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;

	var onKeyDown = function ( event ) {
		switch ( event.keyCode ) {
			case scope.keys.UP: // up
			case 87: // w
				scope.moveForward = true;
				break;
			case scope.keys.LEFT: // left
			case 65: // a
				scope.moveLeft = true;
				break;
			case scope.keys.DOWN: // down
			case 83: // s
				scope.moveBackward = true;
				break;
			case scope.keys.RIGHT: // right
			case 68: // d
				scope.moveRight = true;
				break;
		}
	};

	var onKeyUp = function ( event ) {
		switch( event.keyCode ) {
			case 38: // up
			case 87: // w
				scope.moveForward = false;
				break;
			case 37: // left
			case 65: // a
				scope.moveLeft = false;
				break;
			case 40: // down
			case 83: // s
				scope.moveBackward = false;
				break;
			case 39: // right
			case 68: // d
				scope.moveRight = false;
				break;
		}
	};

	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	var havePointerLock = 'pointerLockElement' in document ||
	 											'mozPointerLockElement' in document ||
	  										'webkitPointerLockElement' in document;

	if ( havePointerLock ) {
		var element = document.body;
		var pointerlockchange = function ( event ) {
			if ( document.pointerLockElement === element ||
						document.mozPointerLockElement === element ||
						document.webkitPointerLockElement === element ) {
				scope.controlsEnabled = true;
				document.addEventListener( 'mousemove', onMouseMove, false );
			} else {
				scope.controlsEnabled = false;
			}
		};
		var pointerlockerror = function ( event ) {
			//There was an error
		};
		// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

	} else {
		document.body.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
	}

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, - 1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		};

	}();

	//var newDiv = document.createElement("div");
	//newDiv.innerHTML = "Click to play";
	//document.body.appendChild (newDiv);
	document.body.addEventListener("click", function() {
		var element = document.body;
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
		element.requestPointerLock();
	});
};
