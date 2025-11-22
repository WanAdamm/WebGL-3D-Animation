import { createRectangle, extrudeShape } from "./shapes.js";

export function buildWord(word, depth) {
    let verts = [];
    let idx = [];
    let offset = 0;
    let x = 0;

    for (let ch of word) {
        const g = buildLetter(ch, depth);

        for (let v of g.vertices)
            verts.push([v[0] + x, v[1], v[2]]);

        for (let i of g.indices)
            idx.push(i + offset);

        offset += g.vertices.length;
        x += 2;
    }

    return { vertices: verts, indices: idx };
}

function buildLetter(ch, depth) {
    if (ch === "T") return letterT(depth);
    if (ch === "V") return letterV(depth);
    return extrudeShape(createRectangle(1,1), depth);
}

function letterT(depth) {
    const top = extrudeShape(createRectangle(1.5, 0.3), depth);
    const stem = extrudeShape(createRectangle(0.3, 1.5), depth);

    for (let v of stem.vertices) v[1] -= 0.6;

    return merge(top, stem);
}

function letterV(depth) {
    const L = extrudeShape(createRectangle(0.3, 1.5), depth);
    const R = extrudeShape(createRectangle(0.3, 1.5), depth);

    for (let v of L.vertices) v[0] -= 0.5;
    for (let v of R.vertices) v[0] += 0.5;

    return merge(L, R);
}

function merge(a, b) {
    return {
        vertices: [...a.vertices, ...b.vertices],
        indices: [...a.indices, ...b.indices.map(i => i + a.vertices.length)]
    };
}
