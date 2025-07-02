import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import * as THREE from "three"
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useControls } from "leva";
import { text } from "framer-motion/client";

export default function CursorParticles(args) {
    // const particlesGeometry = useRef()

    document.body.style.backgroundColor = "#000011"
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    
    const displacement =
    {

    }

    // 2d canvas
    // useState(() => {

    // }, [])

    displacement.canvas = document.createElement('canvas')
    displacement.canvas.width = 128
    displacement.canvas.height = 128
    // document.body.append(displacement.canvas)
    displacement.canvas.style.width = "256px"
    displacement.canvas.style.height = "256px"
    displacement.canvas.style.position = "fixed"
    displacement.canvas.style.top = "50px"
    displacement.canvas.style.left = "0"
    displacement.canvas.style.zIndex = "1000"
    displacement.canvas.style.pointerEvents = "none"

    // context
    displacement.context = displacement.canvas.getContext('2d')
    displacement.context.fillStyle = "black"
    displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)
    //glow image
    displacement.glowImage = new Image()
    displacement.glowImage.src = "/textures/imgs/glow.png"


    //raycaster
    displacement.raycaster = new THREE.Raycaster()

    //coordinates
    displacement.screenCursor = new THREE.Vector2(999, 999)
    displacement.CanvasCursor = new THREE.Vector2(999, 999)
    displacement.CanvasCursorPrevious = new THREE.Vector2(999, 999)
    //events
    window.addEventListener('mousemove', (event) => {
        displacement.screenCursor.set(
            (event.clientX / sizes.width) * 2 - 1,
            - (event.clientY / sizes.height) * 2 + 1
        )
    })

    const particlesGeometry = new THREE.PlaneGeometry(10, 10, 128, 128)

    const intensitiesArray = new Float32Array(particlesGeometry.attributes.position.count)
    const anglesArray = new Float32Array(particlesGeometry.attributes.position.count)
    for (let i = 0; i < particlesGeometry.attributes.position.count; i++) {
        intensitiesArray[i] = Math.random()
        anglesArray[i] = Math.random() * Math.PI * 2
    }
    particlesGeometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensitiesArray, 1))
    particlesGeometry.setAttribute('aAngle', new THREE.BufferAttribute(anglesArray, 1))
    particlesGeometry.setIndex(null)


    

    const textureLoader = new THREE.TextureLoader()
    const pictureTexture1 = textureLoader.load('/textures/imgs/picture-1.png')
    const pictureTexture2 = textureLoader.load('/textures/imgs/picture-2.png')
    const pictureTexture3 = textureLoader.load('/textures/imgs/picture-3.png')
    const pictureTexture4 = textureLoader.load('/textures/imgs/picture-4.png')

    const controls = useControls({
        picture: {
            value: pictureTexture1,
            options: [pictureTexture1, pictureTexture2, pictureTexture3, pictureTexture4]
        }
    })
    const particlesMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms:
        {
            uTime: { value: 0 },
            uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width, sizes.height)),
            uPictureTexture: new THREE.Uniform(controls.picture),
            uDisplacementTexture: new THREE.Uniform(displacement.texture)
        }
    })



    //displacement texture

    displacement.texture = new THREE.CanvasTexture(displacement.canvas)
    

    const eventHandler = (event) => {
        console.log(event)
        displacement.CanvasCursor.x = event.uv.x * displacement.canvas.width
        displacement.CanvasCursor.y = (1 - event.uv.y) * displacement.canvas.height
    }

    useFrame(() => {
        particlesMaterial.uniforms.uTime.value += 0.01;
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        particlesMaterial.uniforms.uResolution.value.set(sizes.width, sizes.height);
        const cursorDistance = displacement.CanvasCursorPrevious.distanceTo(displacement.CanvasCursor)
        const alpha = Math.min(cursorDistance * 0.01, 1)
        displacement.CanvasCursorPrevious.copy(displacement.CanvasCursor)
        //canvas 

        displacement.context.globalCompositeOperation = "source-over"
        displacement.context.globalAlpha = 0.02
        displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)
        const glowSize = displacement.canvas.width * 0.25

        displacement.context.globalCompositeOperation = "lighten"
        displacement.context.globalAlpha = alpha

        displacement.context.drawImage(
            displacement.glowImage,
            displacement.CanvasCursor.x - glowSize * 0.5,
            displacement.CanvasCursor.y - glowSize * 0.5,
            glowSize,
            glowSize)
        //texture
        displacement.texture.needsUpdate = true
        particlesMaterial.uniforms.uDisplacementTexture.value = displacement.texture
        
    })

    return (
        <>
            <points material={particlesMaterial} geometry={particlesGeometry}>
                {/* <planeGeometry ref={particlesGeometry} attributes={
                    {
                        aIntensity: new THREE.BufferAttribute(intensitiesArray, 1),
                        aAngle: new THREE.BufferAttribute(anglesArray, 1)
                    }
                } args={[10, 10, 128, 128]} /> */}
            </points>
            //interactions
            <mesh onPointerMove={eventHandler} visible={false}>
                <planeGeometry args={[10, 10, 128, 128]} />
                <meshBasicMaterial color="white" side={THREE.DoubleSide}/>
            </mesh>

        </>
    )
}

