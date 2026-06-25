import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { Country } from '@/types';
import { getCountryPosition } from '@/utils/geo';

interface CameraControllerProps {
  targetCountry: Country | null;
  viewMode: 'global' | 'country';
  controlsRef: React.RefObject<OrbitControlsImpl>;
}

const DEFAULT_POSITION = new THREE.Vector3(0, 0.6, 3.4);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);
const TRANSITION_DURATION = 2.5; // seconds

export function CameraController({ targetCountry, viewMode, controlsRef }: CameraControllerProps) {
  const { camera } = useThree();
  const targetPos = useRef(DEFAULT_POSITION.clone());
  const targetLookAt = useRef(DEFAULT_TARGET.clone());
  const startPos = useRef(DEFAULT_POSITION.clone());
  const startLookAt = useRef(DEFAULT_TARGET.clone());
  const progress = useRef(1);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }

    startPos.current.copy(camera.position);
    startLookAt.current.copy(controlsRef.current?.target ?? DEFAULT_TARGET);

    if (targetCountry && viewMode === 'country') {
      const pos = getCountryPosition(targetCountry.lat, targetCountry.lon);
      targetPos.current.copy(pos).multiplyScalar(2.0);
      targetLookAt.current.copy(pos).normalize().multiplyScalar(0.6);
    } else {
      targetPos.current.copy(DEFAULT_POSITION);
      targetLookAt.current.copy(DEFAULT_TARGET);
    }
    progress.current = 0;
  }, [targetCountry, viewMode, controlsRef, camera.position]);

  useFrame((_, delta) => {
    if (progress.current < 1) {
      progress.current = Math.min(progress.current + delta / TRANSITION_DURATION, 1);
      const t = easeInOutCubic(progress.current);

      camera.position.copy(startPos.current).lerp(targetPos.current, t);
      const currentLookAt = new THREE.Vector3()
        .copy(startLookAt.current)
        .lerp(targetLookAt.current, t);
      camera.lookAt(currentLookAt);

      if (progress.current >= 1 && controlsRef.current) {
        controlsRef.current.enabled = viewMode === 'global';
        controlsRef.current.target.copy(targetLookAt.current);
        controlsRef.current.update();
      }
    }
  });

  return null;
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
