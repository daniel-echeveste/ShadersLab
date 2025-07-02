#version 300 es
precision highp float;

in vec3 aPosition;
in vec3 aNormal;
in vec2 aUV;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;

out vec2 vUV;
out vec3 vNormal;
out vec3 vPosition;

void main() {
    vUV = aUV;
    vNormal = normalize(mat3(uModelViewMatrix) * aNormal);
    vPosition = (uModelViewMatrix * vec4(aPosition, 1.0)).xyz;
    
    // Pulsation effects
    float distortion = sin(uTime + aPosition.x * 2.0) * 0.05; // Increased pulsation effect
    vec3 newPosition = aPosition + aNormal * distortion;
    
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(newPosition, 1.0);
}