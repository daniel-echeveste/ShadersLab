import{j as e,P as l,T as u,d as i,S as v,e as c,U as s,c as f,E as p,r as d}from"./index-CIDBdOm7.js";import{P as x}from"./Placeholder-DMQEmhkP.js";import{u as a}from"./Gltf-BXCBC9MC.js";import"./leva.esm-DSVJ0qOL.js";import"./constants-DLw663vx.js";function g(n){const r=a("models/coffeeMug/bakedModel.glb");return console.log(n),e.jsx("primitive",{object:r.scene,castShadow:!0,...n})}a.preload("models/LeePerrySmith/LeePerrySmith.glb");var w=`varying vec2 vUv;\r
uniform sampler2D uPerlinTexture;\r
uniform float uTime;

vec2 rotate2D(vec2 value, float angle)\r
{\r
    float s = sin(angle);\r
    float c = cos(angle);\r
    mat2 m = mat2(c, s, -s, c);\r
    return m * value;\r
}\r
void main(){\r

    vec3 newPosition = position;

    
    float twistPerlin = texture(\r
        uPerlinTexture,\r
        vec2(0.5, uv.y * 0.5 -uTime * 0.01)\r
        ).r;\r
    float angle = twistPerlin * 10.0;\r
    newPosition.xz = rotate2D(newPosition.xz, angle);

    
    vec2 windOffset = vec2(\r
        texture(uPerlinTexture, vec2(0.25, uTime * 0.01)).r -0.5,\r
        texture(uPerlinTexture, vec2(0.75, uTime * 0.01)).r -0.5\r
    );\r
    windOffset *= 10.0 * pow( uv.y,2.0); \r
    newPosition.xz += windOffset;

    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition,1.0);

    
    vUv = uv; 

}`,T=`uniform sampler2D uPerlinTexture;\r
uniform float uTime;

varying vec2 vUv;\r
void main() {

    
    vec2 smokeUv = vUv;\r
    smokeUv.x *= 0.5;\r
    smokeUv.y *= 0.3;\r
    smokeUv -= uTime * 0.03;

     
    float smoke = texture(uPerlinTexture, smokeUv).r;

    
    smoke = smoothstep(0.4, 1.0, smoke);

    
    smoke *= smoothstep(0.0, 0.1, vUv.x);\r
    smoke *= smoothstep(1.0, 0.9, vUv.x);\r
    smoke *= smoothstep(0.0, 0.1, vUv.y);\r
    smoke *= smoothstep(1.0, 0.4, vUv.y);\r
    
    gl_FragColor = vec4(1.0, 1.0, 1.0, smoke);\r
    #include <tonemapping_fragment>\r
    #include <colorspace_fragment>

}`;function M(){let n=0;const r=new l(1,1,16,64);r.scale(.75,3,.75);const t=new u().load("./textures/perlin.png");t.wrapS=i,t.wrapT=i;const o=new v({transparent:!0,depthWrite:!1,vertexShader:w,fragmentShader:T,wireframe:!1,side:c,uniforms:{uTime:new s(0),uPerlinTexture:new s(t)}});return f((m,h)=>{n=m.clock.elapsedTime,o.uniforms.uTime.value=n}),e.jsxs(e.Fragment,{children:[e.jsx("mesh",{geometry:r,material:o,position:[0,1.2,0]}),e.jsx("ambientLight",{intensity:.5}),e.jsx("directionalLight",{castShadow:!0,position:[4,2,-2.25],intensity:10}),e.jsx(p,{files:"textures/environmentMaps/wood-cabin.hdr",background:!0}),e.jsx(d.Suspense,{fallback:e.jsx(x,{"position-y":.5,scale:[2,3,2]}),children:e.jsx(g,{"position-z":0,"position-y":-1,scale:.5})})]})}export{M as default};
//# sourceMappingURL=shader-Eri8kJyA.js.map
