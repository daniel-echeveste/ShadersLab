
#version 300 es
precision highp float;

in vec2 vUV;
in vec3 vNormal;
in vec3 vPosition;

out vec4 fragColor;

uniform float uTime;

void main() {
    // Hextech glowing energy effect
    float glow = sin(vUV.x * 10.0 + uTime) * 0.5 + 0.5;
    vec3 baseColor = vec3(0.1, 0.6, 1.0); // Blue hextech color
    vec3 glowColor = vec3(0.5, 1.0, 1.5); // Brighter glow
    
    vec3 finalColor = mix(baseColor, glowColor, glow);
    fragColor = vec4(finalColor, 1.0);
}
