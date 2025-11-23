import { createRectangle, extrudeShape } from "./shapes.js";

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
    x += 2; // fixed horizontal spacing
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

  // convert top and stem coord array to vec3
  convertVerticesToVec3(top);
  convertVerticesToVec3(stem);

  // scale both parts by -2  (this flips + scales)
  scaleShape(top, 0.5);
  scaleShape(stem, 0.5);

  // returned the merged top and stem part the letter T
  return merge(top, stem);
}

function letterV(depth) {
  const V_outline = [
    [-0.6, 0.75],
    [-0.3, -0.75],
    [0.3, -0.75],
    [0.6, 0.75],
  ];

  // Your extruder must accept a list of 2D points
  const geom = extrudeShape(V_outline, depth);

  return geom;
}

function merge(a, b) {
  return {
    vertices: [...a.vertices, ...b.vertices],
    indices: [...a.indices, ...b.indices.map((i) => i + a.vertices.length)],
  };
}
