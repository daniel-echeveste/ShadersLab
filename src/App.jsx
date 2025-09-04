import { Canvas } from "@react-three/fiber";
import './styles/style.css'
import Shaders from "./Shaders.jsx";
import ShaderControls from "./shaderControls.jsx";



import { useState } from "react";

export default function App() {
    const [shaders, setShaders] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
     const nextShader = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % shaders.length);
      };  
      const prevShader = () => {
        setCurrentIndex((prevIndex) =>
          (prevIndex - 1 + shaders.length) % shaders.length
        );
      };
    return (
        <>
            <Canvas
                className={`transition-all duration-600 ease-linear fixed inset-0 `}
                id="canvas"
                shadows
                camera={{
                    fov: 60,
                    near: 0.1,
                    far: 500,
                    position: [0, 2, 10],
                }}
            >
                <Shaders currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} shaders={shaders} setShaders={setShaders} />
            </Canvas>
            <ShaderControls nextShader={nextShader} prevShader={prevShader} />

        </>
    );
}
