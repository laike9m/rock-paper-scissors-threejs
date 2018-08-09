uniform float min;
uniform float max;

attribute vec3 customColor;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vModelPosition;
varying vec3 vColor;
varying float hilight;

void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	vNormal = normalize( normalMatrix * normal );
	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	vViewPosition = -mvPosition.xyz;
	vModelPosition = position;
	vColor = customColor;
	hilight = 0.0;
	if (min < position.x && position.x < max) {
	    hilight = 1.0;
	}
}
