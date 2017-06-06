window.ARThreeOnLoad = function() {

	ARController.getUserMediaThreeScene({maxARVideoSize: 320, cameraParam: 'Data/camera_para-iPhone 5 rear 640x480 1.0m.dat', 
	onSuccess: function(arScene, arController, arCamera) {

		document.body.className = arController.orientation;

		arController.setPatternDetectionMode(artoolkit.AR_MATRIX_CODE_DETECTION);

		var clock = new THREE.Clock();

		var renderer = new THREE.WebGLRenderer({antialias: true});
		if (arController.orientation === 'portrait') {
			var w = (window.innerWidth / arController.videoHeight) * arController.videoWidth;
			var h = window.innerWidth;
			renderer.setSize(w, h);
			renderer.domElement.style.paddingBottom = (w-h) + 'px';
		} else {
			if (/Android|mobile|iPad|iPhone/i.test(navigator.userAgent)) {
				renderer.setSize(window.innerWidth, (window.innerWidth / arController.videoWidth) * arController.videoHeight);
			} else {
				renderer.setSize(arController.videoWidth, arController.videoHeight);
				document.body.className += ' desktop';
			}
		}
		document.body.insertBefore(renderer.domElement, document.body.firstChild);

		var markerRoot = arController.createThreeBarcodeMarker(20);

		arScene.scene.add(markerRoot);

		// outline

		var effect = new THREE.OutlineEffect(renderer);

		// this is a trick to draw outline correctly(?)
		arScene.camera.projectionMatrix.elements[15] = 0.001;

		// light

		var ambient = new THREE.AmbientLight( 0x666666 );
		arScene.scene.add( ambient );

		var directionalLight = new THREE.DirectionalLight( 0x887766 );
		directionalLight.position.set( -1, 1, 1 ).normalize();
		arScene.scene.add( directionalLight );

		// model, dance, audio

		var modelFile = 'https://rawgit.com/mrdoob/three.js/dev/examples/models/mmd/miku/miku_v2.pmd';
		var vmdFiles = ['https://rawgit.com/mrdoob/three.js/dev/examples/models/mmd/vmds/wavefile_v2.vmd'];
		var audioFile = 'https://rawgit.com/mrdoob/three.js/dev/examples/models/mmd/audios/wavefile_short.mp3';
		var audioParams = {delayTime: 160 * 1 / 30};

		var onProgress = function(xhr) {
			if (xhr.lengthComputable) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				console.log( Math.round(percentComplete, 2) + '% downloaded' );
			}
		};

		var onError = function(xhr) {
			console.error(xhr);
		};

		var helper = new THREE.MMDHelper();

		var loader = new THREE.MMDLoader();
		loader.setTextureCrossOrigin('anonymous');

		var ready = false;

		var mesh;

		loader.load(modelFile, vmdFiles, function(object) {
			mesh = object;
			helper.add(mesh);
			helper.setAnimation(mesh);
			helper.setPhysics(mesh);
			loader.loadAudio(audioFile, function (audio, listener) {
				listener.position.z = 1;
				helper.setAudio(audio, listener, audioParams);
				helper.unifyAnimationDuration();
				arScene.scene.add(audio);
				arScene.scene.add(listener);
				markerRoot.add(mesh);
				ready = true;
			}, onProgress, onError);
		}, onProgress, onError);

		var tick = function() {
			arScene.process();
			if (ready) {
				// this is a trick to let Physics go correctly
				// with scale and rotation setting
				mesh.scale.set(1.0, 1.0, 1.0);
				var parent = mesh.parent;
				parent.remove(mesh);
				mesh.rotation.x = 0;
				mesh.updateMatrixWorld(true);

				helper.animate(clock.getDelta());

				mesh.rotation.x = 60 * Math.PI / 180;
				mesh.scale.set(0.1, 0.1, 0.1);
				parent.add(mesh);
				mesh.updateMatrixWorld(true);
			}
			arScene.renderOn(effect);
			requestAnimationFrame(tick);
		};

		tick();

	}});

	delete window.ARThreeOnLoad;

};

if (window.ARController && ARController.getUserMediaThreeScene) {
	ARThreeOnLoad();
}