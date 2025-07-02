import{S as g,A as y,V as f,U as p,l as d,c as h,F as w,B as z,b as C,j as m}from"./index-CIDBdOm7.js";import{g as P}from"./index-CMFigVup.js";import"./models-dlwVtpIb.js";import{u as b,b as a}from"./leva.esm-DSVJ0qOL.js";import{u as A}from"./Gltf-BXCBC9MC.js";import"./constants-DLw663vx.js";var S=`uniform vec2 uResolution;\r
uniform float uSize;\r
uniform float uProgress;\r
uniform vec3 uColorA;\r
uniform vec3 uColorB;

attribute vec3 aPositionTarget;\r
attribute float aSize;

varying vec3 vColor;\r
vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }\r
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float simplexNoise3d(vec3 v)\r
{\r
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\r
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    
    vec3 i  = floor(v + dot(v, C.yyy) );\r
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    
    vec3 g = step(x0.yzx, x0.xyz);\r
    vec3 l = 1.0 - g;\r
    vec3 i1 = min( g.xyz, l.zxy );\r
    vec3 i2 = max( g.xyz, l.zxy );

    
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;\r
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;\r
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;

    
    i = mod(i, 289.0 ); \r
    vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))  + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    
    
    float n_ = 1.0/7.0; 
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  

    vec4 x_ = floor(j * ns.z);\r
    vec4 y_ = floor(j - 7.0 * x_ );    

    vec4 x = x_ *ns.x + ns.yyyy;\r
    vec4 y = y_ *ns.x + ns.yyyy;\r
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );\r
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;\r
    vec4 s1 = floor(b1)*2.0 + 1.0;\r
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\r
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);\r
    vec3 p1 = vec3(a0.zw,h.y);\r
    vec3 p2 = vec3(a1.xy,h.z);\r
    vec3 p3 = vec3(a1.zw,h.w);

    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\r
    p0 *= norm.x;\r
    p1 *= norm.y;\r
    p2 *= norm.z;\r
    p3 *= norm.w;

    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\r
    m = m * m;\r
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );\r
}\r
void main ()\r
{\r
    
    float noiseOrigin = simplexNoise3d(position * 0.2);\r
    float noisTarget = simplexNoise3d(aPositionTarget * 0.2);\r
    float noise = mix(noiseOrigin, noisTarget, uProgress);\r
    noise = smoothstep(-1.0, 1.0 ,noise);\r
    float duration = 0.4;\r
    float delay = (1.0 - duration) * noise;\r
    float end = delay + duration;\r
    float progress = smoothstep(delay, end, uProgress);\r
    vec3 mixedPosition = mix(position, aPositionTarget, progress);

    
    vec4 modelPosition = modelMatrix * vec4(mixedPosition, 1.0);\r
    vec4 viewPosition = viewMatrix * modelPosition;\r
    vec4 projectedPosition = projectionMatrix * viewPosition;\r
    gl_Position = projectedPosition;\r
    
    gl_PointSize = uSize * uResolution.y * aSize;\r
    gl_PointSize *= (1.0 / -viewPosition.z);

    
    vColor = mix(uColorA, uColorB, noise);\r
}`,_=`varying vec3 vColor;

void main(){

    vec2 uv = gl_PointCoord;\r
    float distanceToCenter = length(uv - 0.5); 
    float alpha = 0.05 / distanceToCenter -0.1;

    vec3 color = vec3(1.0);\r
    gl_FragColor = vec4(vColor, alpha);

    #include <tonemapping_fragment>\r
    #include <colorspace_fragment>   \r
}`;function H(T){const i=o=>{console.log(o),n.geometry.attributes.position=n.positions[n.index],n.geometry.attributes.aPositionTarget=n.positions[o],P.fromTo(n.material.uniforms.uProgress,{value:0},{value:1,duration:3,ease:"linear"}),n.index=o},s={width:window.innerWidth,height:window.innerHeight},n={},l=b({progress:{value:0,min:0,max:1},colorA:{value:"#ff7300"},colorB:{value:"#0091ff"},shape1:a(()=>{i(0)}),shape2:a(()=>{i(1)}),shape3:a(()=>{i(2)}),shape4:a(()=>{i(3)})});n.material=new g({vertexShader:S,fragmentShader:_,blending:y,depthWrite:!1,uniforms:{uSize:{value:.2},uResolution:{value:new f(window.innerWidth,window.innerHeight)},uProgress:{value:l.progress},uColorA:new p(new d(l.colorA)),uColorB:new p(new d(l.colorB))}}),h(()=>{s.width=window.innerWidth,s.height=window.innerHeight,n.material.uniforms.uResolution.value.set(s.width,s.height)});const c=A("models/models.glb").scene.children.map(o=>o.geometry.attributes.position);console.log(c),n.maxCount=0,n.index=0;for(const o of c)o.count>n.maxCount&&(n.maxCount=o.count);n.positions=[];for(const o of c){const r=o.array,t=new Float32Array(n.maxCount*3);for(let v=0;v<n.maxCount;v++){const e=v*3;if(e<r.length)t[e]=r[e],t[e+1]=r[e+1],t[e+2]=r[e+2];else{const x=Math.floor(o.count*Math.random())*3;t[e]=r[x],t[e+1]=r[x+1],t[e+2]=r[x+2]}}n.positions.push(new w(t,3))}const u=new Float32Array(n.maxCount);for(let o=0;o<n.maxCount;o++)u[o]=Math.random();return n.geometry=new z,n.geometry.setAttribute("position",n.positions[n.index]),n.geometry.setAttribute("aPositionTarget",n.positions[3]),n.geometry.setAttribute("aSize",new C(u,1)),m.jsx(m.Fragment,{children:m.jsx("points",{material:n.material,geometry:n.geometry})})}export{H as default};
//# sourceMappingURL=shader-CmqqbqRh.js.map
