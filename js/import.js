function importJS(){
	if(!new Array().push) return false;
	var scripts = new Array(
			'./build/artoolkit.debug.js',
			'./js/artoolkit.api.js',
			'./js/three.js',
			'./js/mmdparser.min.js',
			'./js/ammo.js',
			'./js/TGALoader.js',
			'./js/MMDLoader.js',
			'./js/OutlineEffect.js',
			'./js/CCDIKSolver.js',
			'./js/MMDPhysics.js',
			'./js/artoolkit.three.js',
			'./js/mmd4ar.js'
		);

	  for (var i=0; i<scripts.length; i++) {
        document.write('<script type="text/javascript" src="' +scripts[i] +'" charset="utf-8"><\/script>');
    }
}

importJS()