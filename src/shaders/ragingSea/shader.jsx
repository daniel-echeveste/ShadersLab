// CustomShaderMaterial.js
import * as THREE from "three";
import { OrbitControls, Float, Text, useGLTF, shaderMaterial, Sky } from '@react-three/drei'
import { useMemo, useState, useRef,} from 'react'
import { useFrame, extend } from '@react-three/fiber'
import testVertexShader from './vertex.glsl'
import testFragmentShader from './fragment.glsl'
import { useControls } from "leva";
import { useThree } from "@react-three/fiber";


export default function ragingSea() {
    
    document.body.style.backgroundColor = "#000000"    

    const mesh = useRef()
    const renderer = useThree((state) => state.gl)
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    const controls = useControls({
        uDepthColor:'#ff4000',
        uSurfaceColor:'#151c37',

        uBigWavesElevation:
        {
            // value: 0.2,
            value: 0.9,
            min: 0,
            max: 1,
            step:0.1
        },
        uBigWavesFrequency:
        {
            // value:new THREE.Vector2(4, 1.5),
            // value:new THREE.Vector2(0.333, 0.125),
            value:new THREE.Vector2(0.6, 0.25),
        },
        uBigWavesSpeed:
        {
            // value:0.75,
            value:0.4,
            min: 0,
            max: 10,
            step:0.1
        },

        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallIterations: { value: 4 },

        uColorOffset: {value: 0.925, step: 0.001},
        uColorMultiplier: {value: 1.0, step: 0.001},
        
    })
   console.log(controls);
   
    useFrame((state, delta) => {
        shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    })
    const textureLoader = new THREE.TextureLoader()
    const flagTexture = textureLoader.load('/textures/can-flag.jpg')

    const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: testVertexShader,
        fragmentShader: testFragmentShader,
        side: THREE.DoubleSide,
        // wireframe:true ,
        uniforms:
        {
            
            // uFrequency: { value: new THREE.Vector2(10, 7) },
            uTime: { value: 0 },
            // uColor: { value: new THREE.Color('orange') },
            // uTexture: { value: flagTexture },
            uBigWavesElevation: {value: controls.uBigWavesElevation},
            uBigWavesFrequency: {value: controls.uBigWavesFrequency},
            uBigWavesSpeed: {value: controls.uBigWavesSpeed},
            uDepthColor: {value: new THREE.Color(controls.uDepthColor)},
            uSurfaceColor: {value: new THREE.Color(controls.uSurfaceColor)},
            uColorOffset: {value:controls.uColorOffset},
            uColorMultiplier: {value:controls.uColorMultiplier},
            uSmallWavesElevation: {value:controls.uSmallWavesElevation },
            uSmallWavesFrequency: { value:controls.uSmallWavesFrequency  },
            uSmallWavesSpeed: {  value:controls.uSmallWavesSpeed},
            uSmallIterations: { value:controls.uSmallIterations },
        }
    })
    const geometry = new THREE.PlaneGeometry(2,2, 512, 512)
    geometry.deleteAttribute('normal');
    geometry.deleteAttribute('uv');

    extend({ shaderMaterial });

    return <>
        {/* <axesHelper /> */}
        
        <mesh
            geometry={geometry}
            material={shaderMaterial}
            useRef={mesh}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 0, 0]}
            scale={14} 
>
        </mesh>
            
        
    </>
}


