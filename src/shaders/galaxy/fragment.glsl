uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;
varying vec3 vColor; 

void main() {
    
    //disc
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = step(0.5, strength);
    // strength = 1.0 - strength;

    //difuse point
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength *= 2.0;
    // strength = 1.0-strength;

    //Light point
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0-strength;
    strength = pow(strength,8.5);

    //color 
    vec3 color = mix(vec3(0.0), vColor, strength);
    gl_FragColor = vec4(vec3(color), 1.0);
    #include <colorspace_fragment>
}