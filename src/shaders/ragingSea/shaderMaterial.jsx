// CustomShaderMaterial.js
import * as THREE from "three";
import { OrbitControls, Float, Text, useGLTF, shaderMaterial, Sky } from '@react-three/drei'
import { useMemo, useState, useRef,} from 'react'
import { useFrame, extend } from '@react-three/fiber'
import testVertexShader from './vertex.glsl'
import testFragmentShader from './fragment.glsl'
import { useControls, folder } from "leva";


export default function ragingSeaMaterial() {


    const controls = useControls({
        Shaders: folder(
          {
            param1: 10,
            RagingSea: folder(
                {
                        uDepthColor:'#e5735e',
                        uSurfaceColor:'#000000',
                        uBigWavesElevation:
                        {
                            value: 0.2,
                            min: 0,
                            max: 1,
                            step:0.1
                        },
                        uBigWavesFrequency:
                        {
                            value:new THREE.Vector2(4, 1.2),
                        },
                        uBigWavesSpeed:
                        {
                            value:0.8,
                            min: 0,
                            max: 10,
                            step:0.1
                        },
                        uColorOffset: 0.8,
                        uColorMultiplier: 5.0,
                        uSmallWavesElevation: { value: 0.15 },
                        uSmallWavesFrequency: { value: 3 },
                        uSmallWavesSpeed: { value: 0.2 },
                        uSmallIterations: { value: 3 },
                    },
              { collapsed: true } // Subfolder colapsado por defecto
            ),
          },
          { collapsed: true } // Main folder colapsado por defecto
        ),
      });
    
   
    useFrame((state, delta) => {
        shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    })
    const textureLoader = new THREE.TextureLoader()
    const flagTexture = textureLoader.load('/textures/can-flag.jpg')

    const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: testVertexShader,
        fragmentShader: testFragmentShader,
        side: THREE.DoubleSide,
        uniforms:
        {
            uFrequency: { value: new THREE.Vector2(10, 7) },
            uTime: { value: 0 },
            uColor: { value: new THREE.Color('orange') },
            uTexture: { value: flagTexture },
            uBigWavesElevation: {value: controls.uBigWavesElevation},
            uBigWavesFrequency: {value: controls.uBigWavesFrequency},
            uBigWavesSpeed: {value: controls.uBigWavesSpeed},
            uDepthColor: {value: new THREE.Color(controls.uDepthColor)},
            uSurfaceColor: {value: new THREE.Color(controls.uSurfaceColor)},
            uColorOffset: {value:0.25},
            uColorMultiplier: {value:2.0},
            uSmallWavesElevation: {value:controls.uSmallWavesElevation },
            uSmallWavesFrequency: { value:controls.uSmallWavesFrequency  },
            uSmallWavesSpeed: {  value:controls.uSmallWavesSpeed},
            uSmallIterations: { value:controls.uSmallIterations },
        }
    })

    extend({ shaderMaterial });

    return shaderMaterial
}


