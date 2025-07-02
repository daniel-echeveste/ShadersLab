import{r as u,k as s,S as h,U as o,l as c,V as m,c as v,j as r}from"./index-Cya07Wdn.js";import{u as f}from"./leva.esm-QYBXZE81.js";var g=`varying vec3 vNormal;\r
varying vec3 vPosition;\r
void main(){\r
     
     vec4 modelPosition = modelMatrix * vec4(position, 1.0);\r
     gl_Position = projectionMatrix * viewMatrix * modelPosition;

     
     vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

     
     vNormal =  modelNormal;\r
     vPosition = modelPosition.xyz;\r
}`,d=`uniform vec3 uColor;\r
uniform vec2 uResolution;\r
uniform float uRepetitions;\r
uniform float uLow;\r
uniform float uHigh;\r
uniform vec3 uLightColor;\r
uniform float uLightRepetitions;\r
uniform vec3 uHalftoneColor;\r
uniform vec3 uShadowDirection;\r
uniform vec3 uLightDirection;

varying vec3 vNormal;\r
varying vec3 vPosition;

vec3 ambientLight(vec3 lightColor, float lightIntensity)\r
{\r
    return lightColor * lightIntensity;\r
}\r
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
}\r
vec3 halftone(vec3 color, float repetitions, vec3 direction, float low, float high, vec3 halftoneColor, vec3 normal){\r
    \r
    float intensity = dot(normal, direction);\r
    intensity = smoothstep(low, high, intensity);

    vec2 uv = gl_FragCoord.xy / uResolution.y;\r
    uv *= repetitions;\r
    uv = mod(uv, 1.0);

    float point = distance(uv, vec2(0.5));\r
    point = 1.0 - step(0.5 * intensity, point);\r
   \r
    return mix(color, halftoneColor, point);\r
     \r
}

void main () {\r
    vec3 viewDirection = normalize(vPosition - cameraPosition);\r
    vec3 normal = normalize(vNormal);\r
    vec3 color = uColor; 

    
    vec3 light = vec3(0.0);\r
    light += ambientLight(\r
        vec3(1.0), 
        0.8 
    );\r
    light += directionalLight(\r
        vec3(1.0), 
        0.8, 
        normal,\r
        vec3(1.0, 1.0, 1.0), 
        viewDirection,\r
        1.0 
        \r
    );

    color *= light;\r
    
    color = halftone(\r
        color, \r
        uRepetitions, \r
        uShadowDirection,\r
        uLow, uHigh,\r
        uHalftoneColor,\r
        normal\r
    );\r
    color = halftone(\r
        color, \r
        uRepetitions, \r
        uLightDirection,\r
        uLow, uHigh,\r
        uLightColor,\r
        normal\r
    );\r
    
    gl_FragColor = vec4(color,1.0);\r
    #include <tonemapping_fragment>\r
    #include <colorspace_fragment>\r
}`;function x(){const t=u.useRef(),l=u.useRef(),a=u.useRef(),n=f({uShapeColor:{value:"#ff794d"},backgroundColor:{value:"#26132f"},uHalftoneColor:{value:"#8e19b8"},uRepetitions:{value:100,min:1,max:200,step:1},uLow:{value:-.8,min:-1,max:1,step:.1},uHigh:{value:1.5,min:0,max:2,step:.1},uShadowDirection:{value:new s(0,-1,0)},uLightDirection:{value:new s(1,1,0)},uLightColor:{value:"#ffffff"},uLightRepetitions:{value:100,min:0,max:10,step:.1}});document.body.style.backgroundColor=n.backgroundColor;const e=Math.min(window.devicePixelRatio,2),i=new h({vertexShader:g,fragmentShader:d,uniforms:{uColor:new o(new c(n.uShapeColor)),uResolution:new o(new m(window.innerWidth*e,window.innerHeight*e)),uRepetitions:new o(n.uRepetitions),uLow:new o(n.uLow),uHigh:new o(n.uHigh),uLightColor:new o(new c(n.uLightColor)),uLightRepetitions:new o(n.uLightRepetitions),uHalftoneColor:new o(new c(n.uHalftoneColor)),uLightDirection:new o(n.uLightDirection),uShadowDirection:new o(n.uShadowDirection)}});return v(()=>{i.uniforms.uResolution.value.set(window.innerWidth*e,window.innerHeight*e),t.current.rotation.x+=.02,t.current.rotation.y+=.01,l.current.rotation.x-=.014,l.current.rotation.y+=.01,a.current.rotation.x-=.015,a.current.rotation.y-=.01}),r.jsxs(r.Fragment,{children:[r.jsx("mesh",{ref:t,position:[-3,0,0],material:i,children:r.jsx("torusGeometry",{})}),r.jsx("mesh",{ref:l,position:[3,0,0],material:i,children:r.jsx("torusKnotGeometry",{args:[1,.4,128,128]})}),r.jsx("mesh",{ref:a,position:[0,0,0],material:i,children:r.jsx("boxGeometry",{})})]})}export{x as default};
//# sourceMappingURL=shader-fdQGnDEt.js.map
