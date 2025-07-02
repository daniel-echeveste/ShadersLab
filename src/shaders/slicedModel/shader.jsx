
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
export default function SlicedModel() {

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    const controls = useControls({
        sliceStart: { value: 1.0, min: - Math.PI, max: Math.PI },
        sliceArc: { value: 1.5, min: 0, max: Math.PI * 2 },
    })
    const uniforms = {
        uTime: new THREE.Uniform(0),
        uSliceStart: new THREE.Uniform(controls.sliceStart),
        uSliceArc: new THREE.Uniform(controls.sliceArc),
    }
    const patchMap = {
        csm_Slice: {
            '#include <colorspace_fragment>':
                `
                #include <colorspace_fragment>
                
                if(!gl_FrontFacing)
                    gl_FragColor = vec4(0.75, 0.15, 0.3, 1.0);
            `
        }
    }

    const gearModelRef = useRef()
    const gearModel = useGLTF('models/gear/gears.glb')
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#FF0000"),
        roughness: 0.25,
        metalness: 0.5,
        envMapIntensity: 0.5
    })
    const slicedMaterial = new CustomShaderMaterial({
        // CSM   
        baseMaterial: material,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        silent: true,
        patchMap: patchMap,

        //mesh Standard Material
        color: new THREE.Color("#858080"),
        roughness: 0.25,
        metalness: 0.5,
        envMapIntensity: 0.5,
        side: THREE.DoubleSide,

        uniforms: uniforms,
    })
    const slicedDepthMaterial = new CustomShaderMaterial({
        // CSM   
        baseMaterial: THREE.MeshDepthMaterial,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        silent: true,
        patchMap: patchMap,

        //mesh Standard Material
        depthPacking: THREE.RGBADepthPacking,


    })
    gearModel.scene.traverse((child) => {
        if (child.isMesh) {
            if (child.name == "outerHull") {
                child.material = slicedMaterial;
                child.customDepthMaterial = slicedDepthMaterial;
            } else {
                console.log(child.name);
                child.material = material;
            }
            child.castShadow = true;
            child.receiveShadow = true;
        }
    })
    useFrame(() => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        uniforms.uTime.value += 0.01;
        if (gearModelRef.current) gearModelRef.current.rotation.y += 0.001;
    })
    return (
        <>
            <spotLight position={[3, 2, 0]} intensity={400} castShadow />
            <primitive ref={gearModelRef} object={gearModel.scene} castShadow position-z={0} scale={1} />
            <mesh position={[-5, -0.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow >
                <planeGeometry args={[10, 10, 32, 32]} />
                <meshStandardMaterial side={THREE.DoubleSide} color={new THREE.Color("#ffffff")} />
            </mesh>
        </>
    )
}