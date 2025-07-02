import { Canvas } from "@react-three/fiber";
import './styles/style.css'
import Shaders from "./Shaders.jsx";


export default function App() {
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
                <Shaders />
            </Canvas>

        </>
    );
}
