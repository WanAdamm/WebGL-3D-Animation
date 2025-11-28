// 1. Animation State
export const state = {
  running: false,

  // For idle
  rotationY: 0, 
  rotationX: 0, 
  rotationZ: 0,
  speed: 1,

  // User adjusted scale
  scale: 0.2,
  userScale: 0.2,
  targetScale: 1.2,

  // Current phase animation
  phase: 0,
  timer: 0,
  radius: 0.8, 


  // Movement state for phase 7
  posX: 0,
  posY: 0,
  velX: 0.01,
  velY: 0.007,
};

//--------------------------------------------------------------------
// 2.1 Start the full animation sequence
export function startAnimation() {
  state.running = true;

  // Reset rotation
  state.rotationY = 0;
  state.rotationX = 0;
  state.rotationZ = 0;
  // Initial scale
  state.userScale = state.scale;

  // Initialize begin at phase 1
  state.phase = 1;
  state.timer = 0;

  // Reset Movement
  state.posX = 0;
  state.posY = 0;
}

// 2.2 Set manual scale
export function setScale(s) {
  state.scale = s;
  state.userScale = s;
}

// 2.3 Set animation speed
export function setSpeed(s) {
  state.speed = s;
}

// 2.4 Resey animation to initial (Include Slider)
export function resetAnimation(depthScale, speedScale, scaleScale) {
  state.running = false;

  state.rotationY = 0;
  state.rotationX = 0;
  state.rotationZ = 0;

  state.phase = 0;
  state.timer = 0;

  state.posX = 0;
  state.posY = 0;

  depthScale.value = depthScale.defaultValue;
  speedScale.value = speedScale.defaultValue;
  scaleScale.value = scaleScale.defaultValue;

  depthScale.dispatchEvent(new Event("input"));
  speedScale.dispatchEvent(new Event("input"));
  scaleScale.dispatchEvent(new Event("input"));
}

//--------------------------------------------------------------------
// 3. Main Animation
export function animate(t) {
  if (!state.running) return;

  switch (state.phase) {
    // 1. Rotate right +180
    case 1:
      state.rotationZ += 2 * state.speed;
      if (state.rotationZ >= 180) state.phase = 2;
      break;

    // 2. Return to center (0)
    case 2:
      state.rotationZ -= 2 * state.speed;
      if (state.rotationZ <= 0) state.phase = 3;
      break;

    // 3. Rotate left -180
    case 3:
      state.rotationZ -= 2 * state.speed;
      if (state.rotationZ <= -180) state.phase = 4;
      break;

    // 4. Return to center again
    case 4:
      state.rotationZ += 2 * state.speed;
      if (state.rotationZ >= 0) state.phase = 5;
      break;

    // 5. Scale up to fullscreen
    case 5:
      state.scale += 0.01 * state.speed;
      if (state.scale >= state.targetScale) {
        state.scale = state.targetScale;
        state.phase = 6;
      }
      break;

    // 6. Scale down back to original-
    case 6:
      state.scale -= 0.01 * state.speed;
      if (state.scale <= state.userScale) {
        state.scale = state.userScale;
        state.phase = 7;
      }
      break;

    // 7. Idle rotation + bouncing movement logic
    case 7:
      // Rotation Tilt
      state.rotationY += 0.6 * state.speed;
      state.rotationX += 0.4 * state.speed;

      // Movement Update
      state.posX += state.velX * state.speed;
      state.posY += state.velY * state.speed;

      // Bounding box & Collision (inline)
      const verts = window.tv1Vertices;
      const P = window.tv1Projection || mat4();

      // Build modelView exactly like renderer.js
      let MV = mat4();

      // Translation
      MV = mult(MV, translate(state.posX, state.posY, 0));

      // Rrotation: Z → Y → X
      MV = mult(MV, rotateZ(state.rotationZ));
      MV = mult(MV, rotateY(state.rotationY));
      MV = mult(MV, rotateX(state.rotationX));

      // Scaling
      MV = mult(MV, scale(state.scale, state.scale, state.scale));

      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;

      for (let v of verts) {
        const p = vec4(v[0], v[1], v[2], 1.0);

        // ModelView to projection
        const mv = mult(MV, p);
        const clip = mult(P, mv);

        // Perspective divide to NDC space (screen space)
        const x = clip[0] / clip[3];
        const y = clip[1] / clip[3];

        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }

      // Screen boundaries in clip-space
      const left = -1, right = 1;
      const bottom = -1, top = 1;

      // Collide right boundary
      if (maxX > right) {
        state.velX *= -1;
        state.posX -= (maxX - right); 
      }

      // Collide left boundary
      if (minX < left) {
        state.velX *= -1;
        state.posX += (left - minX);
      }

      // Collide top boundary
      if (maxY > top) {
        state.velY *= -1;
        state.posY -= (maxY - top);
      }

      // Collide bottom boundary
      if (minY < bottom) {
        state.velY *= -1;
        state.posY += (bottom - minY);
      }
      break;
  }
}