import{r as a,c,j as n,l as i,e as h}from"./index-CIDBdOm7.js";var l=`varying vec3 vNormal;\r
varying vec3 vPosition;

void main()\r
{\r
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);\r
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    
    vNormal = modelNormal.xyz;\r
    vPosition = modelPosition.xyz;\r
}`,s=`uniform vec3 uColor;

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

void main()\r
{\r
    vec3 normal = normalize(vNormal);\r
    vec3 viewDirection = normalize(vPosition - cameraPosition);\r
    vec3 viewDirection2 = normalize(cameraPosition - vPosition);\r
    vec3 color = uColor;

    
    vec3 light = vec3(0.0);

    light += ambientLight(\r
        vec3(1.0), 
        0.03       
    );

    light += directionalLight(\r
        vec3(0.1, 0.1, 1.0), 
        1.0,                 
        normal,              
        vec3(0.0, 0.0, 3.0), 
        viewDirection,       
        20.0                 
    );

    light += pointLight(\r
        vec3(1.0, 0.1, 0.1), 
        1.0,                 
        normal,              
        vec3(0.0, 2.5, 0.0), 
        viewDirection,       
        20.0,                
        vPosition,           
        0.25                 
    );

    light += pointLight(\r
        vec3(0.1, 1.0, 0.5), 
        1.0,                 
        normal,              
        vec3(2.0, 0.0, 2.0), 
        viewDirection,       
        20.0,                
        vPosition,           
        0.2                  
    );

    color *= light;

    
    gl_FragColor = vec4(color, 1.0);\r
    #include <tonemapping_fragment>\r
    #include <colorspace_fragment>\r
}`;function m(){const r=a.useRef(),t=a.useRef(),o=a.useRef();return c((v,e)=>{r.current&&(r.current.rotation.x+=e*.3,r.current.rotation.y+=e*.3),t.current&&(t.current.rotation.x+=e*.3,t.current.rotation.y+=e*.3),o.current&&(o.current.rotation.x+=e*.3,o.current.rotation.y+=e*.3)}),n.jsxs(n.Fragment,{children:[n.jsxs("mesh",{ref:o,position:[-3,0,0],children:[n.jsx("sphereGeometry",{}),n.jsx("shaderMaterial",{vertexShader:l,fragmentShader:s,uniforms:{uColor:{value:new i("white")}}})]}),n.jsxs("mesh",{ref:t,position:[3,0,0],children:[n.jsx("torusKnotGeometry",{args:[1,.4,128,128]}),n.jsx("shaderMaterial",{vertexShader:l,fragmentShader:s,uniforms:{uColor:{value:new i("white")}}})]}),n.jsxs("mesh",{ref:r,position:[0,0,0],children:[n.jsx("boxGeometry",{}),n.jsx("shaderMaterial",{vertexShader:l,fragmentShader:s,uniforms:{uColor:{value:new i("white")}}})]}),n.jsxs("mesh",{position:[0,0,3],children:[n.jsx("planeGeometry",{}),n.jsx("meshBasicMaterial",{color:new i(.1,.1,1),side:h})]}),n.jsxs("mesh",{position:[0,2,0],scale:.2,children:[n.jsx("sphereGeometry",{}),n.jsx("meshBasicMaterial",{color:new i(1,.1,.1)})]}),n.jsxs("mesh",{position:[2,0,2],scale:.2,children:[n.jsx("sphereGeometry",{}),n.jsx("meshBasicMaterial",{color:new i(.1,1,.5)})]}),n.jsx("ambientLight",{intensity:.5}),n.jsx("directionalLight",{castShadow:!0,position:[4,2,-2.25],intensity:10}),n.jsx("pointLight",{position:[0,3,0],color:"red",intensity:10})]})}export{m as default};
//# sourceMappingURL=shader-DmQ0SvxJ.js.map
