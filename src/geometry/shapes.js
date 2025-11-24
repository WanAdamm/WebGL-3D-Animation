export function createRectangle(w, h) {
    w /= 2; h /= 2;
    return [
        [-w, -h, 0],
        [ w, -h, 0],
        [ w,  h, 0],
        [-w,  h, 0]
    ];
}

export function extrudeShape(shape, depth) {
    const verts = [];
    const idx = [];
    const N = shape.length;

    for (let p of shape) verts.push([p[0], p[1], 0]);
    for (let p of shape) verts.push([p[0], p[1], depth]);

    for (let i = 1; i < N-1; i++) {
        idx.push(0, i, i+1);
        idx.push(N, N+i+1, N+i);
    }

    for (let i = 0; i < N; i++) {
        let j = (i + 1) % N;
        idx.push(i, j, N + j);
        idx.push(i, N + j, N + i);
    }

    return { vertices: verts, indices: idx };
}
