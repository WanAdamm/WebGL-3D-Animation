// ========== Load a shader from raw source text ==============
function initShadersFromSource(gl, vertexSrc, fragmentSrc) {
    const vShader = loadShader(gl, gl.VERTEX_SHADER, vertexSrc);
    const fShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);

    const program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Shader linking failed:", gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// expose globally (no exports — matches your project arch)
window.initShadersFromSource = initShadersFromSource;
