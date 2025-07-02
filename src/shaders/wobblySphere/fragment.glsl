varying float vWobble;
uniform vec3 ballColor;
uniform vec3 ballColor2;
void main()
{
    float colorMixed = smoothstep(-1.0, 1.0, vWobble);
    csm_DiffuseColor.rgb = mix(ballColor, ballColor2, colorMixed);

    // //mirrorness
    //  csm_Metalness = step(0.25, vWobble);
    //  csm_Roughness = 1.5 - colorMixed;
}
