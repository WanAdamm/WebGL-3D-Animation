var WebGLUtils = WebGLUtils || {};

WebGLUtils.setupWebGL = function(canvas) {
    let gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) alert("WebGL not supported");
    return gl;
};
