// renderer.js
import { state } from "./animation.js";

let gl, program;
let buffers = {};

// Pass geometry to GPU
export function initRenderer(_gl, _program, geometry) {
  gl = _gl;
  program = _program;

  buffers.indexCount = geometry.indices.length;

  // POSITION buffer
  buffers.position = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(geometry.vertices), gl.STATIC_DRAW);

  const vPos = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(vPos, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPos);

  // NORMAL buffer
  buffers.normal = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(geometry.normals), gl.STATIC_DRAW);

  const vNorm = gl.getAttribLocation(program, "aNormal");
  gl.vertexAttribPointer(vNorm, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vNorm);

  // COLOR buffer
  buffers.color = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(geometry.colors), gl.STATIC_DRAW);

  const vCol = gl.getAttribLocation(program, "aColor");
  gl.vertexAttribPointer(vCol, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vCol);

  // INDEX buffer
  buffers.indices = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(geometry.indices),
    gl.STATIC_DRAW
  );

  // Store geometry for animation.js
  window.tv1Vertices = geometry.vertices;

  // Render default
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(1, 1, 1, 1); // white background like TV1
}

// Draw single frame
export function drawScene() {
  // Clear Buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Build ModelView (Object movement)
  let modelView = mat4();

  if (state.phase === 7) {
    // only translate when bouncing
    modelView = mult(modelView, translate(state.posX, state.posY, 0.0));
  }

  // Upload ModelView
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "uModelView"),
    false,
    flatten(modelView)
  );

  // Projection matrix (no perspective)
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "uProjection"),
    false,
    flatten(mat4())
  );

  const proj = mat4();
  gl.uniformMatrix4fv(
      gl.getUniformLocation(program, "uProjection"),
      false,
      flatten(proj)
  );

  // Store projection matrix globally for animation bounding
  window.tv1Projection = proj;


  // Scale (same as original)
  const scaleLoc = gl.getUniformLocation(program, "uScale");
  gl.uniform3f(scaleLoc, state.scale, state.scale, state.scale);

  // Rotation (same as original)
  const uRotationLoc = gl.getUniformLocation(program, "uRotation");

  // Z rotation (The spin)
  let R_z = rotate(state.rotationZ, [0, 0, 1]);
  let R = R_z;

  // Tilt rotation in phase 7
  if (state.phase === 7) {
    let R_y = rotateY(state.rotationY);
    let R_x = rotateX(state.rotationX);
    R = mult(R_y, R_x);
  }

  gl.uniformMatrix4fv(uRotationLoc, false, flatten(R));

  // Draw element
  gl.drawElements(gl.TRIANGLES, buffers.indexCount, gl.UNSIGNED_SHORT, 0);
}
