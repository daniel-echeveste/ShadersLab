
uniform vec3 uColorWaterDeep;
uniform vec3 uColorWaterShallow;
uniform vec3 uColorSand;
uniform vec3 uColorSnow;
uniform vec3 uColorGrass;
uniform vec3 uColorRock;

varying vec3 vPosition;
varying float vUpDot;

#include ../includes/simplexNoise2d.glsl
void main(){
    //color 
    vec3 color = vec3(1.0);

    //water
    float surfaceWaterMix = smoothstep(-1.0,  -0.1, vPosition.y);
    color = mix(uColorWaterDeep, uColorWaterShallow, surfaceWaterMix);

    //sand 
    float sandMix = step(-0.1, vPosition.y);
    color = mix(color, uColorSand, sandMix);

    //grass
    float grassMix = step(-0.06, vPosition.y); 
    color = mix(color, uColorGrass, grassMix);

    // //rock
    float rockMix = vUpDot;
    // rockMix =  1.0 - step(0.8,  rockMix);
    rockMix =  1.0 - smoothstep(0.8,  0.9,  rockMix);
    rockMix *= step(-0.06, vPosition.y); 
    color = mix(color, uColorRock, rockMix);
    // color = vec3(rockMix);


     //snow
     float snowThreshold = 0.45;
     snowThreshold += simplexNoise2d(vPosition.xz * 15.0) * 0.1;
     float snowMix = step(snowThreshold,  vPosition.y);
     color = mix(color, uColorSnow, snowMix);

    // //rock
    // float rockMix = smoothstep(0.0,  0.1, vPosition.y);
    // color = mix(color, uColorRock, rockMix);

   
    csm_DiffuseColor = vec4(color, 1.0);
    // csm_FragColor = vec4(uColorRock, 1.0);
}