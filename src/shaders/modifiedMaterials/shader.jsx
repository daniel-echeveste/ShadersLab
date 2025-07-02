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
import { useFrame, extend, } from "@react-three/fiber";
import Placeholder from "../../models/Placeholder";
import HeadModel from "../../models/HeadModel";
// import testVertexShader from './vertex.glsl'
// import testFragmentShader from './fragment.glsl'
import { useControls } from "leva";

export default function ModifiedMaterial() {
  return (
    <>
    <ambientLight intensity={0.5}></ambientLight>
   
    <directionalLight castShadow position={[4, 2, - 2.25]} intensity={10}></directionalLight>
      <Environment
        files={"textures/environmentMaps/red_wall_4k.hdr"}
        background
        
      ></Environment>
      <Suspense fallback={<Placeholder position-y={0.5} scale={[2, 3, 2]} />}>
        <HeadModel ></HeadModel>
      </Suspense>
      
      <mesh position={[-5,0,-4]} rotation={[0,Math.PI/2,0]} scale={[15,15,15]} receiveShadow>
        <planeGeometry></planeGeometry>
        <meshStandardMaterial color={"white"}></meshStandardMaterial>
      </mesh>
    </>
  );
}
