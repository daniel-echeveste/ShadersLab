import { useGLTF, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function Island1(args){
    const model = useGLTF('models/floating_island.glb')
    console.log(args);
    
    return <primitive object={model.scene} castShadow {...args}/>
}
useGLTF.preload('models/floating_island.glb')