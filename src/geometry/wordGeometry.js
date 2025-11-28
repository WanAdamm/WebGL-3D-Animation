import { createRectangle, extrudeShape } from "./shapes.js";
import { letterColorsUI } from "../ui.js";

// Builds the 3D geometry for "TV1"

var centering = 1.0;  // To center letter
let lowpoint = 0;     // Allign bottom of 1 with T

// 1. Build full word as a single
export function buildWord(word, depth) {
  let verts = [];
  let idx = [];
  let normals = [];
  let colors = [];

  let offset = 0; // For indexing into merged vertex array 
  let x = 0;      // Horizontal spacing (Between Letter)

  for (let ch of word) {
    const g = buildLetter(ch, depth);

    // Color per letter
    let col;
    if (ch === "T") {
      col = letterColorsUI.T;
    } else if (ch === "V") {
      col = letterColorsUI.V;
    } else if (ch === "1") {
      col = letterColorsUI.One;
    } else {
      col = [0.5, 0.5, 0.5, 1.0];
    }

    // Push vertices (with horizontal offset)
    for (let v of g.vertices) {
      verts.push([v[0] + x, v[1], v[2]]);
      colors.push([...col]); // same colour for all verts of this letter
    }

    // Normals (translation doesn't change normals)
    for (let n of g.normals) {
      normals.push(n);
    }

    // Indices (offset for current word)
    for (let i of g.indices) idx.push(i + offset);

    offset += g.vertices.length;
    x += 1.0; // spacing (between letters)
  }

  return { vertices: verts, indices: idx, normals, colors };
}

// 2. Return the geometry for a single letter
function buildLetter(ch, depth) {
  if (ch === "T") return letterT(depth);
  if (ch === "V") return letterV(depth);
  if (ch === "1") return letter1(depth);

  // Fallback : Simple rectangle block
  return extrudeShape(createRectangle(1, 1), depth);
}

// 3. Build "T" using top bar and vertical stem
function letterT(depth) {
  const top = extrudeShape(createRectangle(0.7, 0.3), depth);
  const stem = extrudeShape(createRectangle(0.2, 1.5), depth);

  // Move stem up by adjusting the y-coord
  for (let v of top.vertices) v[1] += 0.6;

  // Shift x position to the center
  for (let v of stem.vertices) v[0] -= centering;
  for (let v of top.vertices) v[0] -= centering;

  let bottomT = Math.min(...stem.vertices.map((v) => v[1]));
  lowpoint = bottomT;

  // Returned the merged top and stem part the letter T
  return merge(top, stem);
}

// 4. Build the "V" from 2 rotated rectangles
function letterV(depth) {
  // Width and height of each diagonal stroke
  const strokeWidth = 0.2;
  const strokeLength = 1.5;

  // Create left stroke (\)
  const left = extrudeShape(createRectangle(strokeWidth, strokeLength), depth);

  // Create right stroke (/)
  const right = extrudeShape(createRectangle(strokeWidth, strokeLength), depth);

  // rotate the strokes
  for (let v of left.vertices) {
    const x = v[0],
      y = v[1];
    v[0] = x * Math.cos(0.1) - y * Math.sin(0.1);
    v[1] = x * Math.sin(0.1) + y * Math.cos(0.1);
  }
  for (let v of right.vertices) {
    const x = v[0],
      y = v[1];
    v[0] = x * Math.cos(-0.13) - y * Math.sin(-0.1);
    v[1] = x * Math.sin(-0.1) + y * Math.cos(-0.13);
  }

  // Shift them apart to form the V shape
  for (let v of left.vertices) v[0] -= 0.13;
  for (let v of right.vertices) v[0] += 0.13;

  // Shift x position to the center
  for (let v of left.vertices) v[0] -= centering;
  for (let v of right.vertices) v[0] -= centering;

  return merge(left, right);
}

// 5. Build the "1" and alligned to match the T
function letter1(depth) {
  // Vertical stem
  const stem = extrudeShape(createRectangle(0.2, 1.3), depth);

  // Bottom base
  const base = extrudeShape(createRectangle(0.35, 0.25), depth);

  // Slanted top (a thin rectangle rotated slightly)
  const top = extrudeShape(createRectangle(0.36, 0.22), depth);

  // Shift the stem down a bit to match T and V alignment
  for (let v of stem.vertices) v[1] -= 0.53;

  // Rotate the top bar slightly (like a handwriting slanted "1")
  for (let v of top.vertices) {
    const x = v[0],
      y = v[1];
    v[0] = x * Math.cos(0.65) - y * Math.sin(0.65);
    v[1] = x * Math.sin(0.65) + y * Math.cos(0.65);
  }

  // Move top bar
  for (let v of top.vertices) {
    v[1] += 0.1; //vertically
    v[0] -= 0.11; //horizontally
  }

  // Position bottom base under the stem
  for (let v of base.vertices) {
    v[1] -= 1.3;
  }

  // Shift x position to the center
  for (let v of stem.vertices) v[0] -= centering;
  for (let v of top.vertices) v[0] -= centering;
  for (let v of base.vertices) v[0] -= centering;

  // Shift y position to the center
  var lowOne = Math.min(...base.vertices.map((v) => v[1]));
  var upFactor = lowpoint - lowOne;
  for (let v of stem.vertices) v[1] += upFactor;
  for (let v of top.vertices) v[1] += upFactor;
  for (let v of base.vertices) v[1] += upFactor;

  return merge(merge(stem, base), top);
}

// 6. Merged the geometries and adjust to alligned
function merge(a, b) {
  return {
    vertices: [...a.vertices, ...b.vertices],
    indices: [...a.indices, ...b.indices.map((i) => i + a.vertices.length)],
    normals: [...a.normals, ...b.normals],
  };
}
