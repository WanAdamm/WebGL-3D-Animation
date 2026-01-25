---

# 🔗 Try It

[WebGL-3D-Animation](https://web-gl-3d-animation.vercel.app/)

---

# 📁 Project Structure

This WebGL project is organized into modular components to keep rendering, geometry generation, shaders, utilities, and UI logic cleanly separated.
Below is a detailed explanation of each folder and file.

---

## 📂 `src/`

Root directory for all WebGL source code.

---

## 📂 `src/geometry/`

Holds all geometry generation logic used in the WebGL scene.

### 🔸 **`shapes.js`**

Provides functions for constructing basic geometric primitives such as triangles, rectangles, and custom vertex sets.

### 🔸 **`wordGeometry.js`**

Generates vertex data for rendering words or characters (e.g., “TV”).
Converts text into custom geometry that WebGL can draw.

---

## 📂 `src/shaders/`

Contains GPU shader code written in GLSL.

### 🎨 **`vertexShader.glsl`**

Handles per-vertex operations: position transformations, rotations, scaling, and sending geometry down the pipeline.

### 🎨 **`fragmentShader.glsl`**

Controls pixel-level rendering: color output, shading logic, and final on-screen appearance.

---

## 📂 `src/utils/`

Utility modules shared across the project.

### 🛠️ **`initShaders.js`**

Compiles, links, and initializes WebGL shader programs.

### 🛠️ **`io.js`**

Handles resource loading (GLSL files, text files).
Used to fetch shader code asynchronously.

### 🧮 **`MV.js`**

Matrix/vector math library supporting transformations, projections, and linear algebra operations.

### 🛠️ **`shaderUtils.js`**

Low-level shader helpers — compiling GLSL, error logging, and validation.

### 🛠️ **`webgl-utils.js`**

General WebGL helper functions such as buffer creation, attribute pointers, and viewport handling.

### 🎞️ **`animation.js`**

Controls the animation loop — managing time updates, rotation angles, and `requestAnimationFrame`.

---

## 📄 `main.js`

Entry point of the application.
Initializes WebGL, loads geometry, compiles shaders, connects UI events, and starts the render loop.

---

## 🖼️ `renderer.js`

Handles drawing the scene on every frame.
Sets WebGL states, updates uniforms, binds buffers, and issues draw calls.

---

## 🧩 `ui.js`

Manages user-interface components (sliders, inputs, buttons).
Updates visuals dynamically based on user actions.

---

## 🌐 `index.html`

Main HTML file that defines the `<canvas>` element and loads all JavaScript modules.

---
