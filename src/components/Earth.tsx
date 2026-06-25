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
        normalScale={new THREE.Vector2(0.6, 0.6)}
        roughnessMap={specularMap}
        roughness={0.75}
        metalness={0.05}
      />
    </mesh>
  );
}
