import {startAnimation, setSpeed, resetAnimation, setScale,} from "./animation.js";

// Default colour values for letter (used in geometry builder)
export const letterColorsUI = {
  T: [0.0, 0.23, 0.8, 1.0],
  V: [0.0, 0.18, 0.65, 1.0],
  One: [0.9, 0.05, 0.1, 1.0],
};

// Convert hex colour into RGB (in colour picker)
function hexToRGBA(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255,
    1.0,
  ];
}

// Setup slider, colour picker & button
export function setupUI(onDepthChange, onRebuildGeometry) {
  const depth = document.getElementById("extrudeDepth");
  const depthValue = document.getElementById("depthValue");

  const scale = document.getElementById("scale");
  const scaleValue = document.getElementById("scaleValue");

  const speed = document.getElementById("speed");
  const speedValue = document.getElementById("speedValue");

  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");

  // Sliders
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

  resetBtn.onclick = () => {
    // reset animation values
    resetAnimation(depth, speed, scale);

    // reset UI color inputs
    document.getElementById("colorT").value = "#003BE0";
    document.getElementById("colorV").value = "#002EA6";
    document.getElementById("color1").value = "#E00019";

    // reset internal color arrays
    letterColorsUI.T = [0.0, 0.23, 0.8, 1.0];
    letterColorsUI.V = [0.0, 0.18, 0.65, 1.0];
    letterColorsUI.One = [0.9, 0.05, 0.1, 1.0];

    onRebuildGeometry();
  };

  // Color pickers
  document.getElementById("colorT").addEventListener("input", (e) => {
    letterColorsUI.T = hexToRGBA(e.target.value);
    onRebuildGeometry();
  });

  document.getElementById("colorV").addEventListener("input", (e) => {
    letterColorsUI.V = hexToRGBA(e.target.value);
    onRebuildGeometry();
  });

  document.getElementById("color1").addEventListener("input", (e) => {
    letterColorsUI.One = hexToRGBA(e.target.value);
    onRebuildGeometry();
  });
}
