import { useEffect, useState } from "react";
// ImageGallery.jsx
import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { ScrollControls, Scroll } from "@react-three/drei";

export default function ImageGallery() {
 
  
  const images = [
    "./textures/imgs/picture-1.png",
    "./textures/imgs/picture-2.png",
    "./textures/imgs/picture-3.png",
    "./textures/imgs/picture-4.png",
  ];
  const textures = useLoader(TextureLoader, images);
 const panels = useMemo(() => {
    return textures.map((texture, i) => ({
      texture,
      key: `panel-${i}`,
    }));
  }, [textures]);

  return (
    <ScrollControls pages={images.length} damping={0.2}>
      <Scroll>
        {panels.map((panel, i) => (
          <mesh key={panel.key} position={[0, -i * 3, 0]}>
            <planeGeometry args={[3, 2]} />
            <meshBasicMaterial map={panel.texture} />
          </mesh>
        ))}
      </Scroll>
    </ScrollControls>
  );
}