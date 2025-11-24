export const state = {
    running: false,
    rotation: 0,
    speed: 1
};

export function animate(dt) {
    if (!state.running) return;
    state.rotation += 0.01 * state.speed;
}

export function startAnimation() {
    state.running = true;
}

export function setSpeed(s) {
    state.speed = s;
}

export function resetAnimation() {
    state.running = false;
    state.rotation = 0;
}
