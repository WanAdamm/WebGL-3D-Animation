import { startAnimation, setSpeed, resetAnimation, setScale } from "./animation.js";

export function setupUI(onDepthChange) {
    const depth = document.getElementById("extrudeDepth");
    const scale = document.getElementById("scale")
    const speed = document.getElementById("speed");
    const startBtn = document.getElementById("startBtn");
    const resetBtn = document.getElementById("resetBtn");

    depth.oninput = e => onDepthChange(parseFloat(e.target.value));
    scale.oninput = e => setScale(parseFloat(e.target.value));
    speed.oninput = e => setSpeed(parseFloat(e.target.value));

    startBtn.onclick = () => startAnimation();
    resetBtn.onclick = () => resetAnimation(depth, speed, scale);
}