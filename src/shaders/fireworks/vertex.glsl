
uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aSize;
attribute float aTimeMultiplayer;
float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)
{
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

void main(){
    float progress = uProgress * aTimeMultiplayer;
    vec3 newPosition = position;
    
    //explosion
    float explodingProgress = remap(progress, 0.0, 1.0, 0.0, 1.5);
    explodingProgress = clamp(explodingProgress, 0.0, 1.0);
    explodingProgress = 1.0 - pow(1.0 - explodingProgress, 3.0);
    newPosition *= explodingProgress;

    //falling 
    float fallingProgress = remap(progress, 0.1, 1.0, 0.0, 1.0);
    fallingProgress = clamp(fallingProgress, 0.0, 1.0);
    fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);
    newPosition.y -= fallingProgress * 0.3;

    //scale 
    float sizeOpeningProgress = remap(progress, 0.0, 0.125,0.0,1.0);
    float sizeClosingProgress = remap(progress,0.125, 1.125,1.0, 0.0);         
    float sizeProgress = min(sizeOpeningProgress, sizeClosingProgress);

    //twinkling 
    float twinklingProgress = remap(progress, 0.0, 0.125,0.0,1.0);
    twinklingProgress= clamp(twinklingProgress, 0.0, 1.0);
    float sizeTwinkling = sin(progress * 30.0) * 0.5 + 0.5; 
    sizeTwinkling = 1.0 - sizeTwinkling * twinklingProgress;

    //final position 
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0) ;
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    // Final size
    gl_PointSize = uSize * uResolution.y * aSize * sizeProgress * sizeTwinkling;
    gl_PointSize *= 1.0 / -viewPosition.z; //perspective
    
    if(gl_PointSize<1.0)
        gl_Position= vec4(9999.9);
}