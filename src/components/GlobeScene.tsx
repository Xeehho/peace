import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { Country, War } from '@/types';
import { useAppStore } from '@/stores/appStore';
import { Earth } from './Earth';
import { Atmosphere } from './Atmosphere';
import { CountryMarker } from './CountryMarker';
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
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 3, 5]} intensity={1.1} color="#fff8f0" />
      <pointLight position={[-5, -2, -5]} intensity={0.25} color="#c88a3d" />

      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1.6}
        maxDistance={6}
        autoRotate={false}
        enabled={viewMode === 'global'}
      />

      <group ref={earthGroupRef}>
        <Earth />
        <Atmosphere />
        <WarArcs
          wars={wars}
          countries={countries}
          timeRange={timeRange}
          selectedCountryId={selectedCountryId}
        />
        {countries.map((country) => (
          <CountryMarker
            key={country.id}
            country={country}
            isSelected={country.id === selectedCountryId}
            isHovered={country.id === hoveredCountryId}
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
      />
    </>
  );
}
