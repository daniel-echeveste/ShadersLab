import{r as f,T as C,h as i,i as w,k as v,S as y,U as r,l,m as D,c as S,j as e,E as M}from"./index-Cya07Wdn.js";import{u as T}from"./leva.esm-QYBXZE81.js";var A=`varying vec2 vUv;\r
varying vec3 vPosition;\r
varying vec3 vNormal;

void main()\r
{\r
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);\r
    gl_Position = projectionMatrix * viewMatrix * modelPosition;\r
    \r
    
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;\r
    \r
    vUv = uv;\r
    vNormal = modelNormal;\r
    vPosition = modelPosition.xyz;\r
    \r
    \r
}`,P=`varying vec2 vUv;\r
varying vec3 vPosition;\r
varying vec3 vNormal;

uniform sampler2D uDayTexture;\r
uniform sampler2D uNightTexture;\r
uniform sampler2D uSpecularCloudTexture;\r
uniform vec3 uSunDirection;\r
uniform vec3 uAtmosphereDayColor;\r
uniform vec3 uAtmosphereTwilightColor;

void main()\r
{\r
    vec3 viewDirection = normalize(vPosition - cameraPosition);\r
    vec3 normal = normalize(vNormal);\r
    vec3 color = vec3(0.0);

    

    float sunOrientation = dot(normal, uSunDirection); 
    \r
    
    float dayMix = smoothstep(-0.25, 0.5, sunOrientation);\r
    vec3 dayColor = texture(uDayTexture, vUv).rgb;\r
    vec3 nightColor = texture(uNightTexture, vUv).rgb;

    color = mix(nightColor, dayColor, dayMix);

    
    vec2 specularCloudsColor = texture(uSpecularCloudTexture, vUv).rg;\r
    float cloudMix = smoothstep(0.1, 1.0, specularCloudsColor.g);\r
    cloudMix *= dayMix;\r
    color = mix(color, vec3(1.0), cloudMix);

    
    float fresnel = dot(viewDirection, normal) + 1.0;\r
    fresnel = pow(fresnel, 2.0);\r
   

    
    float atmosphereDayMix = smoothstep(-0.5, 1.0, sunOrientation);\r
    vec3 athmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);\r
    color = mix(color, athmosphereColor, fresnel * atmosphereDayMix);

    
     vec3 reflection = reflect(-uSunDirection, normal);\r
     float specular = - dot(reflection, viewDirection);\r
     specular = max(specular, 0.0);\r
     specular = pow(specular, 30.0);\r
     specular *= specularCloudsColor.r;

     vec3 specularColor = mix(vec3(1.0), athmosphereColor, fresnel);\r
     color += vec3(specular * specularColor);\r
    
    gl_FragColor = vec4(color, 1.0);\r
    #include <tonemapping_fragment>\r
    #include <colorspace_fragment>\r
}`,j=`uniform vec3 uSunDirection;\r
uniform vec3 uAtmosphereDayColor;\r
uniform vec3 uAtmosphereTwilightColor;

varying vec3 vNormal;\r
varying vec3 vPosition;

void main()\r
{\r
    vec3 viewDirection = normalize(vPosition - cameraPosition);\r
    vec3 normal = normalize(vNormal);\r
    vec3 color = vec3(0.0);

    
    float sunOrientation = dot(uSunDirection, normal);

    
    float atmosphereDayMix = smoothstep(- 0.5, 1.0, sunOrientation);\r
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);\r
    color = mix(color, atmosphereColor, atmosphereDayMix);

    
    float edgeAlpha = dot(viewDirection, normal);\r
    edgeAlpha = smoothstep(0.0, 0.5, edgeAlpha);

    float dayAlpha = smoothstep(-0.5, 0.0, sunOrientation);\r
    float alpha = edgeAlpha * dayAlpha;   
    gl_FragColor = vec4(color, alpha);\r
    #include <tonemapping_fragment>\r
    #include <colorspace_fragment>\r
}`,N=`varying vec3 vNormal;\r
varying vec3 vPosition;

void main()\r
{\r
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);\r
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    
    vNormal = modelNormal;\r
    vPosition = modelPosition.xyz;\r
}`;function b(_){const s=f.useRef(),t=f.useRef();document.body.style.backgroundColor="#000011";const a=new C,u=a.load("./textures/earth/day.jpg");u.colorSpace=i,u.anisotropy=8;const c=a.load("./textures/earth/night.jpg");c.colorSpace=i,c.anisotropy=8;const m=a.load("./textures/earth/specularClouds.jpg");m.colorSpace=i,m.anisotropy=8;const p=a.load("./textures/sun/2k_sun.jpg");p.colorSpace=i,p.anisotropy=8;const n=T({usunSphericalPhi:{value:Math.PI*.5,min:0,max:Math.PI,step:.01},usunSphericalTheta:{value:-1.4,min:-Math.PI,max:Math.PI,step:.01},uAtmosphereDayColor:{value:"#00aaff"},uAtmosphereTwilightColor:{value:"#ff6600"}}),h=new w(1,n.usunSphericalPhi,n.usunSphericalTheta),o=new v;o.setFromSpherical(h),console.log(o);const d=new y({vertexShader:A,fragmentShader:P,uniforms:{uDayTexture:new r(u),uNightTexture:new r(c),uSpecularCloudTexture:new r(m),uSunDirection:new r(new v(o)),uAtmosphereDayColor:new r(new l(n.uAtmosphereDayColor)),uAtmosphereTwilightColor:new r(new l(n.uAtmosphereTwilightColor))}}),x=new y({vertexShader:N,fragmentShader:j,uniforms:{uSunDirection:new r(new v(o)),uAtmosphereDayColor:new r(new l(n.uAtmosphereDayColor)),uAtmosphereTwilightColor:new r(new l(n.uAtmosphereTwilightColor))},side:D,transparent:!0}),g=()=>{o.setFromSpherical(h),t.current&&t.current.position.copy(o).multiplyScalar(5),d.uniforms.uSunDirection.value.copy(o),x.uniforms.uSunDirection.value.copy(o)};return g(),S(()=>{s.current&&(s.current.rotation.y+=.001),t.current&&(t.current.rotation.y+=.002,g())}),e.jsxs(e.Fragment,{children:[e.jsx(M,{backgroundBlurriness:0,files:"textures/sun/stars.jpg",background:!0,encoding:void 0}),e.jsx("mesh",{ref:s,material:d,children:e.jsx("sphereGeometry",{args:[3,64,64]})}),e.jsx("mesh",{material:x,children:e.jsx("sphereGeometry",{args:[3.1,64,64]})}),e.jsxs("mesh",{ref:t,children:[e.jsx("sphereGeometry",{args:[.2,64,64]}),e.jsx("meshBasicMaterial",{color:"yellow",map:p})]})]})}export{b as default};
//# sourceMappingURL=shader-ByzzdE9a.js.map
