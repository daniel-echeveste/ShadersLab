import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import * as THREE from "three"
import gsap from "gsap";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import ExampleModel from "../../models/models";
import { useControls, button } from "leva";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { useGLTF } from "@react-three/drei"
import { Suspense } from "react";
import Placeholder from "../../models/Placeholder";
import { Environment } from "@react-three/drei";

export default function ParticlesMorphing(args) {


    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    const controls = useControls({
        ballColor: { value: '#0000ff' },
        ballColor2: { value: '#ff0000' },
        metalness: { value: 0.0, min: 0, max: 1 },
        roughness: { value: 1, min: 0, max: 1 },
        transmission: { value: 0.0, min: 0, max: 1 },
        thickness: { value: 0.5, min: 0, max: 1 },
        ior: { value: 1.5, min: 1, max: 2 },
        uPositionFrequency: { value: 0.5, min: 0, max: 2 },
        uTimeFrequency: { value: 0.3, min: 0, max: 2 },
        uStrength: { value: 0.3, min: 0, max: 1 },
        //warp
        uWarpPositionFrequency: { value: 0.38, min: 0, max: 2 },
        uWarpTimeFrequency: { value: 0.12, min: 0, max: 2 },
        uWarpStrength: { value: 1.7, min: 0, max: 2 },
    })

   
    const uniforms = {
        uTime: new THREE.Uniform(0),
        uPositionFrequency:  new THREE.Uniform(controls.uPositionFrequency) ,
        uTimeFrequency:  new THREE.Uniform(controls.uTimeFrequency) ,
        uStrength: new THREE.Uniform(controls.uStrength),
        //warp
        uWarpPositionFrequency:  new THREE.Uniform(controls.uWarpPositionFrequency) ,
        uWarpTimeFrequency:  new THREE.Uniform(controls.uWarpTimeFrequency) ,
        uWarpStrength: new THREE.Uniform(controls.uWarpStrength),
        //Color 
        ballColor: new THREE.Uniform(new THREE.Color(controls.ballColor)),
        ballColor2: new THREE.Uniform(new THREE.Color(controls.ballColor2)),
    }
    //Material 
    const material = new CustomShaderMaterial({
        baseMaterial: new THREE.MeshPhysicalMaterial(),
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        silent: true,
        //mESHpHISICALmATERIAL
        
        metalness: controls.metalness,
        roughness: controls.roughness,
        transmission: controls.transmission,
        thickness: controls.thickness,
        ior: controls.ior,
        transparent: true,
        wireframe: false,
        uniforms: uniforms,
    })
    //Material 
    const depthMaterial = new CustomShaderMaterial({
        baseMaterial: new THREE.MeshDepthMaterial(),
        vertexShader: vertexShader,
        uniforms: uniforms,
        silent: true,
        //depthMaterial
        depthPacking: THREE.RGBADepthPacking,
    })
    let icosahedronGeometry = new THREE.IcosahedronGeometry(2.5, 50)
    icosahedronGeometry = mergeVertices(icosahedronGeometry)
    icosahedronGeometry.computeTangents()
    // icosahedronGeometry = geometry
    useFrame(() => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        uniforms.uTime.value += 0.01;
    })
    return (
        <>
            {/* <Environment background files="textures/environmentMaps/0/" /> */}
            {/* <spotLight position={[8, 2, 0]} intensity={400} castShadow /> */}
            <mesh 
                castShadow 
                // receiveShadow
                material={material} 
                customDepthMaterial={depthMaterial}
                geometry={icosahedronGeometry}
             >
            </mesh>
            {/* <mesh position={[-4, -0.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow >
                <planeGeometry args={[8, 8, 32, 32]} />
                <meshStandardMaterial side={THREE.DoubleSide} color={new THREE.Color("#ffffff")} />
            </mesh> */}

        </>
    )
}

