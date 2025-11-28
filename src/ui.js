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

// main UI setup (sliders, colour pickers, the single Start/Reset button)
export function setupUI(onDepthChange, onRebuildGeometry) {
  // sliders and their text display
  const depth = document.getElementById("extrudeDepth");
  const depthValue = document.getElementById("depthValue");

  const scale = document.getElementById("scale");
  const scaleValue = document.getElementById("scaleValue");

  const speed = document.getElementById("speed");
  const speedValue = document.getElementById("speedValue");

  // we are only using one button now
  const actionBtn = document.getElementById("startBtn");

  // keep track of whether animation is running
  let running = false;

  // depth slider
  depth.oninput = (e) => {
    const val = parseFloat(e.target.value);
    depthValue.textContent = val.toFixed(1);
    onDepthChange(val);
  };

  // scale slider
  scale.oninput = (e) => {
    const val = parseFloat(e.target.value);
    scaleValue.textContent = val.toFixed(1);
    setScale(val);
  };

  // speed slider
  speed.oninput = (e) => {
    const val = parseFloat(e.target.value);
    speedValue.textContent = val.toFixed(1);
    setSpeed(val);
  };

  // one button that switches between "Start Animation" and "Reset"
  actionBtn.onclick = () => {
    if (!running) {
      // start animation
      startAnimation();
      running = true;
      actionBtn.textContent = "Reset";
      actionBtn.style.background = "#3b82f6"; // blue colour for reset
    } else {
      // reset everything back to default
      running = false;
      actionBtn.textContent = "Start Animation";
      actionBtn.style.background = "#0ca15b"; // green for start

      // reset animation + slider values
      resetAnimation(depth, speed, scale);

      // reset the colour pickers back to original colours
      document.getElementById("colorT").value = "#003BE0";
      document.getElementById("colorV").value = "#002EA6";
      document.getElementById("color1").value = "#E00019";

      // also reset the colour arrays (used by geometry generation)
      letterColorsUI.T = [0.0, 0.23, 0.8, 1.0];
      letterColorsUI.V = [0.0, 0.18, 0.65, 1.0];
      letterColorsUI.One = [0.9, 0.05, 0.1, 1.0];

      // reconstruct the 3D letters with the fresh colours
      onRebuildGeometry();
    }
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
