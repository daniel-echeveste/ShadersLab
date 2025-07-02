import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { SUBTRACTION ,Brush, Evaluator } from "three-bvh-csg"
import * as THREE from "three";
import { useControls } from "leva";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import vertexShader from "./vertex.glsl"
import fragmentShader from "./fragment.glsl"
export default function ProceduralTerrain() {

    const controls = useControls({
        positionFrecuency: { value: 0.2, min: 0, max: 1 },
        strength: { value: 2.0, min: 0, max: 10 },
        warpFrequency: { value: 5.0, min: 0, max: 10 },
        warpStrength: { value: 0.5, min: 0, max: 1 },
        colorWaterDeep: { value: "#002b3d" },
        colorWaterShallow: { value: "#66a8ff" },
        colorSand: { value: "#ffe894" },
        colorSnow: { value: "#ffffff" },
        colorGrass: { value: "#85d534" },
        colorRock: { value: "#525137" },
    })
    //brushes
    const boardFill = new Brush(new THREE.BoxGeometry(11, 2, 11))
    const boardHole = new Brush(new THREE.BoxGeometry(10, 2, 10))

    
    //evaluate
    const evaluator = new Evaluator()
    const board = evaluator.evaluate(boardFill, boardHole, SUBTRACTION)
    board.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#ffffff"),
        roughness: 1,
        metalness: 0,
        // envMapIntensity: 0.5
    })
    board.castShadow = true;
    board.receiveShadow = true;

    //terrain 
    const geomtery = new THREE.PlaneGeometry(10,10,500,500)
    geomtery.rotateX(-Math.PI * 0.5)

    const uniforms = {
        uTime: new THREE.Uniform(0),
        uPositionFrecuency: new THREE.Uniform(controls.positionFrecuency),
        uStrength: new THREE.Uniform(controls.strength),
        uWarpFrequency: new THREE.Uniform(controls.warpFrequency),
        uWarpStrength: new THREE.Uniform(controls.warpStrength),
        uColorWaterDeep: new THREE.Uniform(new THREE.Color(controls.colorWaterDeep)),
        uColorWaterShallow: new THREE.Uniform(new THREE.Color(controls.colorWaterShallow)),
        uColorSand: new THREE.Uniform(new THREE.Color(controls.colorSand)),
        uColorSnow: new THREE.Uniform(new THREE.Color(controls.colorSnow)),
        uColorGrass: new THREE.Uniform(new THREE.Color(controls.colorGrass)),
        uColorRock: new THREE.Uniform(new THREE.Color(controls.colorRock)),
    }
    const material = new  CustomShaderMaterial({

        //CSM
        baseMaterial: new THREE.MeshStandardMaterial(),
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        silent: true,
        //mesh Standard Material
        uniforms: uniforms,
        roughness: 0.5,
        metalness: 0,
        // envMapIntensity: 0.5
    })
    const depthMaterial = new CustomShaderMaterial({
        // CSM 
        baseMaterial: new THREE.MeshDepthMaterial(),
        vertexShader: vertexShader,
        uniforms: uniforms,
        silent: true,
        //depth Material
        depthPacking: THREE.RGBADepthPacking,
        
    })
    useFrame((_, delta) => {
        uniforms.uTime.value += delta;
    })



    return (
        <>
        <primitive object={board} />
        <mesh 
            geometry={geomtery} material={material} 
            customDepthMaterial={depthMaterial}
            receiveShadow={true} castShadow={true}
        >
        </mesh>
        {/* WATER */}
        <mesh 
            position={[0, -0.1, 0]}
            rotation={[-Math.PI * 0.5, 0, 0]}
        >
            <planeGeometry args={[10,10,500,500]} />
            <meshPhysicalMaterial color={new THREE.Color(controls.colorWaterShallow)} transmission={1} roughness={0}/>
        </mesh>
        </>
    )
}