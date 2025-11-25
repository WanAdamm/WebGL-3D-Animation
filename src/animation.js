export const state = {
  running: false,

  rotationY: 0,    // left/right spin (main)
  rotationX: 0,    // up/down tilt
  rotationZ: 0,
  speed: 1,

  scale: 0.2,
  userScale: 0.2,
  targetScale: 1.2,

  phase: 0,
  timer: 0
};

// helper: wait X seconds
function wait(dt, sec) {
  state.timer += dt * 0.001;
  if (state.timer >= sec) {
    state.timer = 0;
    return true;
  }
  return false;
}

export function startAnimation() {
  state.running = true;

  state.rotationY = 0;
  state.rotationX = 0;
  state.userScale = state.scale;

  state.phase = 1;
  state.timer = 0;
}

export function setScale(s) {
  // allow manual scale only in idle
  state.scale = s;
}

export function setSpeed(s) {
  state.speed = s;
}

export function animate(dt) {
  if (!state.running) return;
  

  switch (state.phase) {

    // --------------------------------------------------
    // 1. Rotate right +180
    // --------------------------------------------------
    case 1:
      state.rotationZ += 2 * state.speed;
      if (state.rotationZ >= 180) state.phase = 2;
      break;

    // --------------------------------------------------
    // 2. Return to center (0)
    // --------------------------------------------------
    case 2:
      state.rotationZ -= 2 * state.speed;
      if (state.rotationZ <= 0) state.phase = 3;
      break;

    // --------------------------------------------------
    // 3. Rotate left -180
    // --------------------------------------------------
    case 3:
      state.rotationZ -= 2 * state.speed;
      if (state.rotationZ <= -180) state.phase = 4;
      break;

    // --------------------------------------------------
    // 4. Return to center again
    // --------------------------------------------------
    case 4:
      state.rotationZ += 2 * state.speed;
      if (state.rotationZ >= 0) state.phase = 5;
      break;

    // --------------------------------------------------
    // 5. Scale up to fullscreen
    // --------------------------------------------------
    case 5:
      state.scale += 0.01 * state.speed;   // apply speed
      if (state.scale >= state.targetScale) {
        state.scale = state.targetScale;
        state.phase = 6;
      }
      break;

    // --------------------------------------------------
    // 6. Scale down back to original
    // --------------------------------------------------
    case 6:
      state.scale -= 0.01 * state.speed;   // apply speed
      if (state.scale <= state.userScale) {
        state.scale = state.userScale;
        state.phase = 7;
      }
      break;

    // --------------------------------------------------
    // 7. Idle globe rotation loop
    // --------------------------------------------------
    case 7:
      // continuous spin around Y (apply speed)
      state.rotationY += 0.6 * state.speed;

      // continuous spin around X (apply speed)
      state.rotationX += 0.4 * state.speed;
      break;
  }
}

export function resetAnimation(depth, speed, scale) {
  state.running = false;

  state.rotationY = 0;
  state.rotationX = 0;
  state.rotationZ = 0;
  state.userScale = state.scale;

  state.phase = 0;
  state.timer = 0;

  depth.value = depth.defaultValue;
  speed.value = speed.defaultValue;
  scale.value = scale.defaultValue;

  depth.dispatchEvent(new Event("input"));
  speed.dispatchEvent(new Event("input"));
  scale.dispatchEvent(new Event("input"));
}
