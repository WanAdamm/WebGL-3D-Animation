attribute vec4 aPosition;

uniform mat4 uModelView;
uniform mat4 uProjection;
uniform mat4 uRotation;
uniform vec3 uScale;

void main() {
    vec4 scaledPos = vec4(aPosition.xyz * uScale, 1.0);
    vec4 rotatedPos = uRotation * scaledPos;  // already clockwise if matrix is negative angle

    gl_Position = uProjection * uModelView * rotatedPos;
}
