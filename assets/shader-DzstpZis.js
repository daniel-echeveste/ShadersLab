import{r as s,c,T as o,S as g,e as x,o as i,v as U,j as r,k as d}from"./index-CIDBdOm7.js";import{u as b}from"./leva.esm-DSVJ0qOL.js";var l=`varying vec2 vUv;

void main() {\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vUv = uv;\r
}`,y=`#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

uniform int uPattern;

float random(vec2 st) {\r
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);\r
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {\r
    return vec2(cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x, cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y);\r
}

vec4 permute(vec4 x) {\r
    return mod(((x * 34.0) + 1.0) * x, 289.0);\r
}

vec2 fade(vec2 t) {\r
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\r
}

float cnoise(vec2 P) {\r
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);\r
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);\r
    Pi = mod(Pi, 289.0); 
    vec4 ix = Pi.xzxz;\r
    vec4 iy = Pi.yyww;\r
    vec4 fx = Pf.xzxz;\r
    vec4 fy = Pf.yyww;\r
    vec4 i = permute(permute(ix) + iy);\r
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; 
    vec4 gy = abs(gx) - 0.5;\r
    vec4 tx = floor(gx + 0.5);\r
    gx = gx - tx;\r
    vec2 g00 = vec2(gx.x, gy.x);\r
    vec2 g10 = vec2(gx.y, gy.y);\r
    vec2 g01 = vec2(gx.z, gy.z);\r
    vec2 g11 = vec2(gx.w, gy.w);\r
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));\r
    g00 *= norm.x;\r
    g01 *= norm.y;\r
    g10 *= norm.z;\r
    g11 *= norm.w;\r
    float n00 = dot(g00, vec2(fx.x, fy.x));\r
    float n10 = dot(g10, vec2(fx.y, fy.y));\r
    float n01 = dot(g01, vec2(fx.z, fy.z));\r
    float n11 = dot(g11, vec2(fx.w, fy.w));\r
    vec2 fade_xy = fade(Pf.xy);\r
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);\r
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);\r
    return 2.3 * n_xy;\r
}

void main() {\r
    float strength = 0.0;\r
    float barX;\r
    float barY;\r
    vec2 gridUv;\r
    vec2 wavedUv;\r
    float angle;\r
    switch(uPattern) {\r
        case 1:\r
            gl_FragColor = vec4(vUv, 1.0, 1.0); 
            break;\r
        case 2:\r
            gl_FragColor = vec4(vUv, 0.0, 1.0); 
            break;\r
        case 3:\r
            strength = vUv.x; 
            break;\r
        case 4:\r
            gl_FragColor = vec4(vUv, 1.0, 1.0); 
            break;\r
        case 5:\r
            
            strength = 1.0 - vUv.y;\r
            break;\r
        case 6:\r
          
            strength = vUv.y * 10.0;\r
            break;\r
        case 7:\r
            
            strength = mod(vUv.y * 10.0, 1.0);\r
            break;\r
        case 8:\r
             
            strength = mod(vUv.y * 10.0, 1.0);\r
            strength = step(0.5, strength);\r
            break;\r
        case 9:\r
            
            strength = mod(vUv.y * 10.0, 1.0);\r
            strength = step(0.8, strength);\r
            break;\r
        case 10:\r
            
            strength = mod(vUv.x * 10.0, 1.0);\r
            strength = step(0.8, strength);\r
            break;\r
        case 11:\r
             
            strength = step(0.8, mod(vUv.x * 10.0, 1.0));\r
            strength += step(0.8, mod(vUv.y * 10.0, 1.0));\r
            strength = clamp(strength, 0.0, 1.0);\r
            break;\r
        case 12:\r
            
            strength = step(0.8, mod(vUv.x * 10.0, 1.0));\r
            strength *= step(0.8, mod(vUv.y * 10.0, 1.0));\r
            break;\r
        case 13:\r
            
            strength = step(0.4, mod(vUv.x * 10.0, 1.0));\r
            strength *= step(0.8, mod(vUv.y * 10.0, 1.0));\r
            break;\r
        case 14:\r
            
            barX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));\r
            barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));\r
            strength = barX + barY;\r
            strength = clamp(strength, 0.0, 1.0);\r
            break;\r
        case 15:\r
             
            barX = step(0.4, mod(vUv.x * 10.0 - 0.2, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));\r
            barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0 - 0.2, 1.0));\r
            strength = barX + barY;\r
            strength = clamp(strength, 0.0, 1.0);\r
            break;\r
        case 16:\r
            
            strength = abs(vUv.x - 0.5);\r
            break;\r
        case 17:\r
            
            strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));\r
            break;\r
        case 18:\r
            
            strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));\r
            break;\r
        case 19:\r
            
            strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));\r
            break;\r
        case 20:\r
            
            strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));\r
            strength *= 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

            break;\r
        case 21:\r
            
            strength = floor(vUv.x * 10.0) / 10.0;\r
            break;\r
        case 22:\r
             
            strength = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;

            break;\r
        case 23:\r
        
            strength = random(vUv);\r
            break;\r
        case 24:\r
             
            gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);\r
            strength = random(gridUv);

            break;\r
        case 25:\r
           
            gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0);\r
            strength = random(gridUv);

            break;\r
        case 26:\r
           
            strength = length(vUv);

            break;\r
        case 27:\r
            
            strength = distance(vUv, vec2(0.5));

            break;\r
        case 28:\r
             
            strength = 1.0 - distance(vUv, vec2(0.5));

            break;\r
        case 29:\r
          
            strength = 0.015 / (distance(vUv, vec2(0.5)));

            break;\r
        case 30:\r
             
            strength = 0.15 / (distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)));

            break;\r
        case 31:\r
            
            strength = 0.15 / (distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)));\r
            strength *= 0.15 / (distance(vec2(vUv.y, (vUv.x - 0.5) * 5.0 + 0.5), vec2(0.5)));

            break;\r
        case 32:\r
            
            vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));\r
            strength = 0.15 / (distance(vec2(rotatedUv.x, (rotatedUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)));\r
            strength *= 0.15 / (distance(vec2(rotatedUv.y, (rotatedUv.x - 0.5) * 5.0 + 0.5), vec2(0.5)));

            break;\r
        case 33:\r
           
            strength = step(0.5, distance(vUv, vec2(0.5)) + 0.25);

            break;\r
        case 34:

    
            strength = abs(distance(vUv, vec2(0.5)) - 0.25);

            break;\r
        case 35:\r
             
            strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

            break;\r
        case 36:\r
           
            strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

            break;\r
        case 37:\r
            
            wavedUv = vec2(vUv.x, vUv.y + sin(vUv.x * 30.0) * 0.1);\r
            strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

            break;\r
        case 38:\r
            
            wavedUv = vec2(vUv.x + sin(vUv.y * 30.0) * 0.1, vUv.y + sin(vUv.x * 30.0) * 0.1);\r
            strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

            break;\r
        case 39:\r
           
            wavedUv = vec2(vUv.x + sin(vUv.y * 100.0) * 0.1, vUv.y + sin(vUv.x * 100.0) * 0.1);\r
            strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

            break;\r
        case 40:\r
             
            angle = atan(vUv.x, vUv.y);\r
            strength = angle;

            break;\r
        case 41:\r
             
            angle = atan(vUv.x - 0.5, vUv.y - 0.5);\r
            strength = angle;

            break;\r
        case 42:\r
             
            angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;\r
            strength = angle;

            break;\r
        case 43:\r
         
            angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;\r
            strength = mod(angle * 20.0, 1.0);

            break;\r
        case 44:\r
             
            angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;\r
            strength = sin(angle * 100.0);

            break;\r
        case 45:\r
            
            angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;\r
            float radius = 0.25 + sin(angle * 100.0) * 0.02;\r
            strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

            break;\r
        case 46:

    
            strength = cnoise(vUv * 10.0);

            break;\r
        case 47:\r
            
            strength = step(0.0, cnoise(vUv * 10.0));

            break;\r
        case 48:\r
           
            strength = 1.0 - abs(cnoise(vUv * 10.0));

            break;\r
        case 49:\r
         
            strength = sin(cnoise(vUv * 10.0) * 20.0);

            break;\r
        case 50:\r
            
            strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));\r
            break;

        default:\r
            strength = vUv.y;
            break;\r
    }

    
    vec3 blackColor = vec3(0.0);\r
    vec3 uvColor = vec3(vUv, 1.0);\r
    vec3 mixedColor = mix(blackColor, uvColor, strength);

    
    gl_FragColor = vec4(mixedColor, 1.0);\r
}`;function p(){const e=s.useRef(),t=b({pattern:{value:23,min:5,max:50,step:1}}),v=()=>{n.uniforms.uPattern.value++,n.uniforms.uPattern.value>50&&(n.uniforms.uPattern.value=5)};c((m,f)=>{}),new o().load("/textures/can-flag.jpg");const n=new g({vertexShader:l,fragmentShader:y,side:x,uniforms:{uPattern:{value:t.pattern}}}),a=new i(1);return U({shaderMaterial:n}),r.jsx(r.Fragment,{children:r.jsx("mesh",{geometry:a,material:n,useRef:e,scale:new d(2,2,2),onClick:v,position:[0,0,-1]})})}export{p as default};
//# sourceMappingURL=shader-DzstpZis.js.map
