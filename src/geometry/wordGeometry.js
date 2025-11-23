import { createRectangle, extrudeShape } from "./shapes.js";

let TBottom = 0;
let TTop = 0;

export function buildWord(word, depth) {
  let verts = [];
  let idx = [];
  let offset = 0;
  let x = 0;

  for (let ch of word) {
    const g = buildLetter(ch, depth);

    for (let v of g.vertices) verts.push([v[0] + x, v[1], v[2]]); // shift letter horizontally so that it appears side by side

    for (let i of g.indices) idx.push(i + offset);

    offset += g.vertices.length;
    x += 0.8; // fixed horizontal spacing
  }

  return { vertices: verts, indices: idx };
}

// convert JS Array to vec3
function convertVerticesToVec3(shape) {
  for (let i = 0; i < shape.vertices.length; i++) {
    const p = shape.vertices[i];
    shape.vertices[i] = vec3(p[0], p[1], p[2]);
  }
}

// to scale the shape
function scaleShape(shape, s) {
  for (let i = 0; i < shape.vertices.length; i++) {
    shape.vertices[i] = mult(s, shape.vertices[i]);
  }
}

function buildLetter(ch, depth) {
  if (ch === "T") return letterT(depth);
  if (ch === "V") return letterV(depth);
  return extrudeShape(createRectangle(1, 1), depth);
}

function letterT(depth) {
  const top = extrudeShape(createRectangle(1.5, 0.3), depth);
  const stem = extrudeShape(createRectangle(0.3, 1.5), depth);

  // move stem down by adjusting the y-coord
  for (let v of stem.vertices) v[1] -= 0.6;

  const bottomT = Math.min(...stem.vertices[1]); // return lowestpoint of the letter T
  TBottom = bottomT; // passing to global var 

  const topT = Math.max(...stem.vertices[1]); // return highestpoint of the letter T
  TTop = topT; // passing to global var 

  // returned the merged top and stem part the letter T
  return merge(top, stem);
}

function letterV(depth) {
  const V_outline = [
    [-0.6, TTop],
    [-0.3, TBottom],
    [0.3, TBottom],
    [0.6, TTop],
  ];

  const geom = extrudeShape(V_outline, depth);

  return geom;
}

function merge(a, b) {
  return {
    vertices: [...a.vertices, ...b.vertices],
    indices: [...a.indices, ...b.indices.map((i) => i + a.vertices.length)],
  };
}
