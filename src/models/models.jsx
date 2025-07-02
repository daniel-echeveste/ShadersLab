import { useGLTF, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function ExampleModel(args){
    const model = useGLTF('models/models.glb')
    
    return <primitive object={model.scene} castShadow {...args}/>
}
useGLTF.preload('models/models.glb')