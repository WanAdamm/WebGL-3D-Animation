function flatten(arr) { return new Float32Array(arr.flat()); }

function mat4() {
    return [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,1]
    ];
}

// expose globally
window.flatten = flatten;
window.mat4 = mat4;
