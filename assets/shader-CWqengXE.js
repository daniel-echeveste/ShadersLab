import{u as g,s as c,T as u,r as n,t as d,c as h,j as r,E as j}from"./index-Cya07Wdn.js";import{P as y}from"./Placeholder-DYierU6m.js";import{u as x}from"./Gltf-Dmp7B1eo.js";import"./leva.esm-QYBXZE81.js";import"./constants-CnZr4Ejt.js";const m=t=>t===Object(t)&&!Array.isArray(t)&&typeof t!="function";function s(t,a){const i=g(o=>o.gl),e=c(u,m(t)?Object.values(t):t);return n.useLayoutEffect(()=>{a?.(e)},[a]),n.useEffect(()=>{if("initTexture"in i){let o=[];Array.isArray(e)?o=e:e instanceof d?o=[e]:m(e)&&(o=Object.values(e)),o.forEach(l=>{l instanceof d&&i.initTexture(l)})}},[i,e]),n.useMemo(()=>{if(m(t)){const o={};let l=0;for(const p in t)o[p]=e[l++];return o}else return e},[t,e])}s.preload=t=>c.preload(u,t);s.clear=t=>c.clear(u,t);function S(t){const a=x("models/LeePerrySmith/LeePerrySmith.glb");console.log("modelo"),console.log(a),a.materials["Material.002"].map=s("models/LeePerrySmith/color.jpg"),a.materials["Material.002"].normal=s("models/LeePerrySmith/normal.jpg"),a.materials["Material.002"].normalMap=s("models/LeePerrySmith/normal.jpg");const i={uTime:{value:0}};return h((e,f)=>{i.uTime.value=e.clock.elapsedTime}),a.materials["Material.002"].onBeforeCompile=e=>{console.log(e.vertexShader),e.uniforms.uTime=i.uTime,e.vertexShader=e.vertexShader.replace("#include <common>",`
            #include <common>
            
            uniform float uTime;

            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
            }
            
            `),e.vertexShader=e.vertexShader.replace("#include <begin_vertex>",`
            #include <begin_vertex>
            
            float angle = (position.y + uTime) * 0.8;
            
            mat2 rotateMatrix = get2dRotateMatrix(angle);

            transformed.xz = rotateMatrix * transformed.xz;
            
            `)},r.jsx("primitive",{object:a.scene,castShadow:!0,"position-z":-4,scale:1})}x.preload("models/LeePerrySmith/LeePerrySmith.glb");function P(){return r.jsxs(r.Fragment,{children:[r.jsx("ambientLight",{intensity:.5}),r.jsx("directionalLight",{castShadow:!0,position:[4,2,-2.25],intensity:10}),r.jsx(j,{files:"textures/environmentMaps/red_wall_4k.hdr",background:!0}),r.jsx(n.Suspense,{fallback:r.jsx(y,{"position-y":.5,scale:[2,3,2]}),children:r.jsx(S,{})}),r.jsxs("mesh",{position:[-5,0,-4],rotation:[0,Math.PI/2,0],scale:[15,15,15],receiveShadow:!0,children:[r.jsx("planeGeometry",{}),r.jsx("meshStandardMaterial",{color:"white"})]})]})}export{P as default};
//# sourceMappingURL=shader-CWqengXE.js.map
