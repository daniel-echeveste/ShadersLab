import { useGLTF, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function Ship(args){
    const model = useGLTF('models/ship/model.glb')
    
    return <primitive object={model.scene} castShadow {...args}/>
}
useGLTF.preload('models/ship/model.glb')