import { createRectangle, extrudeShape } from "./shapes.js";
import { letterColorsUI } from "../ui.js";

var centering = 1.0;
let lowpoint = 0;

export function buildWord(word, depth) {
  let verts = [];
  let idx = [];
  let normals = [];
  let colors = [];

  let offset = 0;
  let x = 0;

  for (let ch of word) {
    const g = buildLetter(ch, depth);

    // color per letter
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

    // push vertices (with horizontal offset)
    for (let v of g.vertices) {
      verts.push([v[0] + x, v[1], v[2]]);
      colors.push([...col]); // same colour for all verts of this letter
    }

    // normals (translation doesn't change normals)
    for (let n of g.normals) {
      normals.push(n);
    }

    // indices (offset for current word)
    for (let i of g.indices) idx.push(i + offset);

    offset += g.vertices.length;
    x += 1.0; // spacing
  }

  return { vertices: verts, indices: idx, normals, colors };
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

  // move stem up by adjusting the y-coord
  for (let v of top.vertices) v[1] += 0.6;

  // shift x position to the center
  for (let v of stem.vertices) v[0] -= centering;
  for (let v of top.vertices) v[0] -= centering;

  let bottomT = Math.min(...stem.vertices.map((v) => v[1]));
  lowpoint = bottomT;

  // returned the merged top and stem part the letter T
  return merge(top, stem);
}

function letterV(depth) {
  // width and height of each diagonal stroke
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

  // shift them apart to form the V shape
  for (let v of left.vertices) v[0] -= 0.13;
  for (let v of right.vertices) v[0] += 0.13;

  // shift x position to the center
  for (let v of left.vertices) v[0] -= centering;
  for (let v of right.vertices) v[0] -= centering;

  return merge(left, right);
}

function letter1(depth) {
  // vertical stem
  const stem = extrudeShape(createRectangle(0.2, 1.3), depth);

  // bottom base
  const base = extrudeShape(createRectangle(0.35, 0.25), depth);

  // slanted top (a thin rectangle rotated slightly)
  const top = extrudeShape(createRectangle(0.36, 0.22), depth);

  // shift the stem down a bit to match T and V alignment
  for (let v of stem.vertices) v[1] -= 0.53;

  // rotate the top bar slightly (like a handwriting slanted "1")
  for (let v of top.vertices) {
    const x = v[0],
      y = v[1];
    v[0] = x * Math.cos(0.65) - y * Math.sin(0.65);
    v[1] = x * Math.sin(0.65) + y * Math.cos(0.65);
  }

  // move top bar
  for (let v of top.vertices) {
    v[1] += 0.1; //vertically
    v[0] -= 0.11; //horizontally
  }

  // position bottom base under the stem
  for (let v of base.vertices) {
    v[1] -= 1.3;
  }

  // shift x position to the center
  for (let v of stem.vertices) v[0] -= centering;
  for (let v of top.vertices) v[0] -= centering;
  for (let v of base.vertices) v[0] -= centering;

  //shift y position to the center
  var lowOne = Math.min(...base.vertices.map((v) => v[1]));
  var upFactor = lowpoint - lowOne;
  for (let v of stem.vertices) v[1] += upFactor;
  for (let v of top.vertices) v[1] += upFactor;
  for (let v of base.vertices) v[1] += upFactor;

  return merge(merge(stem, base), top);
}

function merge(a, b) {
  return {
    vertices: [...a.vertices, ...b.vertices],
    indices: [...a.indices, ...b.indices.map((i) => i + a.vertices.length)],
    normals: [...a.normals, ...b.normals],
  };
}
