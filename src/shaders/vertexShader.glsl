// Transforms each vertex
// Applies rotation and scalling
// Add normals and colours to fragment shader.

attribute vec3 aPosition;   // 3D coordinate of each vertex
attribute vec3 aNormal;     // surface normal of each vertex
attribute vec4 aColor;      // store the vertex RGBA color

uniform mat4 uModelView;    // Position and orientation of whole object
uniform mat4 uProjection;   // Control how 3D to 2D Projection (Clipping)
uniform mat4 uRotation;     // Mainly to rotate the object
uniform vec3 uScale;        // Mainly to scale the object

varying vec3 vNormal;       // Normal in view (For lighting)
varying vec4 vColor;        // vertex Colour

void main() {
    // Scalling
    vec3 scaled = aPosition * uScale;

    // Rotation
    vec4 rotatedPos = uRotation * vec4(scaled, 1.0);

    // Clip-space position
    gl_Position = uProjection * uModelView * rotatedPos;

    // Rotate the normal (But we ignore translation here)
    vNormal = normalize(mat3(uRotation) * aNormal);

    // Pass Colour
    vColor = aColor;
}
