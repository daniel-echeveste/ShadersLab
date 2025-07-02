import{k as f,S as F,n as L,m as V,M as O,o as G,r as m,_ as j,u as N,T as W,j as P,l as H,p as Z,i as K,A as X,U as y,V as $,B as Y,b as C}from"./index-Cya07Wdn.js";import{g as q}from"./index-CMFigVup.js";import{v as J}from"./constants-CnZr4Ejt.js";var Q=Object.defineProperty,ee=(e,t,o)=>t in e?Q(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,B=(e,t,o)=>(ee(e,typeof t!="symbol"?t+"":t,o),o);const M={uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new f},up:{value:new f(0,1,0)}},vertexShader:`
      uniform vec3 sunPosition;
      uniform float rayleigh;
      uniform float turbidity;
      uniform float mieCoefficient;
      uniform vec3 up;

      varying vec3 vWorldPosition;
      varying vec3 vSunDirection;
      varying float vSunfade;
      varying vec3 vBetaR;
      varying vec3 vBetaM;
      varying float vSunE;

      // constants for atmospheric scattering
      const float e = 2.71828182845904523536028747135266249775724709369995957;
      const float pi = 3.141592653589793238462643383279502884197169;

      // wavelength of used primaries, according to preetham
      const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
      // this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
      // (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
      const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

      // mie stuff
      // K coefficient for the primaries
      const float v = 4.0;
      const vec3 K = vec3( 0.686, 0.678, 0.666 );
      // MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
      const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

      // earth shadow hack
      // cutoffAngle = pi / 1.95;
      const float cutoffAngle = 1.6110731556870734;
      const float steepness = 1.5;
      const float EE = 1000.0;

      float sunIntensity( float zenithAngleCos ) {
        zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
        return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
      }

      vec3 totalMie( float T ) {
        float c = ( 0.2 * T ) * 10E-18;
        return 0.434 * c * MieConst;
      }

      void main() {

        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        vWorldPosition = worldPosition.xyz;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        gl_Position.z = gl_Position.w; // set z to camera.far

        vSunDirection = normalize( sunPosition );

        vSunE = sunIntensity( dot( vSunDirection, up ) );

        vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

        float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

      // extinction (absorbtion + out scattering)
      // rayleigh coefficients
        vBetaR = totalRayleigh * rayleighCoefficient;

      // mie coefficients
        vBetaM = totalMie( turbidity ) * mieCoefficient;

      }
    `,fragmentShader:`
      varying vec3 vWorldPosition;
      varying vec3 vSunDirection;
      varying float vSunfade;
      varying vec3 vBetaR;
      varying vec3 vBetaM;
      varying float vSunE;

      uniform float mieDirectionalG;
      uniform vec3 up;

      const vec3 cameraPos = vec3( 0.0, 0.0, 0.0 );

      // constants for atmospheric scattering
      const float pi = 3.141592653589793238462643383279502884197169;

      const float n = 1.0003; // refractive index of air
      const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

      // optical length at zenith for molecules
      const float rayleighZenithLength = 8.4E3;
      const float mieZenithLength = 1.25E3;
      // 66 arc seconds -> degrees, and the cosine of that
      const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

      // 3.0 / ( 16.0 * pi )
      const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
      // 1.0 / ( 4.0 * pi )
      const float ONE_OVER_FOURPI = 0.07957747154594767;

      float rayleighPhase( float cosTheta ) {
        return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
      }

      float hgPhase( float cosTheta, float g ) {
        float g2 = pow( g, 2.0 );
        float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
        return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
      }

      void main() {

        vec3 direction = normalize( vWorldPosition - cameraPos );

      // optical length
      // cutoff angle at 90 to avoid singularity in next formula.
        float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
        float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
        float sR = rayleighZenithLength * inverse;
        float sM = mieZenithLength * inverse;

      // combined extinction factor
        vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

      // in scattering
        float cosTheta = dot( direction, vSunDirection );

        float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
        vec3 betaRTheta = vBetaR * rPhase;

        float mPhase = hgPhase( cosTheta, mieDirectionalG );
        vec3 betaMTheta = vBetaM * mPhase;

        vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
        Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

      // nightsky
        float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
        float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
        vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
        vec3 L0 = vec3( 0.1 ) * Fex;

      // composition + solar disc
        float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
        L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

        vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

        vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

        gl_FragColor = vec4( retColor, 1.0 );

      #include <tonemapping_fragment>
      #include <${J>=154?"colorspace_fragment":"encodings_fragment"}>

      }
    `},I=new F({name:"SkyShader",fragmentShader:M.fragmentShader,vertexShader:M.vertexShader,uniforms:L.clone(M.uniforms),side:V,depthWrite:!1});let _=class extends O{constructor(){super(new G(1,1,1),I)}};B(_,"SkyShader",M);B(_,"material",I);function te(e,t,o=new f){const n=Math.PI*(e-.5),u=2*Math.PI*(t-.5);return o.x=Math.cos(u),o.y=Math.sin(n),o.z=Math.sin(u),o}const ne=m.forwardRef(({inclination:e=.6,azimuth:t=.1,distance:o=1e3,mieCoefficient:n=.005,mieDirectionalG:u=.8,rayleigh:S=.5,turbidity:E=10,sunPosition:a=te(e,t),...r},s)=>{const d=m.useMemo(()=>new f().setScalar(o),[o]),[p]=m.useState(()=>new _);return m.createElement("primitive",j({object:p,ref:s,"material-uniforms-mieCoefficient-value":n,"material-uniforms-mieDirectionalG-value":u,"material-uniforms-rayleigh-value":S,"material-uniforms-sunPosition-value":a,"material-uniforms-turbidity-value":E,scale:d},r))});var oe=`uniform sampler2D uTexture;\r
uniform vec3 uColor ;\r
void main()\r
{\r
    float textureAlpha = texture(uTexture, gl_PointCoord).r;\r
    vec4 textureColor = texture(uTexture, gl_PointCoord);

    
    gl_FragColor = vec4(uColor, textureAlpha);\r
    
    #include <tonemapping_fragment>\r
    #include <colorspace_fragment>\r
}`,ie=`uniform float uSize;\r
uniform vec2 uResolution;\r
uniform float uProgress;

attribute float aSize;\r
attribute float aTimeMultiplayer;\r
float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)\r
{\r
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);\r
}

void main(){\r
    float progress = uProgress * aTimeMultiplayer;\r
    vec3 newPosition = position;\r
    \r
    
    float explodingProgress = remap(progress, 0.0, 1.0, 0.0, 1.5);\r
    explodingProgress = clamp(explodingProgress, 0.0, 1.0);\r
    explodingProgress = 1.0 - pow(1.0 - explodingProgress, 3.0);\r
    newPosition *= explodingProgress;

    
    float fallingProgress = remap(progress, 0.1, 1.0, 0.0, 1.0);\r
    fallingProgress = clamp(fallingProgress, 0.0, 1.0);\r
    fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);\r
    newPosition.y -= fallingProgress * 0.3;

    
    float sizeOpeningProgress = remap(progress, 0.0, 0.125,0.0,1.0);\r
    float sizeClosingProgress = remap(progress,0.125, 1.125,1.0, 0.0);         \r
    float sizeProgress = min(sizeOpeningProgress, sizeClosingProgress);

    
    float twinklingProgress = remap(progress, 0.0, 0.125,0.0,1.0);\r
    twinklingProgress= clamp(twinklingProgress, 0.0, 1.0);\r
    float sizeTwinkling = sin(progress * 30.0) * 0.5 + 0.5; \r
    sizeTwinkling = 1.0 - sizeTwinkling * twinklingProgress;

    
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0) ;\r
    vec4 viewPosition = viewMatrix * modelPosition;\r
    gl_Position = projectionMatrix * viewPosition;

    
    gl_PointSize = uSize * uResolution.y * aSize * sizeProgress * sizeTwinkling;\r
    gl_PointSize *= 1.0 / -viewPosition.z; 
    \r
    if(gl_PointSize<1.0)\r
        gl_Position= vec4(9999.9);\r
}`;const i=[];for(let e=0;e<256;++e)i.push((e+256).toString(16).slice(1));function re(e,t=0){return(i[e[t+0]]+i[e[t+1]]+i[e[t+2]]+i[e[t+3]]+"-"+i[e[t+4]]+i[e[t+5]]+"-"+i[e[t+6]]+i[e[t+7]]+"-"+i[e[t+8]]+i[e[t+9]]+"-"+i[e[t+10]]+i[e[t+11]]+i[e[t+12]]+i[e[t+13]]+i[e[t+14]]+i[e[t+15]]).toLowerCase()}let T;const ae=new Uint8Array(16);function se(){if(!T){if(typeof crypto>"u"||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");T=crypto.getRandomValues.bind(crypto)}return T(ae)}const le=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),D={randomUUID:le};function ce(e,t,o){if(D.randomUUID&&!t&&!e)return D.randomUUID();e=e||{};const n=e.random??e.rng?.()??se();if(n.length<16)throw new Error("Random bytes length must be >= 16");return n[6]=n[6]&15|64,n[8]=n[8]&63|128,re(n)}function de(){let e=1;const[t,o]=m.useState([]);N();const n=new W;m.useEffect(()=>{const r=()=>{o([]);for(let s=0;s<e;s++)E();e*=2,e==40&&(e=0)};return window.addEventListener("click",r),()=>{window.removeEventListener("click",r)}},[]);const u=[n.load("./textures/particles/1.png"),n.load("./textures/particles/2.png"),n.load("./textures/particles/3.png"),n.load("./textures/particles/4.png"),n.load("./textures/particles/5.png"),n.load("./textures/particles/6.png"),n.load("./textures/particles/7.png"),n.load("./textures/particles/8.png")],S=(r,s,d,p,z,w)=>{const v=new Float32Array(r*3),b=new Float32Array(r),R=new Float32Array(r);for(let l=0;l<r;l++){const g=l*3,h=new K(z*(.75+Math.random()*.25),Math.random()*Math.PI,Math.random()*Math.PI*2),c=new f;c.setFromSpherical(h),v[g]=c.x,v[g+1]=c.y,v[g+2]=c.z,b[l]=Math.random(),R[l]=1+Math.random()}const A=new F({vertexShader:ie,fragmentShader:oe,transparent:!0,depthFunc:!1,blending:X,uniforms:{uSize:new y(d),uResolution:new y(new $(window.innerWidth,window.innerHeight)),uTexture:new y(p),uColor:new y(w),uProgress:new y(0)}}),x=new Y;x.setAttribute("position",new C(v,3)),x.setAttribute("aSize",new C(b,1)),x.setAttribute("aTimeMultiplayer",new C(R,1));const k=ce();o(l=>[...l,{position:s,positions:v,sizesArray:b,material:A,geometry:x,id:k}]),q.to(A.uniforms.uProgress,{value:1,duration:3,ease:"linear",onComplete:()=>U(k)});const U=l=>{o(g=>{const h=g.find(c=>c.id===l);return h&&(h.material.dispose(),h.geometry.dispose()),g.filter(c=>c.id!==l)})}},E=()=>{console.log(t);const r=Math.round(400+Math.random()*3e3),s=new f((Math.random()-.5)*8,(Math.random()-.5)*8,(Math.random()-.5)*8),d=.1+Math.random()*.1,p=u[Math.floor(Math.random()*u.length)],z=.5+Math.random(),w=new H;w.setHSL(Math.random(),1,.7),S(r,s,d,p,z,w)},a={PositionX:0,PositionY:.5,PositionZ:0,Azimuth:0,Elevation:-2.2,Distance:45e4,Inclination:.5,mieCoefficient:.005,mieDirectionalG:.95,rayleigh:3,turbidity:10,Exposure:Z};return P.jsxs(P.Fragment,{children:[P.jsx(ne,{inclination:a.Inclination,azimuth:a.Azimuth,distance:a.Distance,mieCoefficient:a.mieCoefficient,mieDirectionalG:a.mieDirectionalG,rayleigh:a.rayleigh,turbidity:a.turbidity,exposure:a.Exposure}),t.map((r,s)=>P.jsx("points",{material:r.material,geometry:r.geometry,position:r.position},s))]})}export{de as default};
//# sourceMappingURL=shader-DP6L2a7F.js.map
