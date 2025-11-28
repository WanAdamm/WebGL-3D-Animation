// Simple diffuse ligthing on vertex colours

precision mediump float;

varying vec3 vNormal;   // Normal from vertex Shader
varying vec4 vColor;    // Vertex Colour

void main() {
    // Normalise
    vec3 N = normalize(vNormal);

    // Fixed light in world space (top-right)
    vec3 lightDir = normalize(vec3(0.6, 0.8, 1.0));

    // Diffuse
    float diffuse = max(dot(N, lightDir), 0.0);

    // Add small ambient (if not it somehow become fully black)
    float lighting = 0.3 + 0.7 * diffuse;

    // Tint colour by lighting factor
    gl_FragColor = vec4(vColor.rgb * lighting, vColor.a);
}
