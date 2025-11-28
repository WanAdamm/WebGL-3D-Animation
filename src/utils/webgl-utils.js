var WebGLUtils = WebGLUtils || {};

// Obtain WebGL rendering from canvas element
WebGLUtils.setupWebGL = function (canvas) {
  let gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  
  // Check error (if any)
  if (!gl) alert("WebGL not supported");
  return gl;
};
