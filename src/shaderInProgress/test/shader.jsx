// CustomShaderMaterial.js
import * as THREE from "three";
import { OrbitControls, Float, Text, useGLTF, shaderMaterial } from '@react-three/drei'
import { useMemo, useState, useRef } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { Leva } from "leva";
import testVertexShader from './vertex.glsl'
import testFragmentShader from './fragment.glsl'


export default function Flag() {
    const mesh = useRef()


    // Add leva
    // gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX')
    // gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY')

    useFrame((state, delta) => {
        shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    })
    const textureLoader = new THREE.TextureLoader()
    const flagTexture = textureLoader.load('/textures/can-flag.jpg')
    // const CustomShaderMaterial = shaderMaterial(
    //     { uFrequency: new THREE.Vector2(20,10) ,
    //     uTime:  0 ,
    //     uColor:  new THREE.Color('orange') ,
    //     uTexture: flagTexture } , // uniforms
    //     testVertexShader,
    //     testFragmentShader
    //   );
    const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: testVertexShader,
        fragmentShader: testFragmentShader,
        side: THREE.DoubleSide,
        uniforms:
        {
            uFrequency: { value: new THREE.Vector2(10, 7) },
            uTime: { value: 0 },
            uColor: { value: new THREE.Color('orange') },
            uTexture: { value: flagTexture }
        }
    })
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)
    
    // const count = geometry.attributes.position.count
    // const randoms = new Float32Array(count) 
    // for (let i = 0; i < count; i++) {
    //     randoms[i] = Math.random()
    // }

    // geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
    extend({ shaderMaterial });

    return <>
        <mesh geometry={geometry} material={shaderMaterial} useRef={mesh} scale={new THREE.Vector3(1, 0.66, 1)}>
        </mesh>
        {/* <shaderMaterial attach="material" ref={material} /> */}
    </>
}


