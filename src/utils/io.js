// Load text files (GLSL Shaders)

// Fetch text file and return content
// Used in main.js to load vertex and Fragment Shaders
export async function loadText(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to load: " + url);
  }
  return await res.text();
}
