attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec4 aColor;

uniform mat4 uModelView;
uniform mat4 uProjection;
uniform mat4 uRotation;
uniform vec3 uScale;

varying vec3 vNormal;
varying vec4 vColor;

void main() {
    vec3 scaled = aPosition * uScale;

    // apply object rotation
    vec4 rotatedPos = uRotation * vec4(scaled, 1.0);

    // final position
    gl_Position = uProjection * uModelView * rotatedPos;

    // normal must be rotated the same way
    vNormal = normalize(mat3(uRotation) * aNormal);

    vColor = aColor;
}
