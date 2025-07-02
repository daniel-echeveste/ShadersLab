uniform sampler2D uTexture;
uniform vec3 uColor ;
void main()
{
    float textureAlpha = texture(uTexture, gl_PointCoord).r;
    vec4 textureColor = texture(uTexture, gl_PointCoord);

    //final color 
    gl_FragColor = vec4(uColor, textureAlpha);
    // gl_FragColor = textureColor;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}