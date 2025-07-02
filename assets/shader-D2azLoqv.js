import{U as n,r as p,Q as v,l as s,e as m,X as h,Y as M,c as x,j as a}from"./index-CIDBdOm7.js";import{u as w}from"./leva.esm-DSVJ0qOL.js";import{C as u}from"./vanilla-307d3a93.esm-D6dXupMq.js";import{u as P}from"./Gltf-BXCBC9MC.js";import"./constants-DLw663vx.js";var f=`varying vec3 vPosition;\r
void main(){\r
    vPosition = position;\r
}`,d=`uniform float uSliceStart;\r
uniform float uSliceArc;

varying vec3 vPosition;

void main(){\r

    float angle = atan(vPosition.y,vPosition.x);\r
    angle -= uSliceStart;\r
    angle = mod(angle, PI2);\r
    if(angle > 0.0 && angle < uSliceArc){\r
        discard;\r
    }\r
   float csm_Slice;\r
  
}`;function A(){const o=w({sliceStart:{value:1,min:-Math.PI,max:Math.PI},sliceArc:{value:1.5,min:0,max:Math.PI*2}}),t={uTime:new n(0),uSliceStart:new n(o.sliceStart),uSliceArc:new n(o.sliceArc)},i={csm_Slice:{"#include <colorspace_fragment>":`
                #include <colorspace_fragment>
                
                if(!gl_FrontFacing)
                    gl_FragColor = vec4(0.75, 0.15, 0.3, 1.0);
            `}},r=p.useRef(),l=P("models/gear/gears.glb"),c=new v({color:new s("#FF0000"),roughness:.25,metalness:.5,envMapIntensity:.5}),g=new u({baseMaterial:c,vertexShader:f,fragmentShader:d,silent:!0,patchMap:i,color:new s("#858080"),roughness:.25,metalness:.5,envMapIntensity:.5,side:m,uniforms:t}),S=new u({baseMaterial:h,vertexShader:f,fragmentShader:d,uniforms:t,silent:!0,patchMap:i,depthPacking:M});return l.scene.traverse(e=>{e.isMesh&&(e.name=="outerHull"?(e.material=g,e.customDepthMaterial=S):(console.log(e.name),e.material=c),e.castShadow=!0,e.receiveShadow=!0)}),x(()=>{t.uTime.value+=.01,r.current&&(r.current.rotation.y+=.001)}),a.jsxs(a.Fragment,{children:[a.jsx("spotLight",{position:[3,2,0],intensity:400,castShadow:!0}),a.jsx("primitive",{ref:r,object:l.scene,castShadow:!0,"position-z":0,scale:1}),a.jsxs("mesh",{position:[-5,-.5,0],rotation:[0,Math.PI/2,0],receiveShadow:!0,children:[a.jsx("planeGeometry",{args:[10,10,32,32]}),a.jsx("meshStandardMaterial",{side:m,color:new s("#ffffff")})]})]})}export{A as default};
//# sourceMappingURL=shader-D2azLoqv.js.map
