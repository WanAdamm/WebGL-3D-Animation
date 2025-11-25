import {
  startAnimation,
  setSpeed,
  resetAnimation,
  setScale,
} from "./animation.js";

export function setupUI(onDepthChange) {
  const depth = document.getElementById("extrudeDepth");
  const depthValue = document.getElementById("depthValue");

  const scale = document.getElementById("scale");
  const scaleValue = document.getElementById("scaleValue");

  const speed = document.getElementById("speed");
  const speedValue = document.getElementById("speedValue");

  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");

  depth.oninput = (e) => {
    const val = parseFloat(e.target.value);
    depthValue.textContent = val.toFixed(1);
    onDepthChange(val);
  };

  scale.oninput = (e) => {
    const val = parseFloat(e.target.value);
    scaleValue.textContent = val.toFixed(1);
    setScale(val);
  };

  speed.oninput = (e) => {
    const val = parseFloat(e.target.value);
    speedValue.textContent = val.toFixed(1);
    setSpeed(val);
  };

  startBtn.onclick = () => startAnimation();
  resetBtn.onclick = () => resetAnimation(depth, speed, scale);
}
