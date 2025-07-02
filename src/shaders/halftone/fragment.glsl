uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uRepetitions;
uniform float uLow;
uniform float uHigh;
uniform vec3 uLightColor;
uniform float uLightRepetitions;
uniform vec3 uHalftoneColor;
uniform vec3 uShadowDirection;
uniform vec3 uLightDirection;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl
#include ../includes/halftone.glsl

void main () {
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = uColor; 

    //light 
    vec3 light = vec3(0.0);
    light += ambientLight(
        vec3(1.0), //light color
        0.8 //intensity
    );
    light += directionalLight(
        vec3(1.0), //light color
        0.8, //intensity
        normal,
        vec3(1.0, 1.0, 1.0), //direction
        viewDirection,
        1.0 // specular power
        
    );

    color *= light;
    //halftone
    color = halftone(
        color, 
        uRepetitions, 
        uShadowDirection,
        uLow, uHigh,
        uHalftoneColor,
        normal
    );
    color = halftone(
        color, 
        uRepetitions, 
        uLightDirection,
        uLow, uHigh,
        uLightColor,
        normal
    );
    // final color 
    gl_FragColor = vec4(color,1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}