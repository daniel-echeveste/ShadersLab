import{r as v,u as c,Z as s,V as g,c as u,T as m,S as f,e as d,l as r,P as x,v as y,j as t}from"./index-Cya07Wdn.js";import{u as p}from"./leva.esm-QYBXZE81.js";var P=`uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallIterations;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

vec4 permute(vec4 x)\r
{\r
    return mod(((x*34.0)+1.0)*x, 289.0);\r
}\r
vec4 taylorInvSqrt(vec4 r)\r
{\r
    return 1.79284291400159 - 0.85373472095314 * r;\r
}\r
vec3 fade(vec3 t)\r
{\r
    return t*t*t*(t*(t*6.0-15.0)+10.0);\r
}

float perlinClassic3D(vec3 P)\r
{\r
    vec3 Pi0 = floor(P); 
    vec3 Pi1 = Pi0 + vec3(1.0); 
    Pi0 = mod(Pi0, 289.0);\r
    Pi1 = mod(Pi1, 289.0);\r
    vec3 Pf0 = fract(P); 
    vec3 Pf1 = Pf0 - vec3(1.0); 
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\r
    vec4 iy = vec4(Pi0.yy, Pi1.yy);\r
    vec4 iz0 = Pi0.zzzz;\r
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);\r
    vec4 ixy0 = permute(ixy + iz0);\r
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;\r
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;\r
    gx0 = fract(gx0);\r
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\r
    vec4 sz0 = step(gz0, vec4(0.0));\r
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);\r
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;\r
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;\r
    gx1 = fract(gx1);\r
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\r
    vec4 sz1 = step(gz1, vec4(0.0));\r
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);\r
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\r
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\r
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\r
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\r
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\r
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\r
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\r
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\r
    g000 *= norm0.x;\r
    g010 *= norm0.y;\r
    g100 *= norm0.z;\r
    g110 *= norm0.w;\r
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\r
    g001 *= norm1.x;\r
    g011 *= norm1.y;\r
    g101 *= norm1.z;\r
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);\r
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\r
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\r
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\r
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\r
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\r
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\r
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);\r
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\r
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\r
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); \r
    return 2.2 * n_xyz;\r
}

float waveElevation(vec3 position)
{
    float elevation = sin(position.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                      sin(position.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
                      uBigWavesElevation;

    for(float i = 1.0; i <= uSmallIterations; i++)
    {
        elevation -= abs(perlinClassic3D(vec3(position.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
    }

    return elevation;
}

void main()
{
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float shift = 0.01;
    vec3 modelPositionA = modelPosition.xyz + vec3(shift, 0.0, 0.0);
    vec3 modelPositionB = modelPosition.xyz + vec3(0.0, 0.0, - shift);

    
    float elevation = waveElevation(modelPosition.xyz);
    float elevationA = waveElevation(modelPositionA);
    float elevationB = waveElevation(modelPositionB);
    
    modelPosition.y += elevation;
    modelPositionA.y += elevationA;
    modelPositionB.y += elevationB;

    
    vec3 toA = normalize(modelPositionA - modelPosition.xyz);
    vec3 toB = normalize(modelPositionB - modelPosition.xyz);
    vec3 computedNormal = cross(toA, toB);

    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    
    vElevation = elevation;
    vNormal = computedNormal;
    vPosition = modelPosition.xyz;
}`,h=`uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

vec3 ambientLight(vec3 lightColor, float lightIntensity)\r
{\r
    return lightColor * lightIntensity;\r
}
vec3 directionalLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower)\r
{\r
    vec3 lightDirection = normalize(lightPosition);\r
    vec3 lightReflection = reflect(-lightDirection, normal);\r
    
    float shading = dot(normal, lightDirection);\r
    shading = max(0.0, shading);\r
    \r
    
    float specular = -dot(lightReflection, viewDirection);\r
    specular = max(0.0, specular);\r
    specular = pow(specular, specularPower);\r
    return lightColor * lightIntensity * (shading + specular);\r
}
vec3 pointLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower, vec3 position, float lightDecay)\r
{\r
    vec3 lightDelta = lightPosition - position;\r
    float lightDistance = length(lightDelta);\r
    vec3 lightDirection = normalize(lightDelta);\r
    vec3 lightReflection = reflect(- lightDirection, normal);

    
    float shading = dot(normal, lightDirection);\r
    shading = max(0.0, shading);

    
    float specular = - dot(lightReflection, viewDirection);\r
    specular = max(0.0, specular);\r
    specular = pow(specular, specularPower);

    
    float decay = 1.0 - lightDistance * lightDecay;\r
    decay = max(0.0, decay);

    return lightColor * lightIntensity * decay * (shading + specular);\r
}

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);

    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    mixStrength = smoothstep(0.0, 1.0, mixStrength);
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    vec3 light = vec3(0.0);
    light += pointLight(
        vec3(1.0),
        0.04,
        normal,
        vec3(0.0,0.25, 0.0),
        viewDirection,
        30.0,
        vPosition,
        0.1
    );
    light += pointLight(
        vec3(1.0),
        1.15,
        normal,
        vec3(0.0,0.25, 0.0),
        viewDirection,
        30.0,
        vPosition,
        0.15
    );
    light += pointLight(
        vec3(1.0),
        10.0,
        normal,
        vec3(0.0,0.25, 0.0),
        viewDirection,
        30.0,
        vPosition,
        0.25
    );
    
    color *= light;
    
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}`;function W(){document.body.style.backgroundColor="#000000";const l=v.useRef(),a=c(i=>i.gl);a.toneMapping=s;const e=p({uDepthColor:"#ff4000",uSurfaceColor:"#151c37",uBigWavesElevation:{value:.9,min:0,max:1,step:.1},uBigWavesFrequency:{value:new g(.6,.25)},uBigWavesSpeed:{value:.4,min:0,max:10,step:.1},uSmallWavesElevation:{value:.15},uSmallWavesFrequency:{value:3},uSmallWavesSpeed:{value:.2},uSmallIterations:{value:4},uColorOffset:{value:.925,step:.001},uColorMultiplier:{value:1,step:.001}});console.log(e),u((i,S)=>{n.uniforms.uTime.value=i.clock.elapsedTime}),new m().load("/textures/can-flag.jpg");const n=new f({vertexShader:P,fragmentShader:h,side:d,uniforms:{uTime:{value:0},uBigWavesElevation:{value:e.uBigWavesElevation},uBigWavesFrequency:{value:e.uBigWavesFrequency},uBigWavesSpeed:{value:e.uBigWavesSpeed},uDepthColor:{value:new r(e.uDepthColor)},uSurfaceColor:{value:new r(e.uSurfaceColor)},uColorOffset:{value:e.uColorOffset},uColorMultiplier:{value:e.uColorMultiplier},uSmallWavesElevation:{value:e.uSmallWavesElevation},uSmallWavesFrequency:{value:e.uSmallWavesFrequency},uSmallWavesSpeed:{value:e.uSmallWavesSpeed},uSmallIterations:{value:e.uSmallIterations}}}),o=new x(2,2,512,512);return o.deleteAttribute("normal"),o.deleteAttribute("uv"),y({shaderMaterial:n}),t.jsx(t.Fragment,{children:t.jsx("mesh",{geometry:o,material:n,useRef:l,rotation:[Math.PI/2,0,0],position:[0,0,0],scale:14})})}export{W as default};
//# sourceMappingURL=shader-3fitIjGD.js.map
