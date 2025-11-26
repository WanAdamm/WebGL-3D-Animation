import { state } from "./animation.js";

let gl, program;
let buffers = {};

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

  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(1, 1, 1, 1); // white background like TV1
}

export function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "uModelView"),
    false,
    flatten(mat4())
  );

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "uProjection"),
    false,
    flatten(mat4())
  );

  // scale
  const scaleLoc = gl.getUniformLocation(program, "uScale");
  gl.uniform3f(scaleLoc, state.scale, state.scale, state.scale);

  // ----------------------------------------------------
  // 3D ROTATION MATRIX
  // ----------------------------------------------------
  const uRotationLoc = gl.getUniformLocation(program, "uRotation");

  let R_z = rotate(state.rotationZ, [0,0,1]);   // main rotation

  let R = R_z;

  // During idle loop, add globe tilt:
  if (state.phase === 7) {
      let R_y = rotateY(state.rotationY);
      let R_x = rotateX(state.rotationX);
      R = mult(R_y, R_x);
  }


  gl.uniformMatrix4fv(uRotationLoc, false, flatten(R));

  gl.drawElements(gl.TRIANGLES, buffers.indexCount, gl.UNSIGNED_SHORT, 0);
}

// ----------------------------------------------------
// Rotation helpers
// ----------------------------------------------------

function radians(d) { return d * Math.PI / 180; }

function rotateX(a) {
  let c = Math.cos(radians(a));
  let s = Math.sin(radians(a));
  return mat4(
    1, 0, 0, 0,
    0, c, -s, 0,
    0, s,  c, 0,
    0, 0, 0, 1
  );
}

function rotateY(a) {
  let c = Math.cos(radians(a));
  let s = Math.sin(radians(a));
  return mat4(
     c, 0, s, 0,
     0, 1, 0, 0,
    -s, 0, c, 0,
     0, 0, 0, 1
  );
}
