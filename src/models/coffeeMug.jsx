import { useGLTF, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function coffeeMugModel(args){
    const model = useGLTF('models/coffeeMug/bakedModel.glb')
    console.log(args);
    
    return <primitive object={model.scene} castShadow {...args}/>
}
useGLTF.preload('models/LeePerrySmith/LeePerrySmith.glb')