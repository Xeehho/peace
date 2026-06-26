import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { Country, War } from '@/types';
import { useAppStore } from '@/stores/appStore';
import { Earth } from './Earth';
import { CountryMarker } from './CountryMarker';
import { CountryBorders } from './CountryBorders';
import { WarArcs } from './WarArcs';
import { CameraController } from './CameraController';

interface GlobeSceneProps {
  countries: Country[];
  wars: War[];
}

export function GlobeScene({ countries, wars }: GlobeSceneProps) {
  const earthGroupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const {
    selectedCountryId,
    hoveredCountryId,
    viewMode,
    timeRange,
    setSelectedCountry,
    setHoveredCountry,
  } = useAppStore();

  useFrame((_, delta) => {
    if (earthGroupRef.current && viewMode === 'global' && controlsRef.current?.enabled) {
      earthGroupRef.current.rotation.y += delta * 0.01;
    }
  });

  const selectedCountry =
    countries.find((c) => c.id === selectedCountryId) || null;

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} color="#fff8f0" />
      <pointLight position={[-5, -2, -5]} intensity={0.4} color="#c88a3d" />
      <hemisphereLight args={['#ffffff', '#4a6fa5', 0.5]} />

      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1.6}
        maxDistance={6}
        autoRotate={false}
        enableDamping={false}
        enabled={viewMode === 'global'}
      />

      <group ref={earthGroupRef}>
        <Earth />
        <CountryBorders
          countries={countries}
          selectedCountryId={selectedCountryId}
        />
        {/* 选中具体国家后隐藏红色战争连线，让国界轮廓成为唯一视觉焦点 */}
        {!selectedCountryId && (
          <WarArcs
            wars={wars}
            countries={countries}
            timeRange={timeRange}
            selectedCountryId={selectedCountryId}
          />
        )}
        {/* 选中具体国家后隐藏全部黄色光点，改由国界轮廓作为视觉焦点 */}
        {!selectedCountryId &&
          countries.map((country) => (
            <CountryMarker
              key={country.id}
              country={country}
              isSelected={country.id === selectedCountryId}
              isHovered={country.id === hoveredCountryId}
              viewMode={viewMode}
              onClick={() => setSelectedCountry(country.id)}
              onPointerEnter={() => setHoveredCountry(country.id)}
              onPointerLeave={() => setHoveredCountry(null)}
            />
          ))}
      </group>

      <CameraController
        targetCountry={selectedCountry}
        viewMode={viewMode}
        controlsRef={controlsRef}
        earthGroupRef={earthGroupRef}
      />
    </>
  );
}
