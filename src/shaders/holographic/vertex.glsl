varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform sampler2D uPerlinTexture;
uniform float uTime;

float random2D(vec2 value) {
    return fract(sin(dot(value.xy, vec2(12.9898, 78.233))) * 43785.5453123);
}
void main() {

    //position 
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    //glitch
    float glitchTime = uTime - modelPosition.y;
    float glitch = sin(glitchTime) + sin(glitchTime * 3.45) + sin(glitchTime * 8.76);
    glitch /= 3.0;
    smoothstep(0.3, 1.0, glitch);
    glitch *= 0.25;
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitch;
    modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitch;

    //model Normal 
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    //final position
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    //VARYINGS 
    //vUv = uv;
    vPosition = modelPosition.xyz;
    vNormal = modelNormal.xyz;

}