export const state = {
  running: false,
  rotation: 0,
  speed: 1,
  scale: 0.2,
  direction: 1,
};

export function animate(dt) {
  if (!state.running) return;

  console.log(state.rotation)
  if(state.rotation > 180) state.direction = -1;
  if(state.rotation < -180) state.direction = 1;

  state.rotation += 1 * state.direction * state.speed;
}

export function startAnimation() {
  state.running = true;
}

export function setScale(s) {
  state.scale = s;
}

export function setSpeed(s) {
  state.speed = s;
}

export function resetAnimation(depthInput, speedInput, scaleInput) {
  state.running = false;
  state.rotation = 0;

  // reset UI widgets to their baseline
  depthInput.value = depthInput.defaultValue;
  speedInput.value = speedInput.defaultValue;
  scaleInput.value = scaleInput.defaultValue;

  // notify listeners
  depthInput.dispatchEvent(new Event("input"));
  speedInput.dispatchEvent(new Event("input"));
  scaleInput.dispatchEvent(new Event("input"));
}
