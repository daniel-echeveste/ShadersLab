import * as THREE from "three";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
export default function LightShading() {

    const cubeRef = useRef();
    const torusKnotRef = useRef();
    const sphereRef = useRef();
    
    useFrame((state, delta) => {
        if(cubeRef.current){
            cubeRef.current.rotation.x += delta *0.3;
            cubeRef.current.rotation.y += delta *0.3;
        }
        if(torusKnotRef.current){
            torusKnotRef.current.rotation.x += delta *0.3;
            torusKnotRef.current.rotation.y += delta *0.3;
        }
        if(sphereRef.current){
            sphereRef.current.rotation.x += delta *0.3;
            sphereRef.current.rotation.y += delta *0.3;
        }
    })

    return <>
    {/* sphere */}
    <mesh ref={sphereRef} position={[-3, 0, 0]}>
        <sphereGeometry />
        <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={
            {
                uColor: {value: new THREE.Color("white")}
            }
        } />
    </mesh>
    {/* torus knot */}
    <mesh ref={torusKnotRef} position={[3, 0, 0]}>
        <torusKnotGeometry  args={[1, 0.4, 128, 128]}/>
        <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={
            {
                uColor: {value: new THREE.Color("white")}
            }
        } />
    </mesh>
    {/* box */}
    <mesh ref={cubeRef} position={[0, 0, 0]}>
        <boxGeometry />
        <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={
            {
                uColor: {value: new THREE.Color("white")}
            }
        } />
    </mesh>

    {/* directonal light helper */}
    <mesh position={[0, 0, 3]}>
        <planeGeometry />
        <meshBasicMaterial color={new THREE.Color(0.1, 0.1, 1.0)} side={THREE.DoubleSide} />
    </mesh>
    {/* point Light helper */}
    <mesh position={[0, 2, 0]} scale={0.2}>
        <sphereGeometry />
        <meshBasicMaterial color={new THREE.Color(1.0, 0.1, 0.1)} />
    </mesh>
    {/* spot Light helper */}
    <mesh position={[2, 0, 2]} scale={0.2}>
        <sphereGeometry />
        <meshBasicMaterial color={new THREE.Color(0.1, 1.0, 0.5)} />
    </mesh>
     <ambientLight intensity={0.5}></ambientLight>
      <directionalLight
        castShadow
        position={[4, 2, -2.25]}
        intensity={10}
      ></directionalLight>
      <pointLight position={[0,3,0]} color="red" intensity={10}></pointLight>
    </>
}