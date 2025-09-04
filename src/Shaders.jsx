import * as THREE from "three";
import { useState, useEffect } from "react";
// import { cameraShaders } froçm "./camera/CameraControls";
import { OrbitControls } from "@react-three/drei";
import {
  Html,
  Environment,
  Text3D,
  Center,
} from "@react-three/drei";
const shaderModules = import.meta.glob('./shaders/**/shader.jsx');
export default function Shaders({currentIndex, setCurrentIndex, shaders, setShaders}) 
{
  
  useEffect(() => {
    const loadShaders = async () => {
      const entries = Object.entries(shaderModules);
      const loaded = await Promise.all(
        entries.map(async ([path, importer]) => {
          const mod = await importer();
          const name = path.split('/').slice(-2, -1)[0]; // carpeta antes de shader.jsx
          return { name, Component: mod.default };
        })
      );

      setShaders(loaded);
    };

    loadShaders();
  }, []);
  const ActiveShader = shaders[currentIndex]?.Component;
  return (
    <>
      <OrbitControls enableZoom={false} />
      <ambientLight intensity={0.2} />
      <Environment 
      intensity={0.2} 
      preset="sunset" 
      // background
      />
      {/* <spotLight
        castShadow
        intensity={2}
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        shadow-normalBias={0.05}
        shadow-bias={0.0001}
      /> */}
      
      {shaders.length > 0 &&  ActiveShader && (
        <group>
          <group position={[0, 0, 0]}>
            <Center position={[0, 4, 0]}>
              <Text3D
                position={[0, 4, 0]}
                // onClick={nextShader}
                font="fonts/roboto/roboto.json"
                scale={1}
                lineHeight={0.75}
                textAlign="center"
              >
                {shaders[currentIndex].name}
                <meshStandardMaterial
                  toneMapped={false}
                  side={THREE.DoubleSide}
                  color={"red"}
                />
              </Text3D>
            </Center>

            {/* Shader activo */}
            {}
             <ActiveShader /> 
            
          </group>
          
        </group>
      )}
      {/* NAVEGATION  */}
      {/* <Html position={[0, 0, 0]} center >
            <div className="relative w-screen  ">
              <button
                onClick={prevShader}
                className="fixed left-10 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full cursor-pointer" 
              >
                ◀️
              </button>
              <button
                onClick={nextShader}
                className="fixed right-10 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full cursor-pointer"
              >
                ▶️
              </button>
            </div>
        </Html> */}
    </>
  );
}
