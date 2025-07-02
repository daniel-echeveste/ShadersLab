import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import * as THREE from "three"
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useControls } from "leva";
import atmosphereFragmentShader from "./atmosphere/fragment.glsl"
import atmosphereVertexShader from "./atmosphere/vertex.glsl"
export default function Earth(args) {
    const earth = useRef()
    const sunRef = useRef()
    document.body.style.backgroundColor = "#000011"

    //texture
    const textureLoader = new THREE.TextureLoader();
    const earthDayTexture = textureLoader.load("./textures/earth/day.jpg");
    earthDayTexture.colorSpace = THREE.SRGBColorSpace;
    earthDayTexture.anisotropy = 8;
    const earthNightTexture = textureLoader.load("./textures/earth/night.jpg");
    earthNightTexture.colorSpace = THREE.SRGBColorSpace;
    earthNightTexture.anisotropy = 8;
    const earthCloudTexture = textureLoader.load("./textures/earth/specularClouds.jpg");
    earthCloudTexture.colorSpace = THREE.SRGBColorSpace;
    earthCloudTexture.anisotropy = 8;
    const sunTexture = textureLoader.load("./textures/sun/2k_sun.jpg");
    sunTexture.colorSpace = THREE.SRGBColorSpace;
    sunTexture.anisotropy = 8;

    const controls = useControls({
        usunSphericalPhi:
        {
            value: Math.PI * 0.5, min: 0, max: Math.PI, step: 0.01,
            
        },
        usunSphericalTheta: { 
            value: -1.4, min: -Math.PI ,max: Math.PI, step: 0.01,
         },
         uAtmosphereDayColor : {value:"#00aaff"},
         uAtmosphereTwilightColor : {value:"#ff6600"},

    })
    // sun
    const sunSpherical = new THREE.Spherical(1, controls.usunSphericalPhi, controls.usunSphericalTheta)
    const sunDirection = new THREE.Vector3()
    sunDirection.setFromSpherical(sunSpherical)
    console.log(sunDirection)
    
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms:
        {
            uDayTexture: new THREE.Uniform(earthDayTexture),
            uNightTexture: new THREE.Uniform(earthNightTexture),
            uSpecularCloudTexture: new THREE.Uniform(earthCloudTexture),
            uSunDirection: new THREE.Uniform(new THREE.Vector3(sunDirection)),
            uAtmosphereDayColor : new THREE.Uniform(new THREE.Color(controls.uAtmosphereDayColor)),
            uAtmosphereTwilightColor : new THREE.Uniform(new THREE.Color(controls.uAtmosphereTwilightColor)),
        }
    })
    const atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        uniforms:
        {
            uSunDirection: new THREE.Uniform(new THREE.Vector3(sunDirection)),
            uAtmosphereDayColor : new THREE.Uniform(new THREE.Color(controls.uAtmosphereDayColor)),
            uAtmosphereTwilightColor : new THREE.Uniform(new THREE.Color(controls.uAtmosphereTwilightColor)),
        },
        side: THREE.BackSide,
        transparent:true,
    })
    const updateSun = () => {
        sunDirection.setFromSpherical(sunSpherical)
        if (sunRef.current) {
            sunRef.current.position.copy(sunDirection).multiplyScalar(5)
        }
        material.uniforms.uSunDirection.value.copy(sunDirection)
        atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection)
    }
    updateSun()
    
    useFrame(() => {
        if (earth.current) {
            // earth.current.rotation.x += 0.01;
            earth.current.rotation.y += 0.001;
        }
        if (sunRef.current) {
            sunRef.current.rotation.y += 0.002;
            // sunSpherical.theta += 0.001;
            updateSun()
        }
        // material.uniforms.uTime.value += 0.01;
    })
    
    return (
        <>
              <Environment
              backgroundBlurriness={0}
                files={"textures/sun/stars.jpg"}
                background  
                encoding={THREE.sRGBEncoding}
              ></Environment>
            <mesh ref={earth} material={material}>
                <sphereGeometry args={[3, 64, 64]} />
            </mesh>
            <mesh material={atmosphereMaterial} >
                <sphereGeometry args={[3.1, 64, 64] } />
            </mesh>
            {/* debug sun  */}
            <mesh ref={sunRef}  >
                <sphereGeometry args={[0.2, 64, 64]} />
                <meshBasicMaterial color="yellow" map={sunTexture} />
            </mesh>
        </>
    )
}

