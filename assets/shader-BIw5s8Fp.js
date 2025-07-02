import{r as c,q as u,T as f,d as a,S as v,U as r,l as d,A as g,c as p,j as n}from"./index-Cya07Wdn.js";import{u as h}from"./leva.esm-QYBXZE81.js";var x=`varying vec2 vUv;\r
varying vec3 vPosition;\r
varying vec3 vNormal;

uniform sampler2D uPerlinTexture;\r
uniform float uTime;

float random2D(vec2 value) {\r
    return fract(sin(dot(value.xy, vec2(12.9898, 78.233))) * 43785.5453123);\r
}\r
void main() {

    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    
    float glitchTime = uTime - modelPosition.y;\r
    float glitch = sin(glitchTime) + sin(glitchTime * 3.45) + sin(glitchTime * 8.76);\r
    glitch /= 3.0;\r
    smoothstep(0.3, 1.0, glitch);\r
    glitch *= 0.25;\r
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitch;\r
    modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitch;

    
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    
    
    vPosition = modelPosition.xyz;\r
    vNormal = modelNormal.xyz;

}`,T=`uniform sampler2D uPerlinTexture;\r
uniform float uTime;\r
uniform vec3 uColor;

varying vec3 vPosition;\r
varying vec3 vNormal;

void main() {

    
    vec3 normal = normalize(vNormal);\r
    if(!gl_FrontFacing) {\r
        normal *= -1.0;\r
    }\r
     
    float stripes = mod((vPosition.y - uTime * 0.03) * 20.0, 1.0);\r
    stripes = pow(stripes, 3.0);\r
    
    vec3 viewDirection = normalize(vPosition - cameraPosition);\r
    float fresnel = dot(viewDirection, normal) + 1.0;\r
    fresnel = pow(fresnel, 2.0);\r

    
    float falloff = smoothstep(0.8, 0.0,fresnel);

    
    float holographic = stripes * fresnel;\r
    holographic += fresnel * 1.25;\r
    holographic*= falloff;\r

    gl_FragColor = vec4(uColor, holographic);\r
    #include <tonemapping_fragment>\r
    #include <colorspace_fragment>

}`;function j(){const o=c.useRef(),l=h({uHolographicColor:"#0000ff"});let i=0;const s=new u,e=new f().load("./textures/perlin.png");e.wrapS=a,e.wrapT=a;const t=new v({transparent:!0,vertexShader:x,fragmentShader:T,wireframe:!1,uniforms:{uTime:new r(0),uPerlinTexture:new r(e),uColor:new r(new d(l.uHolographicColor))},depthWrite:!1,blending:g});return p((m,w)=>{i=m.clock.elapsedTime,t.uniforms.uTime.value=i,o.current.rotation.y+=.005}),n.jsxs(n.Fragment,{children:[n.jsx("mesh",{geometry:s,material:t,ref:o}),n.jsx("ambientLight",{intensity:.5}),n.jsx("directionalLight",{castShadow:!0,position:[4,2,-2.25],intensity:10})]})}export{j as default};
//# sourceMappingURL=shader-BIw5s8Fp.js.map
