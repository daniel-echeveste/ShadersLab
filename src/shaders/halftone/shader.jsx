
import { useRef } from "react";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import * as THREE from "three"
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";

export default function HalftoneShader() {

    const sphereRef = useRef()
    const torusKnotRef = useRef()
    const cubeRef = useRef()

    const controls = useControls({
        uShapeColor: {value:"#ff794d"},
        backgroundColor: {value:"#26132f"},
        uHalftoneColor: {value:"#8e19b8"},
        uRepetitions: {value:100, min:1, max:200, step:1},
        uLow: {value:-0.8, min:-1, max:1, step:0.1},
        uHigh: {value:1.5, min:0, max:2, step:0.1},
        uShadowDirection: {value:new THREE.Vector3(0, -1, 0)},
        uLightDirection: {value:new THREE.Vector3(1, 1, 0)},
        uLightColor: {value:"#ffffff"},
        uLightRepetitions: {value:100, min:0, max:10, step:0.1},
    })
    document.body.style.backgroundColor = controls.backgroundColor    
   
    const pixelRatio = Math.min(window.devicePixelRatio , 2)
    const halftoneMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            uColor :new THREE.Uniform(new THREE.Color(controls.uShapeColor)),
            uResolution :new THREE.Uniform(new THREE.Vector2(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio)),
            uRepetitions :new THREE.Uniform(controls.uRepetitions),
            uLow :new THREE.Uniform(controls.uLow),
            uHigh :new THREE.Uniform(controls.uHigh),
            uLightColor :new THREE.Uniform(new THREE.Color(controls.uLightColor)),
            uLightRepetitions :new THREE.Uniform(controls.uLightRepetitions),
            uHalftoneColor :new THREE.Uniform(new THREE.Color(controls.uHalftoneColor)),
            uLightDirection :new THREE.Uniform(controls.uLightDirection),
            uShadowDirection :new THREE.Uniform(controls.uShadowDirection),
        }
    })
 
   useFrame(() => {
    halftoneMaterial.uniforms.uResolution.value.set(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio)
    sphereRef.current.rotation.x += 0.02;
    sphereRef.current.rotation.y += 0.01;
    torusKnotRef.current.rotation.x -= 0.014;
    torusKnotRef.current.rotation.y += 0.01;
    cubeRef.current.rotation.x -= 0.015;
    cubeRef.current.rotation.y -= 0.01;
   })
    return (
        <>
           <mesh ref={sphereRef} position={[-3, 0, 0]} material={halftoneMaterial}>
                   <    torusGeometry /> 
               </mesh>
               {/* torus knot */}
               <mesh ref={torusKnotRef} position={[3, 0, 0]} material={halftoneMaterial}>
                   <torusKnotGeometry  args={[1, 0.4, 128, 128]}/>
                   
               </mesh>
               {/* box */}
               <mesh ref={cubeRef} position={[0, 0, 0]} material={halftoneMaterial}>
                   <boxGeometry />
                 
               </mesh>
        </>
    )


}