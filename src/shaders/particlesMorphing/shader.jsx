import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import * as THREE from "three"
import gsap from "gsap";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import ExampleModel from "../../models/models";
import { useControls, button } from "leva";

import { useGLTF } from "@react-three/drei"
import { Suspense } from "react";
import Placeholder from "../../models/Placeholder";

export default function ParticlesMorphing(args) {
    // const particlesGeometry = useRef()

    const morph = (index) => {
        //update attribute 
        console.log(index);

        particles.geometry.attributes.position = particles.positions[particles.index]
        particles.geometry.attributes.aPositionTarget = particles.positions[index]

        gsap.fromTo(
            particles.material.uniforms.uProgress,
            { value: 0 },
            { value: 1, duration: 3, ease: "linear" }
        )
        particles.index = index
    }


    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    const particles = {}
    // particles.morph1 = ()=>morph(0)
    // particles.morph2 = ()=>morph(1)
    // particles.morph3 = ()=>morph(2)
    // particles.morph4 = ()=>morph(3)
    const controls = useControls({
        progress: { value: 0, min: 0, max: 1 },
        colorA: { value: '#ff7300' },
        colorB: { value: '#0091ff' },
        shape1: button(() => {
            morph(0)
            // particles.morph2()
        }),
        shape2: button(() => {
            morph(1)
            // particles.morph2()
        }),
        shape3: button(() => {
            morph(2)
            // particles.morph2()
        }),
        shape4: button(() => {
            morph(3)
            // particles.morph2()
        }),
    })
   
    particles.material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms:
        {
            uSize: { value: 0.2},
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uProgress: { value: controls.progress },
            uColorA: new THREE.Uniform(new THREE.Color(controls.colorA)),
            uColorB: new THREE.Uniform(new THREE.Color(controls.colorB)),
        }
    })
    useFrame(() => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        particles.material.uniforms.uResolution.value.set(sizes.width, sizes.height);
    })


    const model = useGLTF('models/models.glb')
    const positions = model.scene.children.map(child => child.geometry.attributes.position)
    console.log(positions);
    particles.maxCount = 0
    particles.index = 0

    for (const position of positions) {
        if (position.count > particles.maxCount)
            particles.maxCount = position.count
    }
    particles.positions = []
    for (const position of positions) {
        const originalArray = position.array
        const newArray = new Float32Array(particles.maxCount * 3)

        for (let i = 0; i < particles.maxCount; i++) {
            const i3 = i * 3;
            if (i3 < originalArray.length) {
                newArray[i3] = originalArray[i3]
                newArray[i3 + 1] = originalArray[i3 + 1]
                newArray[i3 + 2] = originalArray[i3 + 2]
            } else {
                const randomIndex = Math.floor(position.count * Math.random()) * 3
                newArray[i3] = originalArray[randomIndex]
                newArray[i3 + 1] = originalArray[randomIndex + 1]
                newArray[i3 + 2] = originalArray[randomIndex + 2]
            }
        }
        particles.positions.push(new THREE.Float32BufferAttribute(newArray, 3))
    }
    const sizesArray = new Float32Array(particles.maxCount)
    
    for (let i = 0; i < particles.maxCount; i++) {
        sizesArray[i] = Math.random()
        
    }
    particles.geometry = new THREE.BufferGeometry()
    particles.geometry.setAttribute('position', particles.positions[particles.index])
    particles.geometry.setAttribute('aPositionTarget', particles.positions[3])
    particles.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizesArray, 1))
    // particles.positionsArray = new Float32Array(particles.maxCount * 3)
    // particles.sizesArray = new Float32Array(particles.maxCount)




    return (
        <>
            <points material={particles.material} geometry={particles.geometry}>
            </points>
            {/* <Suspense fallback={<Placeholder position-y={0.5} scale={[2, 3, 2]} />}>
                <ExampleModel position-z={0} position-y={-1} scale={0.5}></ExampleModel>
            </Suspense> */}
        </>
    )
}

