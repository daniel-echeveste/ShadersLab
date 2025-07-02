

import * as THREE from "three"
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import ExampleModel from "../../models/models";
import { useControls, button } from "leva";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer"

import { useGLTF } from "@react-three/drei"
import { Suspense } from "react";
import Placeholder from "../../models/Placeholder";
import { useThree } from "@react-three/fiber";

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import GPGPUParticlesShader from "./gpgpu/particles.glsl"

export default function GPGPUParticles(args) {
    // const particlesGeometry = useRef()
    document.body.style.backgroundColor = "#29191f"    

    console.log(GPGPUParticlesShader);
    const model = useGLTF('models/ship/model.glb')
   
    // Particles 
    const particles = {}
    const controls = useControls({
        size: {value: 0.05, min: 0.0, max: 0.10},
      flowFieldInfluence: {value: 0.5, min: 0.0, max: 1.0},
      flowFieldStrength: {value: 0.5, min: 0.0, max: 10.0},
      flowFieldFrequency: {value: 0.2, min: 0.0, max: 1.0}
    })
    
    const renderer = useThree((state) => state.gl)
    console.log(renderer);
    const scene = useThree((state) => state.scene)
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    // Base Geometry
    const baseGeometry = {}
    baseGeometry.instance = model.scene.children[0].geometry
    baseGeometry.count = baseGeometry.instance.attributes.position.count

    
    
    // GPU Compute 
    const gpgpu = {}
    gpgpu.size = Math.sqrt(baseGeometry.count)
    gpgpu.size = Math.ceil(gpgpu.size)
    gpgpu.computation = new GPUComputationRenderer(gpgpu.size, gpgpu.size, renderer)
    
    //base Particles
    const baseParticlesTexture = gpgpu.computation.createTexture()

    for (let i = 0; i < baseGeometry.count; i++) {
        const i3 = i * 3;
        const i4 = i * 4;
        
        //position baswed on geometry
        baseParticlesTexture.image.data[i4] = baseGeometry.instance.attributes.position.array[i3]
        baseParticlesTexture.image.data[i4 + 1] = baseGeometry.instance.attributes.position.array[i3 + 1]
        baseParticlesTexture.image.data[i4 + 2] = baseGeometry.instance.attributes.position.array[i3 + 2]
        baseParticlesTexture.image.data[i4 + 3] = Math.random()
    }
     

    //particles variables
    gpgpu.particlesVariable = gpgpu.computation.addVariable(
        "uParticles",  //name of the texture 
        GPGPUParticlesShader,  //shader where is inserted
        baseParticlesTexture //inserted textured
    )
    console.log(gpgpu.particlesVariable);
    gpgpu.computation.setVariableDependencies(gpgpu.particlesVariable, [gpgpu.particlesVariable])
   
    // UNIFORMS

    gpgpu.particlesVariable.material.uniforms.uTime = new THREE.Uniform(0.0)
    gpgpu.particlesVariable.material.uniforms.uDeltaTime = new THREE.Uniform(0.0)
    gpgpu.particlesVariable.material.uniforms.uBase = new THREE.Uniform(baseParticlesTexture)
    gpgpu.particlesVariable.material.uniforms.uFlowFieldInfluence = new THREE.Uniform(controls.flowFieldInfluence)
    gpgpu.particlesVariable.material.uniforms.uFlowFieldStrength = new THREE.Uniform(controls.flowFieldStrength)
    gpgpu.particlesVariable.material.uniforms.uFlowFieldFrequency = new THREE.Uniform(controls.flowFieldFrequency)

    //init
    gpgpu.computation.init()

    
    //Geometry for particles
    const particlesUvArray = new Float32Array(baseGeometry.count * 2)
    const sizesArray = new Float32Array(baseGeometry.count)

    for (let y = 0; y < gpgpu.size; y++) {
        for(let x = 0; x < gpgpu.size; x++) {
            const i = (y * gpgpu.size) + x
            const i2 = i * 2
            //particles uv
            const uvX = (x + 0.5) / gpgpu.size
            const uvY = (y + 0.5) / gpgpu.size
            
            particlesUvArray[i2] = uvX
            particlesUvArray[i2 + 1] = uvY


            //particles size
            sizesArray[i] = Math.random() 
        }
    }
    particles.geometry = new THREE.BufferGeometry()
    particles.geometry.setDrawRange(0, baseGeometry.count)
    particles.geometry.setAttribute("aParticlesUv", new THREE.BufferAttribute(particlesUvArray, 2))
    particles.geometry.setAttribute("aColor", baseGeometry.instance.attributes.color)
    particles.geometry.setAttribute("aSize", new THREE.BufferAttribute(sizesArray, 1))

    particles.material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        // blending: THREE.AdditiveBlending,
        // depthWrite: false,
        uniforms:
        {
            uParticlesTexture: new THREE.Uniform(),
            uSize:new THREE.Uniform(controls.size),
            uResolution: new THREE.Uniform(new THREE.Vector2(window.innerWidth, window.innerHeight)),
            
        }
    })
    
    useFrame((_, delta) => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        particles.material.uniforms.uResolution.value.set(sizes.width, sizes.height);
         // GPGPU UPDATE
         console.log(delta);
         
        gpgpu.particlesVariable.material.uniforms.uDeltaTime.value = Math.min(delta, 0.01);
        gpgpu.particlesVariable.material.uniforms.uTime.value += 0.01;
        gpgpu.computation.compute()
        particles.material.uniforms.uParticlesTexture.value = gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable).texture

    })
    console.log(gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable).texture);
  
    
   
   
    


    return (
        <>
            <points material={particles.material} geometry={particles.geometry}>
            </points>
            
            {/* debug */}
            {/* <mesh position={[3,0,0]} material={gpgpu.debugMaterial} geometry={gpgpu.debugGeometry} >
                <planeGeometry args={[3,3]}  />
                <meshBasicMaterial map={gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable).texture}/>
            </mesh> */}
        </>
    )
}

