import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import type { Country } from '@/types';
import { latLonToVector3 } from '@/utils/geo';

// Natural Earth 110m 国家边界 GeoJSON（通过 jsdelivr CDN 拉取，模块级缓存避免重复请求）
const GEOJSON_URL =
  'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_admin_0_countries.geojson';

// 项目国家 id → Natural Earth GeoJSON 中 NAME 字段的映射
// Korea 特殊处理：同时映射南北朝鲜，以呈现完整半岛轮廓
const COUNTRY_NAME_MAP: Record<string, string[]> = {
  china: ['China'],
  usa: ['United States of America'],
  uk: ['United Kingdom'],
  germany: ['Germany'],
  france: ['France'],
  russia: ['Russia'],
  japan: ['Japan'],
  italy: ['Italy'],
  egypt: ['Egypt'],
  greece: ['Greece'],
  india: ['India'],
  mongolia: ['Mongolia'],
  afghanistan: ['Afghanistan'],
  iraq: ['Iraq'],
  iran: ['Iran'],
  ukraine: ['Ukraine'],
  israel: ['Israel'],
  vietnam: ['Vietnam'],
  korea: ['South Korea', 'North Korea'],
  spain: ['Spain'],
  turkey: ['Turkey'],
  cuba: ['Cuba'],
  rwanda: ['Rwanda'],
  serbia: ['Serbia'],
  yemen: ['Yemen'],
  canada: ['Canada'],
  australia: ['Australia'],
};

const BORDER_RADIUS = 1.005; // 略高于地球表面，避免 z-fighting

interface GeoFeature {
  type: 'Feature';
  properties: { NAME?: string; ADMIN?: string };
  geometry: { type: string; coordinates: unknown };
}

interface BorderLine {
  points: THREE.Vector3[];
  countryId: string;
}

let cachedFeatures: GeoFeature[] | null = null;

interface CountryBordersProps {
  countries: Country[];
  selectedCountryId: string | null;
}

export function CountryBorders({ countries, selectedCountryId }: CountryBordersProps) {
  const [features, setFeatures] = useState<GeoFeature[] | null>(cachedFeatures);

  useEffect(() => {
    if (cachedFeatures) return;
    let cancelled = false;
    fetch(GEOJSON_URL)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        cachedFeatures = (data.features as GeoFeature[]) ?? [];
        setFeatures(cachedFeatures);
      })
      .catch(() => {
        if (!cancelled) setFeatures([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // 国家名 → 国家 id 反查表
  const nameToCountryId = useMemo(() => {
    const map = new Map<string, string>();
    for (const country of countries) {
      const names = COUNTRY_NAME_MAP[country.id];
      if (names) for (const n of names) map.set(n, country.id);
    }
    return map;
  }, [countries]);

  // 将 GeoJSON 边界转换为球面上的线段点集（细分长段以贴合球面）
  const borderLines = useMemo<BorderLine[]>(() => {
    if (!features) return [];
    const lines: BorderLine[] = [];
    for (const feature of features) {
      const name = feature.properties.NAME || feature.properties.ADMIN || '';
      const countryId = nameToCountryId.get(name);
      if (!countryId) continue;
      for (const ring of extractRings(feature.geometry)) {
        const pts = subdivideRing(ring);
        if (pts.length >= 2) lines.push({ points: pts, countryId });
      }
    }
    return lines;
  }, [features, nameToCountryId]);

  if (!features || borderLines.length === 0) return null;

  const hasSelection = selectedCountryId !== null;

  return (
    <group>
      {borderLines.map((line, idx) => {
        const isSelected = line.countryId === selectedCountryId;
        const dimmed = hasSelection && !isSelected;
        return (
          <Line
            key={idx}
            points={line.points}
            color={isSelected ? '#f5c560' : '#e8d4a8'}
            lineWidth={isSelected ? 2.6 : 0.8}
            transparent
            opacity={isSelected ? 1 : dimmed ? 0.1 : 0.42}
            depthWrite={false}
            toneMapped={false}
          />
        );
      })}
    </group>
  );
}

/**
 * 从 GeoJSON 几何体中提取所有环（外环 + 内环/孔洞）。
 */
function extractRings(geometry: { type: string; coordinates: unknown }): number[][][] {
  const rings: number[][][] = [];
  if (geometry.type === 'Polygon') {
    for (const ring of geometry.coordinates as number[][][]) rings.push(ring);
  } else if (geometry.type === 'MultiPolygon') {
    for (const polygon of geometry.coordinates as number[][][][]) {
      for (const ring of polygon) rings.push(ring);
    }
  }
  return rings;
}

/**
 * 将 [lon, lat] 环转换为球面 Vector3 点集。
 * 相邻点夹角过大时按球面插值细分，使线条贴合球面而非穿过球体。
 */
function subdivideRing(ring: number[][], maxSegmentDeg = 2.5): THREE.Vector3[] {
  const result: THREE.Vector3[] = [];
  if (ring.length < 2) return result;
  for (let i = 0; i < ring.length - 1; i++) {
    const [lon1, lat1] = ring[i];
    const [lon2, lat2] = ring[i + 1];
    const p1 = latLonToVector3(lat1, lon1, BORDER_RADIUS);
    const p2 = latLonToVector3(lat2, lon2, BORDER_RADIUS);
    result.push(p1);
    const angleDeg = (p1.angleTo(p2) * 180) / Math.PI;
    if (angleDeg > maxSegmentDeg) {
      const steps = Math.ceil(angleDeg / maxSegmentDeg);
      for (let s = 1; s < steps; s++) {
        const t = s / steps;
        // 线性插值后归一化回球面，近似 slerp
        const p = new THREE.Vector3().lerpVectors(p1, p2, t).normalize().multiplyScalar(BORDER_RADIUS);
        result.push(p);
      }
    }
  }
  // 闭合环
  result.push(latLonToVector3(ring[0][1], ring[0][0], BORDER_RADIUS));
  return result;
}
