let running = false;
let rotation = 0;
let speed = 1;

export function animate(dt) {
    if (!running) return;
    rotation += 0.01 * speed;
}

export function startAnimation() {
    running = true;
}

export function setSpeed(s) {
    speed = s;
}

export function resetAnimation() {
    running = false;
    rotation = 0;
}
