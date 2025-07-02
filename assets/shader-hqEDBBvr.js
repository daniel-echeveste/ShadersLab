import{O as D,M,B as I,F as z,S as j,W as A,R as S,D as U,a as C,N as T,C as V,u as P,U as p,b as R,V as q,c as G,j as b}from"./index-Cya07Wdn.js";import"./models-CWHQNI43.js";import{u as B}from"./leva.esm-QYBXZE81.js";import{u as N}from"./Gltf-Dmp7B1eo.js";import"./constants-CnZr4Ejt.js";const W=new D(-1,1,1,-1,0,1);class Z extends I{constructor(){super(),this.setAttribute("position",new z([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new z([0,2,0,0,2,0],2))}}const O=new Z;class E{constructor(c){this._mesh=new M(O,c)}dispose(){this._mesh.geometry.dispose()}render(c){c.render(this._mesh,W)}get material(){return this._mesh.material}set material(c){this._mesh.material=c}}class H{constructor(c,a,o){this.variables=[],this.currentTextureIndex=0;let h=C;const x={passThruTexture:{value:null}},s=v(l(),x),n=new E(s);this.setDataType=function(t){return h=t,this},this.addVariable=function(t,e,r){const u=this.createShaderMaterial(e),i={name:t,initialValueTexture:r,material:u,dependencies:null,renderTargets:[],wrapS:null,wrapT:null,minFilter:T,magFilter:T};return this.variables.push(i),i},this.setVariableDependencies=function(t,e){t.dependencies=e},this.init=function(){if(o.capabilities.maxVertexTextures===0)return"No support for vertex shader textures.";for(let t=0;t<this.variables.length;t++){const e=this.variables[t];e.renderTargets[0]=this.createRenderTarget(c,a,e.wrapS,e.wrapT,e.minFilter,e.magFilter),e.renderTargets[1]=this.createRenderTarget(c,a,e.wrapS,e.wrapT,e.minFilter,e.magFilter),this.renderTexture(e.initialValueTexture,e.renderTargets[0]),this.renderTexture(e.initialValueTexture,e.renderTargets[1]);const r=e.material,u=r.uniforms;if(e.dependencies!==null)for(let i=0;i<e.dependencies.length;i++){const d=e.dependencies[i];if(d.name!==e.name){let f=!1;for(let g=0;g<this.variables.length;g++)if(d.name===this.variables[g].name){f=!0;break}if(!f)return"Variable dependency not found. Variable="+e.name+", dependency="+d.name}u[d.name]={value:null},r.fragmentShader=`
uniform sampler2D `+d.name+`;
`+r.fragmentShader}}return this.currentTextureIndex=0,null},this.compute=function(){const t=this.currentTextureIndex,e=this.currentTextureIndex===0?1:0;for(let r=0,u=this.variables.length;r<u;r++){const i=this.variables[r];if(i.dependencies!==null){const d=i.material.uniforms;for(let f=0,g=i.dependencies.length;f<g;f++){const F=i.dependencies[f];d[F.name].value=F.renderTargets[t].texture}}this.doRenderTarget(i.material,i.renderTargets[e])}this.currentTextureIndex=e},this.getCurrentRenderTarget=function(t){return t.renderTargets[this.currentTextureIndex]},this.getAlternateRenderTarget=function(t){return t.renderTargets[this.currentTextureIndex===0?1:0]},this.dispose=function(){n.dispose();const t=this.variables;for(let e=0;e<t.length;e++){const r=t[e];r.initialValueTexture&&r.initialValueTexture.dispose();const u=r.renderTargets;for(let i=0;i<u.length;i++)u[i].dispose()}};function m(t){t.defines.resolution="vec2( "+c.toFixed(1)+", "+a.toFixed(1)+" )"}this.addResolutionDefine=m;function v(t,e){e=e||{};const r=new j({name:"GPUComputationShader",uniforms:e,vertexShader:w(),fragmentShader:t});return m(r),r}this.createShaderMaterial=v,this.createRenderTarget=function(t,e,r,u,i,d){return t=t||c,e=e||a,r=r||V,u=u||V,i=i||T,d=d||T,new A(t,e,{wrapS:r,wrapT:u,minFilter:i,magFilter:d,format:S,type:h,depthBuffer:!1})},this.createTexture=function(){const t=new Float32Array(c*a*4),e=new U(t,c,a,S,C);return e.needsUpdate=!0,e},this.renderTexture=function(t,e){x.passThruTexture.value=t,this.doRenderTarget(s,e),x.passThruTexture.value=null},this.doRenderTarget=function(t,e){const r=o.getRenderTarget(),u=o.xr.enabled,i=o.shadowMap.autoUpdate;o.xr.enabled=!1,o.shadowMap.autoUpdate=!1,n.material=t,o.setRenderTarget(e),n.render(o),n.material=s,o.xr.enabled=u,o.shadowMap.autoUpdate=i,o.setRenderTarget(r)};function w(){return`void main()	{

	gl_Position = vec4( position, 1.0 );

}
`}function l(){return`uniform sampler2D passThruTexture;

void main() {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	gl_FragColor = texture2D( passThruTexture, uv );

}
`}}}var k=`uniform vec2 uResolution;\r
uniform float uTime;\r
uniform float uSize;\r
uniform sampler2D uParticlesTexture;

varying vec3 vColor;

attribute vec2 aParticlesUv;\r
attribute vec3 aColor;\r
attribute float aSize;\r
void main() {

    vec4 particle = texture(uParticlesTexture, aParticlesUv);\r
    
    vec4 modelPosition = modelMatrix * vec4(particle.xyz, 1.0);\r
    vec4 viewPosition = viewMatrix * modelPosition;\r
    vec4 projectedPosition = projectionMatrix * viewPosition;\r
    gl_Position = projectedPosition;\r
    \r
    
    float sizeIn = smoothstep(0.0, 0.1, particle.a);\r
    float sizeOut = 1.0 - smoothstep(0.7, 1.0, particle.a);\r
    float size = min(sizeIn, sizeOut);\r
    gl_PointSize = uSize * uResolution.y * aSize * size;\r
    gl_PointSize *= (1.0/ -viewPosition.z);

    
    vColor = aColor;\r
}`,L=`varying vec3 vColor;

void main() {\r
    float distanceToCenter = length(gl_PointCoord - 0.5);\r
    if(distanceToCenter > 0.5) {\r
        discard;\r
    }

    gl_FragColor = vec4(vColor, 1.0);

    #include <tonemapping_fragment>\r
    #include <colorspace_fragment>\r
}`,_=`uniform float uTime;\r
uniform float uDeltaTime;\r
uniform float uFlowFieldInfluence;\r
uniform float uFlowFieldStrength;\r
uniform float uFlowFieldFrequency;\r
uniform sampler2D uBase;

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

}\r
void main() \r
{\r
    float time = uTime * 0.02;\r
    
    vec2 uv = gl_FragCoord.xy / resolution.xy;\r
    vec4 particle = texture(uParticles, uv);\r
    vec4 base = texture(uBase, uv);\r
    

    
    if(particle.a >= 1.0)\r
    {

        particle.a = mod(particle.a, 1.0);\r
        particle.xyz = base.xyz;\r
    }\r
    
    else\r
    {\r
        
        float strength = simplexNoise4d(vec4(base.xyz * 0.2, time+1.0));\r
        float flowFieldInfluence = (uFlowFieldInfluence - 0.5) * (-2.0);\r
        strength = smoothstep(flowFieldInfluence, 1.0, strength);\r
        
        vec3 flowField = vec3(\r
            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency, time)),\r
            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 1.0, time)),\r
            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 2.0, time))\r
        );

        flowField = normalize(flowField);\r
        particle.xyz += flowField  * uDeltaTime * strength * uFlowFieldStrength;

        
        particle.a += uDeltaTime * 0.3;\r
    }\r
   

    gl_FragColor = particle;   \r
}`;function $(y){document.body.style.backgroundColor="#29191f",console.log(_);const c=N("models/ship/model.glb"),a={},o=B({size:{value:.05,min:0,max:.1},flowFieldInfluence:{value:.5,min:0,max:1},flowFieldStrength:{value:.5,min:0,max:10},flowFieldFrequency:{value:.2,min:0,max:1}}),h=P(l=>l.gl);console.log(h),P(l=>l.scene);const x={width:window.innerWidth,height:window.innerHeight},s={};s.instance=c.scene.children[0].geometry,s.count=s.instance.attributes.position.count;const n={};n.size=Math.sqrt(s.count),n.size=Math.ceil(n.size),n.computation=new H(n.size,n.size,h);const m=n.computation.createTexture();for(let l=0;l<s.count;l++){const t=l*3,e=l*4;m.image.data[e]=s.instance.attributes.position.array[t],m.image.data[e+1]=s.instance.attributes.position.array[t+1],m.image.data[e+2]=s.instance.attributes.position.array[t+2],m.image.data[e+3]=Math.random()}n.particlesVariable=n.computation.addVariable("uParticles",_,m),console.log(n.particlesVariable),n.computation.setVariableDependencies(n.particlesVariable,[n.particlesVariable]),n.particlesVariable.material.uniforms.uTime=new p(0),n.particlesVariable.material.uniforms.uDeltaTime=new p(0),n.particlesVariable.material.uniforms.uBase=new p(m),n.particlesVariable.material.uniforms.uFlowFieldInfluence=new p(o.flowFieldInfluence),n.particlesVariable.material.uniforms.uFlowFieldStrength=new p(o.flowFieldStrength),n.particlesVariable.material.uniforms.uFlowFieldFrequency=new p(o.flowFieldFrequency),n.computation.init();const v=new Float32Array(s.count*2),w=new Float32Array(s.count);for(let l=0;l<n.size;l++)for(let t=0;t<n.size;t++){const e=l*n.size+t,r=e*2,u=(t+.5)/n.size,i=(l+.5)/n.size;v[r]=u,v[r+1]=i,w[e]=Math.random()}return a.geometry=new I,a.geometry.setDrawRange(0,s.count),a.geometry.setAttribute("aParticlesUv",new R(v,2)),a.geometry.setAttribute("aColor",s.instance.attributes.color),a.geometry.setAttribute("aSize",new R(w,1)),a.material=new j({vertexShader:k,fragmentShader:L,uniforms:{uParticlesTexture:new p,uSize:new p(o.size),uResolution:new p(new q(window.innerWidth,window.innerHeight))}}),G((l,t)=>{x.width=window.innerWidth,x.height=window.innerHeight,a.material.uniforms.uResolution.value.set(x.width,x.height),console.log(t),n.particlesVariable.material.uniforms.uDeltaTime.value=Math.min(t,.01),n.particlesVariable.material.uniforms.uTime.value+=.01,n.computation.compute(),a.material.uniforms.uParticlesTexture.value=n.computation.getCurrentRenderTarget(n.particlesVariable).texture}),console.log(n.computation.getCurrentRenderTarget(n.particlesVariable).texture),b.jsx(b.Fragment,{children:b.jsx("points",{material:a.material,geometry:a.geometry})})}export{$ as default};
//# sourceMappingURL=shader-hqEDBBvr.js.map
