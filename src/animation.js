export const state = {
  running: false,
  rotation: 0,
  speed: 1,
};

export function animate(dt) {
  if (!state.running) return;
  state.rotation += 1 * state.speed;
}

export function startAnimation() {
  state.running = true;
}

export function setSpeed(s) {
  state.speed = s;
}

export function resetAnimation(depthInput, speedInput) {
  state.running = false;
  state.rotation = 0;

  // reset UI widgets to their baseline
  depthInput.value = depthInput.defaultValue;
  speedInput.value = speedInput.defaultValue;

  // notify listeners
  depthInput.dispatchEvent(new Event("input"));
  speedInput.dispatchEvent(new Event("input"));
}
