import { useRef } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

export function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);

  const [map, normalMap, specularMap] = useTexture([
    '/textures/earth_atmos_2048.jpg',
    '/textures/earth_normal_2048.jpg',
    '/textures/earth_specular_2048.jpg',
  ]);

  map.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 128, 128]} />
      <meshStandardMaterial
        map={map}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(0.5, 0.5)}
        roughnessMap={specularMap}
        roughness={0.6}
        metalness={0.1}
        emissive={new THREE.Color('#3a4a5a')}
        emissiveMap={map}
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}
