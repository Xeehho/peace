import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { Country, War } from '@/types';
import { getCountryPosition, createArcPoints } from '@/utils/geo';

interface WarArcsProps {
  wars: War[];
  countries: Country[];
  timeRange: [number, number];
  selectedCountryId: string | null;
}

export function WarArcs({ wars, countries, timeRange, selectedCountryId }: WarArcsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const countryMap = useMemo(() => {
    const map = new Map<string, Country>();
    countries.forEach((c) => map.set(c.id, c));
    return map;
  }, [countries]);

  const visibleArcs = useMemo(() => {
    return wars.filter((war) => {
      const inTimeRange = war.startYear <= timeRange[1] && (war.endYear ?? war.startYear) >= timeRange[0];
      const hasCountries = war.relatedCountryIds.length >= 2;
      const countryMatch =
        selectedCountryId === null || war.relatedCountryIds.includes(selectedCountryId);
      return inTimeRange && hasCountries && countryMatch;
    });
  }, [wars, timeRange, selectedCountryId]);

  const lineGeometries = useMemo(() => {
    return visibleArcs.map((war) => {
      const positions: number[] = [];
      for (let i = 0; i < war.relatedCountryIds.length - 1; i++) {
        const c1 = countryMap.get(war.relatedCountryIds[i]);
        const c2 = countryMap.get(war.relatedCountryIds[i + 1]);
        if (!c1 || !c2) continue;
        const start = getCountryPosition(c1.lat, c1.lon);
        const end = getCountryPosition(c2.lat, c2.lon);
        const points = createArcPoints(start, end, 48, 0.25);
        points.forEach((p) => positions.push(p.x, p.y, p.z));
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      return { geometry, war };
    });
  }, [visibleArcs, countryMap]);

  return (
    <group ref={groupRef}>
      {lineGeometries.map(({ geometry, war }, idx) => {
        const material = new THREE.LineBasicMaterial({
          color: '#b85c4f',
          transparent: true,
          opacity: 0.45,
          toneMapped: false,
        });
        const line = new THREE.Line(geometry, material);
        return <primitive key={`${war.id}-${idx}`} object={line} />;
      })}
    </group>
  );
}
