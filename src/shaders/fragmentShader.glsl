precision mediump float;

varying vec3 vNormal;
varying vec4 vColor;

void main() {
    vec3 N = normalize(vNormal);

    // fixed light in world space (top-right)
    vec3 lightDir = normalize(vec3(0.6, 0.8, 1.0));

    float diffuse = max(dot(N, lightDir), 0.0);

    float lighting = 0.3 + 0.7 * diffuse;

    gl_FragColor = vec4(vColor.rgb * lighting, vColor.a);
}
