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
    x += 1.5; // fixed horizontal spacing
  }

  return { vertices: verts, indices: idx };
}

function buildLetter(ch, depth) {
  if (ch === "T") return letterT(depth);
  if (ch === "V") return letterV(depth);
  if (ch === "1") return letter1(depth);
  return extrudeShape(createRectangle(1, 1), depth);
}

function letterT(depth) {
  const top = extrudeShape(createRectangle(1.5, 0.3), depth);
  const stem = extrudeShape(createRectangle(0.3, 1.5), depth);

  // move stem down by adjusting the y-coord
  for (let v of stem.vertices) v[1] -= 0.6;

  // returned the merged top and stem part the letter T
  return merge(top, stem);
}

function letterV(depth) {
  const legWidth = 0.25;
  const legHeight = 1.5;
  const legTilt = 25; // degrees
  const legGap = 0.23; // tiny spacing so legs don’t overlap visually

  // Build two vertical legs, centered at origin (MV.js style)
  const leftLeg = extrudeShape(createRectangle(legWidth, legHeight), depth);
  const rightLeg = extrudeShape(createRectangle(legWidth, legHeight), depth);

  for (let v of leftLeg.vertices) v[1] -= 0.6;
  for (let v of rightLeg.vertices) v[1] -= 0.6;

  // We want the legs to meet at the BOTTOM, so pivot at bottom centre:
  const pivotY = -legHeight / 2; // bottom of the rectangle

  function rotateGeom(geom, M) {
    for (let i = 0; i < geom.vertices.length; i++) {
      let v = geom.vertices[i]; // [x, y, z]

      // 1. move pivot to origin (y - pivotY; pivotY is negative → adds)
      let x = v[0];
      let y = v[1] - pivotY;
      let z = v[2];

      // 2. manual vec4
      const p = [x, y, z, 1.0];

      // 3. apply rotation
      const r = mult(M, vec4(p)); // mat4 × vec4

      // 4. move pivot back and store
      geom.vertices[i] = vec3(r[0], r[1] + pivotY, r[2]);
    }
  }

  // Left leg tilts towards the right (top goes right)
  const M_left = rotate(-legTilt, [0, 0, 1]);
  // Right leg tilts towards the left (top goes left)
  const M_right = rotate(legTilt, [0, 0, 1]);

  rotateGeom(leftLeg, M_left);
  rotateGeom(rightLeg, M_right);

  // Tiny horizontal nudge so they don’t perfectly overlap at bottom
  for (let v of leftLeg.vertices) v[0] -= legGap;
  for (let v of rightLeg.vertices) v[0] += legGap;

  return merge(leftLeg, rightLeg);
}

function letter1(depth) {
  const one = extrudeShape(createRectangle(0.3, 1.5), depth);
  for (let v of one.vertices) v[1] -= 0.6;

  return one;
}

function merge(a, b) {
  return {
    vertices: [...a.vertices, ...b.vertices],
    indices: [...a.indices, ...b.indices.map((i) => i + a.vertices.length)],
  };
}
