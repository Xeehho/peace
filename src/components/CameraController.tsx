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
  earthGroupRef: React.RefObject<THREE.Group>;
}

const DEFAULT_POSITION = new THREE.Vector3(0, 0.6, 3.4);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);
const TRANSITION_DURATION = 2.5;
const Y_AXIS = new THREE.Vector3(0, 1, 0);

export function CameraController({ targetCountry, viewMode, controlsRef, earthGroupRef }: CameraControllerProps) {
  const { camera } = useThree();
  const targetPos = useRef(DEFAULT_POSITION.clone());
  const targetLookAt = useRef(DEFAULT_TARGET.clone());
  const startPos = useRef(DEFAULT_POSITION.clone());
  const startLookAt = useRef(DEFAULT_TARGET.clone());
  const progress = useRef(1);
  const finished = useRef(true);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }

    startPos.current.copy(camera.position);
    startLookAt.current.copy(controlsRef.current?.target ?? DEFAULT_TARGET);

    if (targetCountry && viewMode === 'country') {
      // 国家在地球组中的局部坐标；需应用地球组当前 Y 旋转得到世界坐标，
      // 否则地球自转后国家实际世界位置与相机目标不一致，无法居中
      const localPos = getCountryPosition(targetCountry.lat, targetCountry.lon);
      const earthRotY = earthGroupRef.current?.rotation.y ?? 0;
      const worldPos = localPos.clone().applyAxisAngle(Y_AXIS, earthRotY);
      targetPos.current.copy(worldPos).multiplyScalar(2.0);
      targetLookAt.current.copy(worldPos).normalize().multiplyScalar(0.6);
    } else {
      targetPos.current.copy(DEFAULT_POSITION);
      targetLookAt.current.copy(DEFAULT_TARGET);
    }
    progress.current = 0;
    finished.current = false;
  }, [targetCountry, viewMode, controlsRef, camera.position, earthGroupRef]);

  useFrame((_, delta) => {
    if (progress.current < 1) {
      progress.current = Math.min(progress.current + delta / TRANSITION_DURATION, 1);
      const t = easeInOutCubic(progress.current);

      camera.position.copy(startPos.current).lerp(targetPos.current, t);
      const currentLookAt = new THREE.Vector3()
        .copy(startLookAt.current)
        .lerp(targetLookAt.current, t);
      camera.lookAt(currentLookAt);

      if (progress.current >= 1 && !finished.current) {
        finished.current = true;
        if (controlsRef.current) {
          // Sync controls target with final lookAt, then enable for global mode
          controlsRef.current.target.copy(targetLookAt.current);
          controlsRef.current.enabled = viewMode === 'global';
          // Do NOT call update() — it would snap the camera based on stale internal state
        }
      }
    }
  });

  return null;
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
