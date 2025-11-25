import { state } from "./animation.js";

let gl, program;
let buffers = {};

export function initRenderer(_gl, _program, geometry) {
  gl = _gl;
  program = _program;

  buffers.indexCount = geometry.indices.length;

  // Position buffer
  buffers.position = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(geometry.vertices), gl.STATIC_DRAW);

  // Index buffer
  buffers.indices = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(geometry.indices),
    gl.STATIC_DRAW
  );

  const vPos = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(vPos, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPos);

  // For scaling
  const scaleLoc = gl.getUniformLocation(program, "uScale");
  gl.uniform3f(scaleLoc, 0.2, 0.2, 0.2); // scale to 50%

  // For rotation
  const uRotationLoc = gl.getUniformLocation(program, "uRotation");
  let R = rotate(0, [0, 1, 1]); // rotates clockwise around y
  gl.uniformMatrix4fv(uRotationLoc, false, flatten(R));

  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 1);
}

export function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.uniform4fv(gl.getUniformLocation(program, "uColor"), [0.2, 0.6, 1.0, 1.0]);

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

  gl.drawElements(gl.TRIANGLES, buffers.indexCount, gl.UNSIGNED_SHORT, 0);
}
