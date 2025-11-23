attribute vec4 aPosition;

uniform mat4 uModelView;
uniform mat4 uProjection;
uniform vec3 uScale;

void main() {
    vec4 scaledPos = vec4(aPosition.xyz * uScale, aPosition.w);

    gl_Position = uProjection * uModelView * scaledPos;
}
