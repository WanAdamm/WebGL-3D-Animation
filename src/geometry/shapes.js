// Basic 2D rectangle generator and 3D extrusion helper

// Create a 2D rectangle centered at the origin
// w, h - width and height of the rectangle 
export function createRectangle(w, h) {
  w /= 2;
  h /= 2;
  return [
    [-w, -h, 0],
    [w, -h, 0],
    [w, h, 0],
    [-w, h, 0],
  ];
}

// Convert 2D into 3D along +z
export function extrudeShape(shape, depth) {
  const verts = [];
  const normals = [];
  const idx = [];

  // 1. FRONT FACE (z=0)
  const N = shape.length;
  const frontStart = verts.length;
  for (let p of shape) {
    verts.push([p[0], p[1], 0]);
    normals.push([0, 0, 1]); // front
  }
  // Triangulation
  for (let i = 1; i < N - 1; i++) {
    idx.push(frontStart, frontStart + i, frontStart + i + 1);
  }

  // 2. BACK FACE (z=depth)
  const backStart = verts.length;
  for (let p of shape) {
    verts.push([p[0], p[1], depth]);
    normals.push([0, 0, -1]); // back
  }
  for (let i = 1; i < N - 1; i++) {
    idx.push(backStart, backStart + i + 1, backStart + i);
  }

  // 3. SIDE FACES (one quad per edge)
  for (let i = 0; i < N; i++) {
    let j = (i + 1) % N;

    let p0 = shape[i];
    let p1 = shape[j];

    // Edge vector in 2D
    const ex = p1[0] - p0[0];
    const ey = p1[1] - p0[1];

    // Outward 2D normal (Perpendicular)
    let nx = ey;
    let ny = -ex;
    const L = Math.hypot(nx, ny) || 1.0;
    nx /= L;
    ny /= L;

    // create 4 NEW vertices for this quad (no sharing!)
    const v0 = verts.length; // front i
    const v1 = verts.length + 1; // front j
    const v2 = verts.length + 2; // back j
    const v3 = verts.length + 3; // back i

    // push vertices
    // frong edge
    verts.push([p0[0], p0[1], 0]);
    verts.push([p1[0], p1[1], 0]);
    // back edge
    verts.push([p1[0], p1[1], depth]);
    verts.push([p0[0], p0[1], depth]);

    // push identical normals per side face
    normals.push([nx, ny, 0]);
    normals.push([nx, ny, 0]);
    normals.push([nx, ny, 0]);
    normals.push([nx, ny, 0]);

    // 2 triangles for side quad
    idx.push(v0, v1, v2);
    idx.push(v0, v2, v3);
  }

  return { vertices: verts, normals: normals, indices: idx };
}
