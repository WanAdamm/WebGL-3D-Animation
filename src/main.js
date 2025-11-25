import { initRenderer, drawScene } from "./renderer.js";
import { animate } from "./animation.js";
import { setupUI } from "./ui.js";
import { buildWord } from "./geometry/wordGeometry.js";
import { loadText } from "./utils/io.js";
import { createProgramFromSources } from "./utils/shaderUtils.js";

let gl, program, geometry;
let currentDepth = 1.0;

window.onload = async () => {
  const canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);

  // Load shader sources AFTER page + assets are ready
  const vsSource = await loadText("src/shaders/vertexShader.glsl");
  const fsSource = await loadText("src/shaders/fragmentShader.glsl");

  program = createProgramFromSources(gl, vsSource, fsSource);
  gl.useProgram(program);

  geometry = buildWord("TV1", 1.0);
  initRenderer(gl, program, geometry);
  resizeCanvas();

  setupUI(
    // onDepthChange
    (depth) => {
      currentDepth = depth;
      geometry = buildWord("TV1", depth);
      initRenderer(gl, program, geometry);
    },

    // onRebuildGeometry (for color pickers)
    () => {
      geometry = buildWord("TV1", currentDepth);
      initRenderer(gl, program, geometry);
    }
  );

  requestAnimationFrame(loop);
};

function loop(t) {
  animate(t);
  drawScene();
  requestAnimationFrame(loop);
}

function resizeCanvas() {
  const canvas = gl.canvas;
  const displayWidth  = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }
}

window.addEventListener("resize", resizeCanvas);
