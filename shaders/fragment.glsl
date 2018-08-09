uniform vec3 uDirLightPos;
uniform vec3 uDirLightColor;
uniform vec3 uSpecularColor;

varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vViewPosition;
varying float hilight;

void main() {
    vec4 lDirection = viewMatrix * vec4(uDirLightPos, 0.0);
    vec3 lVector = normalize(lDirection.xyz);
    vec3 normal = normalize(vNormal);
    float diffuse = max(dot(normal, lVector), 0.0);

    gl_FragColor = vec4(vColor, 1.0 );
    if (hilight >= 1.0) {
    	gl_FragColor.rgb += uSpecularColor * uDirLightColor * pow(diffuse, 2.0) * 2.0;
    }
}
