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
  if (ch === "1") return letter1(depth);
  return extrudeShape(createRectangle(1, 1), depth);
}

function letterT(depth) {
  const top = extrudeShape(createRectangle(0.7, 0.3), depth);
  const stem = extrudeShape(createRectangle(0.2, 1.5), depth);

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
  // width and height of each diagonal stroke
  const strokeWidth = 0.20;
  const strokeLength = 1.5;

  // Create left stroke (\)
  const left = extrudeShape(
    createRectangle(strokeWidth, strokeLength),
    depth
  );

  // Create right stroke (/)
  const right = extrudeShape(
    createRectangle(strokeWidth, strokeLength),
    depth
  );

  // rotate the strokes
  for (let v of left.vertices) {
    const x = v[0], y = v[1];
    v[0] = x * Math.cos(0.10) - y * Math.sin(0.10);
    v[1] = x * Math.sin(0.10) + y * Math.cos(0.10);
  }

  for (let v of right.vertices) {
    const x = v[0], y = v[1];
    v[0] = x * Math.cos(-0.13) - y * Math.sin(-0.10);
    v[1] = x * Math.sin(-0.10) + y * Math.cos(-0.13);
  }

  // shift them apart to form the V shape
  for (let v of left.vertices) v[0] -= 0.13;
  for (let v of right.vertices) v[0] += 0.13;

  // vertically align to shift V upwards
  for (let v of left.vertices)  v[1] -= 0.65;
  for (let v of right.vertices) v[1] -= 0.65;

  return merge(left, right);
}

function letter1(depth) {
  // vertical stem
  const stem = extrudeShape(
    createRectangle(0.20, 1.3),
    depth
  );

  // bottom base
  const base = extrudeShape(
    createRectangle(0.35, 0.25),
    depth
  );

  // slanted top (a thin rectangle rotated slightly)
  const top = extrudeShape(
    createRectangle(0.36, 0.22),
    depth
  );

  // shift the stem down a bit to match T and V alignment
  for (let v of stem.vertices) {
    v[1] -= 0.53;
  }

  // rotate the top bar slightly (like a handwriting slanted "1")
  for (let v of top.vertices) {
    const x = v[0], y = v[1];
    v[0] = x * Math.cos(0.65) - y * Math.sin(0.65);
    v[1] = x * Math.sin(0.65) + y * Math.cos(0.65);
  }

  // move top bar 
  for (let v of top.vertices) {
    v[1] += 0.10; //vertically
    v[0] -= 0.11; //horizontally
  }

  // position bottom base under the stem
  for (let v of base.vertices) {
    v[1] -= 1.30;
  }

  return merge(merge(stem, base), top);
}

function merge(a, b) {
  return {
    vertices: [...a.vertices, ...b.vertices],
    indices: [...a.indices, ...b.indices.map((i) => i + a.vertices.length)],
  };
}
