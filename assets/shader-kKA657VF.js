import{U as a,l as T,$ as B,X as N,Y as D,a0 as U,c as E,j as W}from"./index-CIDBdOm7.js";import"./models-dlwVtpIb.js";import{u as G}from"./leva.esm-DSVJ0qOL.js";import{C as M}from"./vanilla-307d3a93.esm-D6dXupMq.js";import"./Gltf-BXCBC9MC.js";import"./constants-DLw663vx.js";function O(r,e=1e-4){e=Math.max(e,Number.EPSILON);const c={},x=r.getIndex(),w=r.getAttribute("position"),v=x?x.count:w.count;let u=0;const f=Object.keys(r.attributes),z={},m={},S=[],q=["getX","getY","getZ","getW"],j=["setX","setY","setZ","setW"];for(let o=0,s=f.length;o<s;o++){const t=f[o],n=r.attributes[t];z[t]=new n.constructor(new n.array.constructor(n.count*n.itemSize),n.itemSize,n.normalized);const d=r.morphAttributes[t];d&&(m[t]||(m[t]=[]),d.forEach((i,l)=>{const p=new i.array.constructor(i.count*i.itemSize);m[t][l]=new i.constructor(p,i.itemSize,i.normalized)}))}const I=e*.5,_=Math.log10(1/e),F=Math.pow(10,_),X=I*F;for(let o=0;o<v;o++){const s=x?x.getX(o):o;let t="";for(let n=0,d=f.length;n<d;n++){const i=f[n],l=r.getAttribute(i),p=l.itemSize;for(let h=0;h<p;h++)t+=`${~~(l[q[h]](s)*F+X)},`}if(t in c)S.push(c[t]);else{for(let n=0,d=f.length;n<d;n++){const i=f[n],l=r.getAttribute(i),p=r.morphAttributes[i],h=l.itemSize,Y=z[i],k=m[i];for(let y=0;y<h;y++){const P=q[y],C=j[y];if(Y[C](u,l[P](s)),p)for(let g=0,Z=p.length;g<Z;g++)k[g][C](u,p[g][P](s))}}c[t]=u,S.push(u),u++}}const b=r.clone();for(const o in r.attributes){const s=z[o];if(b.setAttribute(o,new s.constructor(s.array.slice(0,u*s.itemSize),s.itemSize,s.normalized)),o in m)for(let t=0;t<m[o].length;t++){const n=m[o][t];b.morphAttributes[o][t]=new n.constructor(n.array.slice(0,u*n.itemSize),n.itemSize,n.normalized)}}return b.setIndex(S),b}var A=`uniform float uTime;\r
uniform float uPositionFrequency;\r
uniform float uTimeFrequency;\r
uniform float uStrength;\r
uniform float uWarpPositionFrequency;\r
uniform float uWarpTimeFrequency;\r
uniform float uWarpStrength;

attribute vec3 tangent;

varying vec2 vUv;\r
varying float vWobble;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

vec4 grad4(float j, vec4 ip){
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

  return p;
}

float simplexNoise4d(vec4 v){
  const vec2  C = vec2( 0.138196601125010504,  
                        0.309016994374947451); 

  vec4 i  = floor(v + dot(v, C.yyyy) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

  vec4 i0;

  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );

  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;

  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;

  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  
  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

  i = mod(i, 289.0); 
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

}

float getWobble(vec3 position){

    vec3 warpedPosition = position;\r
    warpedPosition += simplexNoise4d(vec4(\r
        position * uWarpPositionFrequency,\r
        uTime * uWarpTimeFrequency\r
        )) * uWarpStrength;\r
    return simplexNoise4d(vec4(\r
        warpedPosition * uPositionFrequency, \r
        uTime * uTimeFrequency\r
        )) * uStrength;\r
}\r
void main()\r
{\r
    vec3 biTangent = cross(normal, tangent.xyz);

     
     float shift = 0.01;\r
     vec3 positionA = csm_Position +  tangent.xyz * shift;\r
     vec3 positionB = csm_Position + biTangent * shift;

    
    float wobble = getWobble(csm_Position);      \r
    csm_Position += normal * wobble;\r
    positionA += getWobble(positionA) * normal;\r
    positionB += getWobble(positionB) * normal;

    
    vec3 toA = normalize(positionA - csm_Position);\r
    vec3 toB = normalize(positionB - csm_Position);\r
    csm_Normal = cross(toB, toA);\r
    
    vUv = uv;\r
    vWobble = wobble/uStrength;\r
}`,R=`varying float vWobble;\r
uniform vec3 ballColor;\r
uniform vec3 ballColor2;\r
void main()\r
{\r
    float colorMixed = smoothstep(-1.0, 1.0, vWobble);\r
    csm_DiffuseColor.rgb = mix(ballColor, ballColor2, colorMixed);

    
    
    
}`;function Q(r){const e=G({ballColor:{value:"#0000ff"},ballColor2:{value:"#ff0000"},metalness:{value:0,min:0,max:1},roughness:{value:1,min:0,max:1},transmission:{value:0,min:0,max:1},thickness:{value:.5,min:0,max:1},ior:{value:1.5,min:1,max:2},uPositionFrequency:{value:.5,min:0,max:2},uTimeFrequency:{value:.3,min:0,max:2},uStrength:{value:.3,min:0,max:1},uWarpPositionFrequency:{value:.38,min:0,max:2},uWarpTimeFrequency:{value:.12,min:0,max:2},uWarpStrength:{value:1.7,min:0,max:2}}),c={uTime:new a(0),uPositionFrequency:new a(e.uPositionFrequency),uTimeFrequency:new a(e.uTimeFrequency),uStrength:new a(e.uStrength),uWarpPositionFrequency:new a(e.uWarpPositionFrequency),uWarpTimeFrequency:new a(e.uWarpTimeFrequency),uWarpStrength:new a(e.uWarpStrength),ballColor:new a(new T(e.ballColor)),ballColor2:new a(new T(e.ballColor2))},x=new M({baseMaterial:new B,vertexShader:A,fragmentShader:R,silent:!0,metalness:e.metalness,roughness:e.roughness,transmission:e.transmission,thickness:e.thickness,ior:e.ior,transparent:!0,wireframe:!1,uniforms:c}),w=new M({baseMaterial:new N,vertexShader:A,uniforms:c,silent:!0,depthPacking:D});let v=new U(2.5,50);return v=O(v),v.computeTangents(),E(()=>{c.uTime.value+=.01}),W.jsx(W.Fragment,{children:W.jsx("mesh",{castShadow:!0,material:x,customDepthMaterial:w,geometry:v})})}export{Q as default};
//# sourceMappingURL=shader-kKA657VF.js.map
