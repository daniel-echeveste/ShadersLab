import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import fragmentShader from "./fragment.glsl";
import vertexShader from "./vertex.glsl";
import { v4 as uuidv4 } from "uuid";
import gsap from "gsap";
import { useEffect, useState } from "react";
import { Sky } from "@react-three/drei";


export default function Fireworks() {
  let fireworkCounter = 1
  const [fireworks, setFireworks] = useState([]);
  const { camera } = useThree();
 
  const textureLoader = new THREE.TextureLoader();
  useEffect(() => {
  const handleClick = () => {
    setFireworks([]); // clear previous fireworks
    for(let i=0; i<fireworkCounter; i++){
      createRandomFirework();
    }
    fireworkCounter *=2;
    if(fireworkCounter == 40)fireworkCounter = 0
  };

  window.addEventListener("click", handleClick);

  return () => {
    window.removeEventListener("click", handleClick); // cleanup
  }; 
}, []);
  const textures = [
    textureLoader.load("./textures/particles/1.png"),
    textureLoader.load("./textures/particles/2.png"),
    textureLoader.load("./textures/particles/3.png"),
    textureLoader.load("./textures/particles/4.png"),
    textureLoader.load("./textures/particles/5.png"),
    textureLoader.load("./textures/particles/6.png"),
    textureLoader.load("./textures/particles/7.png"),
    textureLoader.load("./textures/particles/8.png"),
  ];
  const createFirework = (count, position, size, texture, radius, color) => {
    const positions = new Float32Array(count * 3);
    const sizesArray = new Float32Array(count);
    const timeMultiplayersArray = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const spherical = new THREE.Spherical(
        radius * (0.75 + Math.random() * 0.25),
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2
      );
      const position = new THREE.Vector3();
      position.setFromSpherical(spherical);
      positions[i3] = position.x;
      positions[i3 + 1] = position.y;
      positions[i3 + 2] = position.z;

      sizesArray[i] = Math.random();

      timeMultiplayersArray[i] = 1 + Math.random();
    }

    //material
    // texture.flipY = false
    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthFunc: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uSize: new THREE.Uniform(size),
        uResolution: new THREE.Uniform(
          new THREE.Vector2(window.innerWidth, window.innerHeight)
        ),
        uTexture: new THREE.Uniform(texture),
        uColor: new THREE.Uniform(color),
        uProgress: new THREE.Uniform(0),
      },
    });
    //geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizesArray, 1));
    geometry.setAttribute(
      "aTimeMultiplayer",
      new THREE.BufferAttribute(timeMultiplayersArray, 1)
    );

    const id = uuidv4();
    setFireworks((prev) => [
      ...prev,
      { position, positions, sizesArray, material, geometry, id },
    ]);

    gsap.to(material.uniforms.uProgress, {
      value: 1,
      duration: 3,
      ease: "linear",
      onComplete: () => destroy(id),
    });
    const destroy = (id) => {
      setFireworks((prev) => {
        const fw = prev.find((fw) => fw.id === id);
        if (fw) {
          fw.material.dispose();
          fw.geometry.dispose();
        }
        return prev.filter((fw) => fw.id !== id);
      });
    };
  };
  const createRandomFirework = () => {
    console.log(fireworks);

    const count = Math.round(400 + Math.random() * 3000);
    const position = new THREE.Vector3(
      (Math.random() - 0.5) * 8,
     (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8
    );
    const size = 0.1 + Math.random() * 0.1;
    const texture = textures[Math.floor(Math.random() * textures.length)];
    const radius = 0.5 + Math.random();
    const color = new THREE.Color();
    color.setHSL(Math.random(), 1, 0.7);
    createFirework(count, position, size, texture, radius, color);
  };
  const sunsetSky =  
    {
        PositionX : 0, PositionY:  0.5, PositionZ:  0,
        Azimuth:  0, Elevation: -2.2, Distance:  450000,
        Inclination:  0.5, mieCoefficient:  0.005, mieDirectionalG:  0.95,
        rayleigh:  3, turbidity: 10, Exposure: THREE.CineonToneMapping, 
    }
  return (
    <>
      <Sky 
            inclination={sunsetSky.Inclination}
            azimuth={sunsetSky.Azimuth}
             distance={sunsetSky.Distance}
             mieCoefficient = {sunsetSky.mieCoefficient}
             mieDirectionalG = {sunsetSky.mieDirectionalG}
             rayleigh = {sunsetSky.rayleigh}
             turbidity = {sunsetSky.turbidity}
             exposure = {sunsetSky.Exposure}
        />
      {fireworks.map((fw, idx) => (
        <points
          key={idx}
          material={fw.material}
          geometry={fw.geometry}
          position={fw.position}
        >
          {/* <bufferGeometry >
            <bufferAttribute
              position={fw.position}
              attach="attributes-position"
              array={fw.positions}
              count={fw.positions.length / 3}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-aSize"
              array={fw.sizesArray}
              count={fw.sizesArray.length}
              itemSize={1}
            />
          </bufferGeometry> */}
          {/* <pointsMaterial color="orange" size={0.05} /> */}
        </points>
      ))}
    </>
  );
}
