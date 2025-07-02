// CustomShaderMaterial.js
import * as THREE from "three";
import { OrbitControls, Float, Text, useGLTF, shaderMaterial } from '@react-three/drei'
import { useMemo, useState, useRef } from 'react'
import { useFrame, extend, useThree } from '@react-three/fiber'
import { useControls } from "leva";
import testVertexShader from './vertex.glsl'
import testFragmentShader from './fragment.glsl'
import { Environment } from "@react-three/drei";




export default function Galaxy() {
    
    const { gl, camera } = useThree()
    const [introTime] = useState(() => performance.now() / 1000)
    const mesh = useRef()
    const controls = useControls({
        uSize:
        {
            value: 0.2,
            min: 0,
            max: 50,
            step: 1
        },
        count: {
            value: 900000,
            min: 0,
            max:    1800000,
            step: 100
        },
        radius: {
            value: 5,
            min: -100,
            max: 100,
            step: 0.15
        },
        branches: {
            value: 4,
            min: -10,
            max: 10,
            step: 1
        },
        randomness: {
            value: 0.5,
            min: -10,
            max: 10,
            step: 0.5
        },
        randomnessPower: {
            value: 3,
            min: -10,
            max: 10,
            step: 0.5
        },
        insideColor: '#ff6030',
        outsideColor: '#1b3984',
        rotateX: {
            value: 0,
            min: -2,
            max: 2,
            step: 0.01
        },
        rotateY: {
            value: 0,
            min: -2,
            max: 2,
            step: 0.01
        },
        rotateZ: {
            value: 0,
            min: -2,
            max: 2,
            step: 0.01
        },
        speed: {
            value: 1,
            min: -5,
            max: 10,
            step: 0.01
        },
    })
    
   
    document.body.style.backgroundColor = "#000000"    
    useFrame((state, delta) => {
        
        shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime - introTime;
        console.log( introTime);
        
    })
    useState(()=>{
        // shaderMaterial.uniforms.uTime.value = 0;
    },[]) 



    let geometry = null

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(controls.count * 3)
    const colors = new Float32Array(controls.count * 3)
    const scale = new Float32Array(controls.count * 1)
    const randomness = new Float32Array(controls.count * 3)


    const insideColor = new THREE.Color(controls.insideColor)
    const outsideColor = new THREE.Color(controls.outsideColor)

    for (let i = 0; i < controls.count; i++) {
        const i3 = i * 3

        // Position
        const radius = Math.random() * controls.radius

        const branchAngle = (i % controls.branches) / controls.branches * Math.PI * 2

        positions[i3] = Math.cos(branchAngle) * radius
        positions[i3 + 1] = 0
        positions[i3 + 2] = Math.sin(branchAngle) * radius

        //randomness
        const randomX = Math.pow(Math.random(), controls.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * controls.randomness * radius
        const randomY = Math.pow(Math.random(), controls.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * controls.randomness * radius
        const randomZ = Math.pow(Math.random(), controls.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * controls.randomness * radius

        randomness[i3 + 0] = randomX
        randomness[i3 + 1] = randomY
        randomness[i3 + 2] = randomZ


        // Color
        const mixedColor = insideColor.clone()
        mixedColor.lerp(outsideColor, radius / controls.radius)

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b

        //scale 
        scale[i] = Math.random()
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scale, 1))
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))

    const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: testVertexShader,
        fragmentShader: testFragmentShader,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        uniforms:
        {
            uTime: { value: 0 },
            uSize: { value: 15 },
            uSpeed: { value: controls.speed * 2 },
        }
    })

    /**
     * Points
     */
    // points = new THREE.Points(geometry, material)
    return <>
       
        <points
            geometry={geometry}
            material={shaderMaterial}
            useRef={mesh}
            scale={new THREE.Vector3(2, 2, 2)}
            position={[0, 0, 0]}
            rotation={[controls.rotateX, controls.rotateY, controls.rotateZ]}>

        </points>
        <Environment
                      backgroundBlurriness={0}
                        files={"textures/sun/stars.jpg"}
                        background  
                        encoding={THREE.sRGBEncoding}
                      ></Environment>
        {/* <shaderMaterial attach="material" ref={material} /> */}
    </>
}


