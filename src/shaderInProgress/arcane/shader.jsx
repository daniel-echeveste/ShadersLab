// CustomShaderMaterial.js
import * as THREE from "three";
import {
  OrbitControls,
  Float,
  Text,
  useGLTF,
  shaderMaterial,
  Sky,
  Environment,
} from "@react-three/drei";

import { useMemo, useState, useRef, Suspense } from "react";
import { useFrame, extend } from "@react-three/fiber";
import Placeholder from "../../Placeholder";
import VertexShader from "./vertex.glsl";
import FragmentShader from "./fragment.glsl";
import { useControls } from "leva";


export default function ArcaneMaterial() {
  const torus = useRef()
  const controls = useControls({
    uColor:"#ff0000"
  })
  let uTime = 0;
  const torusGeometry = new THREE.TorusKnotGeometry()
  const textureLoader = new THREE.TextureLoader();
  const perlinTexture = textureLoader.load("./textures/perlin.png");
  perlinTexture.wrapS = THREE.RepeatWrapping
  perlinTexture.wrapT = THREE.RepeatWrapping
  const holographicMaterial = new THREE.ShaderMaterial({
    transparent: true,
    vertexShader: VertexShader,
    fragmentShader: FragmentShader,
    wireframe:false,
    uniforms: {
      uTime: new THREE.Uniform(0),
      uPerlinTexture: new THREE.Uniform(perlinTexture),
      uColor :new THREE.Uniform(new THREE.Color(controls.uColor)),
    },
    depthWrite:false,
    blending: THREE.AdditiveBlending,

  });
  useFrame((state, delta) => {
    uTime = state.clock.elapsedTime ;
    holographicMaterial.uniforms.uTime.value = uTime
    torus.current.rotation.y += 0.005
  });
  
  

  return (
    <>
      
      <mesh
        geometry={torusGeometry}
        material={holographicMaterial}
        ref={torus}
        // rotation={[Math.PI / 2, 0, 0]}
        // position={[0, 1.2, 0]}
        // wireframe
        // scale={new THREE.Vector3(4, 3, 1)}
      ></mesh>
      <ambientLight intensity={0.5}></ambientLight>
      <directionalLight
        castShadow
        position={[4, 2, -2.25]}
        intensity={10}
      ></directionalLight>
      
    </>
  );
}
