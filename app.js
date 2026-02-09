import * as twgl from './twgl-full.module.js';

export let app = {
	"shaders":{"./quad.vs":{}},
	"uniforms": {},
	"drawables":{ // name -> {shaders, program, rebuildBuffers(), bufferInfo, uniforms, getInstanceCount()}
		"background": {"shaders":}
	}
};

app.init = function() {
	console.log("loaded");
	
	app.canvas = document.getElementById("game");
	app.gl = app.canvas.getContext("webgl2");
	app.twgl = twgl;
	
	// load shaders in app.shaders via fetch
	// build buffer attribute arrays
	// send first draw call
}	


app.nextFrame = function (time) {
	time *= 0.001;
	if(!app.lastFrameTime) lastFrameTime = time;
	const dt = time - lastFrameTime;
	lastFrameTime = time;
	const gl = app.gl;

	//updateKeyboard(dt);
	twgl.resizeCanvasToDisplaySize(app.gl.canvas);

	const w = gl.drawingBufferWidth;
	const h = gl.drawingBufferHeight;

	gl.viewport(0, 0, w, h);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);

    // update global uniforms
    const cam = twgl.m4.identity();
	cam[14] = -5;
    const view = twgl.m4.inverse(cam);
	const proj = twgl.m4.perspective(Math.PI / 4, w / h, 0.1, 100);
	app.uniforms.VP_MATRIX = twgl.m4.multiply(proj, view);
	app.uniforms.TIME = time;

    // for each draw call:
	for (let drawInfo of app.drawables) {
		gl.useProgram(drawInfo.program);
		
		if(drawInfo.rebuildBuffers) drawInfo.rebuildBuffers();
		twgl.setBuffersAndAttributes(gl, drawInfo.program, drawInfo.bufferInfo);
		
		twgl.setUniforms(drawInfo.program, app.uniforms);
		if(drawInfo.uniforms) twgl.setUniforms(drawInfo.program, drawInfo.uniforms);
		
		twgl.drawBufferInfo(gl, drawInfo.bufferInfo, gl.TRIANGLE_STRIP, 4, 0, drawInfo.getInstanceCount());
	}

	requestAnimationFrame(render);
}