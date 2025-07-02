import { useGLTF, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function HeadModel(args){
    const model = useGLTF('models/LeePerrySmith/LeePerrySmith.glb')
    // https://drive.google.com/file/d//view?usp=drive_link
    // https://drive.google.com/uc?export=download&id=177uJEdrBdmhCUCqCEEarenVaEDf2oGg-
    // const model = useGLTF('https://daniel-echeveste.github.io/models/LeePerrySmith/LeePerrySmith.glb')
   
    console.log("modelo");
    console.log(model);
    model.materials["Material.002"].map = useTexture('models/LeePerrySmith/color.jpg')
    // model.materials["Material.002"].color = useTexture('models/LeePerrySmith/color.jpg')
    model.materials["Material.002"].normal = useTexture('models/LeePerrySmith/normal.jpg')
    model.materials["Material.002"].normalMap = useTexture('models/LeePerrySmith/normal.jpg')


   
    const customUniforms = {
        uTime : {value:0}
    }

    useFrame((state, delta) => {
        customUniforms.uTime.value = state.clock.elapsedTime;
    })

    model.materials["Material.002"].onBeforeCompile = (shader)=>{
        console.log(shader.vertexShader)
        shader.uniforms.uTime = customUniforms.uTime
        shader.vertexShader = shader.vertexShader.replace( 
            '#include <common>',
            `
            #include <common>
            
            uniform float uTime;

            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
            }
            
            `)
        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
            #include <begin_vertex>
            
            float angle = (position.y + uTime) * 0.8;
            
            mat2 rotateMatrix = get2dRotateMatrix(angle);

            transformed.xz = rotateMatrix * transformed.xz;
            
            `)
    }
    // model.materials[0].color = useTexture('models/LeePerrySmith/color.jpg')
    
    
    return <primitive object={model.scene} castShadow position-z={-4} scale={1}/>
}
useGLTF.preload('models/LeePerrySmith/LeePerrySmith.glb')