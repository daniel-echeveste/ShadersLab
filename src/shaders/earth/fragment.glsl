varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudTexture;
uniform vec3 uSunDirection;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    //sun orientation 

    float sunOrientation = dot(normal, uSunDirection); // 
    
    //day - night color
    float dayMix = smoothstep(-0.25, 0.5, sunOrientation);
    vec3 dayColor = texture(uDayTexture, vUv).rgb;
    vec3 nightColor = texture(uNightTexture, vUv).rgb;

    color = mix(nightColor, dayColor, dayMix);

    // Specular clouds color
    vec2 specularCloudsColor = texture(uSpecularCloudTexture, vUv).rg;
    float cloudMix = smoothstep(0.1, 1.0, specularCloudsColor.g);
    cloudMix *= dayMix;
    color = mix(color, vec3(1.0), cloudMix);

    //fresnel 
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0);
   

    //atmosphere color
    float atmosphereDayMix = smoothstep(-0.5, 1.0, sunOrientation);
    vec3 athmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
    color = mix(color, athmosphereColor, fresnel * atmosphereDayMix);

    //specular 
     vec3 reflection = reflect(-uSunDirection, normal);
     float specular = - dot(reflection, viewDirection);
     specular = max(specular, 0.0);
     specular = pow(specular, 30.0);
     specular *= specularCloudsColor.r;

     vec3 specularColor = mix(vec3(1.0), athmosphereColor, fresnel);
     color += vec3(specular * specularColor);
    //final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}