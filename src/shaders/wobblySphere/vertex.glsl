
uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;
uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;

attribute vec3 tangent;

varying vec2 vUv;
varying float vWobble;

#include ../includes/simplexNoise4d.glsl

float getWobble(vec3 position){

    vec3 warpedPosition = position;
    warpedPosition += simplexNoise4d(vec4(
        position * uWarpPositionFrequency,
        uTime * uWarpTimeFrequency
        )) * uWarpStrength;
    return simplexNoise4d(vec4(
        warpedPosition * uPositionFrequency, 
        uTime * uTimeFrequency
        )) * uStrength;
}
void main()
{
    vec3 biTangent = cross(normal, tangent.xyz);

     //neightbour position 
     float shift = 0.01;
     vec3 positionA = csm_Position +  tangent.xyz * shift;
     vec3 positionB = csm_Position + biTangent * shift;

    // Woble 
    float wobble = getWobble(csm_Position);      
    csm_Position += normal * wobble;
    positionA += getWobble(positionA) * normal;
    positionB += getWobble(positionB) * normal;

    //Compute Normals 
    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toB, toA);
    //varyings    
    vUv = uv;
    vWobble = wobble/uStrength;
}
