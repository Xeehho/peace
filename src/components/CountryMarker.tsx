import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Country } from '@/types';
import { getCountryPosition } from '@/utils/geo';
import { useT, localized } from '@/i18n/useT';

interface CountryMarkerProps {
  country: Country;
  isSelected: boolean;
  isHovered: boolean;
  viewMode: 'global' | 'country';
  onClick: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

const COLOR_DEFAULT = new THREE.Color('#b85c4f');
const COLOR_ACTIVE = new THREE.Color('#c88a3d');

export function CountryMarker({
  country,
  isSelected,
  isHovered,
  viewMode,
  onClick,
  onPointerEnter,
  onPointerLeave,
}: CountryMarkerProps) {
  const markerRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const position = useMemo(() => getCountryPosition(country.lat, country.lon), [country.lat, country.lon]);
  const { lang } = useT();

  useFrame((_, delta) => {
    const active = isSelected || isHovered;
    const targetScale = isSelected ? 1.5 : active ? 1.25 : 1;
    const targetGlowOpacity = active ? (isSelected ? 0.32 : 0.22) : 0;

    if (markerRef.current) {
      markerRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
      const material = markerRef.current.material as THREE.MeshBasicMaterial;
      material.color.lerp(active ? COLOR_ACTIVE : COLOR_DEFAULT, delta * 10);
    }

    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = THREE.MathUtils.lerp(material.opacity, targetGlowOpacity, delta * 8);
      const glowScale = isSelected ? 2.4 : 2.0;
      glowRef.current.scale.lerp(new THREE.Vector3(glowScale, glowScale, glowScale), delta * 8);
    }
  });

  return (
    <group position={position}>
      {/* Larger invisible hit target for stable hover */}
      <mesh
        scale={3.5}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          onPointerEnter();
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          onPointerLeave();
        }}
      >
        <sphereGeometry args={[0.024, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh ref={markerRef}>
        <sphereGeometry args={[0.024, 16, 16]} />
        <meshBasicMaterial color={COLOR_DEFAULT} toneMapped={false} />
      </mesh>

      <mesh ref={glowRef}>
        <sphereGeometry args={[0.024, 16, 16]} />
        <meshBasicMaterial
          color="#c88a3d"
          transparent
          opacity={0}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {isHovered && !isSelected && (
        <Html
          distanceFactor={viewMode === 'country' ? 22 : 10}
          style={{ pointerEvents: 'none' }}
          zIndexRange={[10, 0]}
        >
          <div className="whitespace-nowrap rounded border border-archive-border bg-white/95 px-1.5 py-0.5 text-[9px] font-medium text-archive-ink shadow-soft">
            {localized(country, 'name', lang)}
          </div>
        </Html>
      )}
    </group>
  );
}
