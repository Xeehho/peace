import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Country, War } from '@/types';
import { getCountryPosition } from '@/utils/geo';

interface WarArcsProps {
  wars: War[];
  countries: Country[];
  timeRange: [number, number];
  selectedCountryId: string | null;
}

/**
 * 战争弧线 + 沿曲线流动的发光光点 + 落地爆炸特效。
 * 弧线本体为暗红色半透明线，光点沿曲线从一端飞向另一端，
 * 到达终点时产生扩散冲击波环 + 火花粒子，模拟"炮弹轰炸"效果。
 */
export function WarArcs({ wars, countries, timeRange, selectedCountryId }: WarArcsProps) {
  const groupRef = useRef<THREE.Group>(null);
  // 光点 mesh 引用数组
  const dotRefs = useRef<(THREE.Mesh | null)[]>([]);
  // 拖尾线段引用数组（炮弹飞行轨迹的动态尾迹）
  const trailRefs = useRef<(THREE.Line | null)[]>([]);
  // 拖尾几何体引用，用于每帧更新顶点
  const trailGeoRefs = useRef<(THREE.BufferGeometry | null)[]>([]);
  // 爆炸冲击波环引用数组
  const shockRefs = useRef<(THREE.Mesh | null)[]>([]);
  // 爆炸火花引用数组（每个终点多个粒子）
  const sparkRefs = useRef<(THREE.Mesh | null)[]>([]);

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

  // 为每条弧线生成几何体 + 曲线对象
  const arcData = useMemo(() => {
    return visibleArcs.map((war) => {
      const segments: { geometry: THREE.BufferGeometry; curve: THREE.QuadraticBezierCurve3 | null }[] = [];

      for (let i = 0; i < war.relatedCountryIds.length - 1; i++) {
        const c1 = countryMap.get(war.relatedCountryIds[i]);
        const c2 = countryMap.get(war.relatedCountryIds[i + 1]);
        if (!c1 || !c2) continue;

        const start = getCountryPosition(c1.lat, c1.lon);
        const end = getCountryPosition(c2.lat, c2.lon);

        // 构建贝塞尔曲线
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const midLength = mid.length();
        mid.normalize().multiplyScalar(midLength + 0.25);
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);

        const points = curve.getPoints(48);
        const positions: number[] = [];
        points.forEach((p) => positions.push(p.x, p.y, p.z));

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        segments.push({ geometry, curve });
      }

      return { war, segments };
    });
  }, [visibleArcs, countryMap]);

  // 扁平化所有曲线段
  const allSegments = useMemo(() => {
    const list: { curve: THREE.QuadraticBezierCurve3; warId: string; idx: number }[] = [];
    arcData.forEach(({ war, segments }) => {
      segments.forEach((seg, i) => {
        if (seg.curve) list.push({ curve: seg.curve, warId: war.id, idx: i });
      });
    });
    return list;
  }, [arcData]);

  // 每条弧的火花数量
  const SPARK_COUNT = 6;
  // 拖尾段数（炮弹身后保留多少个点构成尾迹线段）
  const TRAIL_SEGMENTS = 12;

  // 每帧更新光点位置和爆炸特效
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    allSegments.forEach((seg, i) => {
      const mesh = dotRefs.current[i];
      if (!mesh) return;
      // 每条弧的光点速度略有差异（缓慢飞行让炮弹轨迹更清晰可见）
      const speed = 0.10 + (i % 3) * 0.03;
      const rawT = (time * speed + i * 0.2) % 1.0;
      const t = (rawT + 1.0) % 1.0;
      const pos = seg.curve.getPoint(t);
      mesh.position.copy(pos);
      // 光点在弧线起点和终点附近渐隐，中间最亮
      const fade = Math.sin(t * Math.PI);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = fade * 0.9;
      mesh.scale.setScalar(0.3 + fade * 0.7);

      // ---- 拖尾尾迹：从炮弹位置往回取一小段曲线，动态更新顶点 ----
      const trailGeo = trailGeoRefs.current[i];
      const trailLine = trailRefs.current[i];
      if (trailGeo && trailLine) {
        const positions = trailGeo.attributes.position.array as Float32Array;
        // 拖尾长度：占整条弧的 12%
        const trailLength = 0.12;
        const trailStart = Math.max(0, t - trailLength);
        for (let s = 0; s <= TRAIL_SEGMENTS; s++) {
          const sampleT = trailStart + (t - trailStart) * (s / TRAIL_SEGMENTS);
          const p = seg.curve.getPoint(sampleT);
          positions[s * 3] = p.x;
          positions[s * 3 + 1] = p.y;
          positions[s * 3 + 2] = p.z;
        }
        trailGeo.attributes.position.needsUpdate = true;
        // 拖尾透明度随炮弹亮度变化
        const trailMat = trailLine.material as THREE.LineBasicMaterial;
        trailMat.opacity = fade * 0.5;
      }

      // ---- 爆炸特效：光点接近终点（t > 0.9）时触发 ----
      // 爆炸在每条弧的周期末尾持续约 0.3 秒
      const explosionPhase = t > 0.85 ? (t - 0.85) / 0.15 : 0; // 0→1
      const explosionActive = t > 0.85;

      // 冲击波环：从小到大扩散，逐渐透明
      const shock = shockRefs.current[i];
      if (shock) {
        const shockMat = shock.material as THREE.MeshBasicMaterial;
        if (explosionActive) {
          shock.visible = true;
          // 冲击波从 0.01 扩散到 0.05
          const shockScale = 0.01 + explosionPhase * 0.04;
          shock.scale.setScalar(shockScale);
          // 朝向：让环面垂直于地表法线
          shock.position.copy(seg.curve.getPoint(1));
          shock.lookAt(shock.position.clone().multiplyScalar(2));
          // 透明度从 0.8 衰减到 0
          shockMat.opacity = 0.8 * (1 - explosionPhase);
        } else {
          shock.visible = false;
        }
      }

      // 火花粒子：从终点向外飞散
      for (let s = 0; s < SPARK_COUNT; s++) {
        const sparkIdx = i * SPARK_COUNT + s;
        const spark = sparkRefs.current[sparkIdx];
        if (!spark) continue;
        const sparkMat = spark.material as THREE.MeshBasicMaterial;
        if (explosionActive) {
          spark.visible = true;
          const endPos = seg.curve.getPoint(1);
          // 每个火花方向不同：基于法线和切线组合
          const angle = (s / SPARK_COUNT) * Math.PI * 2;
          const dir = new THREE.Vector3(
            Math.cos(angle) * 0.7,
            0,
            Math.sin(angle) * 0.7
          );
          // 旋转到地表切平面
          const normal = endPos.clone().normalize();
          const sparkPos = endPos.clone().add(
            dir.multiplyScalar(0.003 + explosionPhase * 0.02).applyAxisAngle(
              new THREE.Vector3(0, 1, 0),
              Math.atan2(normal.x, normal.z)
            )
          );
          spark.position.copy(sparkPos);
          spark.scale.setScalar(0.5 + (1 - explosionPhase) * 0.5);
          sparkMat.opacity = 1 - explosionPhase;
        } else {
          spark.visible = false;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* 静态弧线本体已隐藏——改为动态拖尾尾迹，只显示炮弹身后的轨迹 */}
      {/* 拖尾尾迹：每条弧一条动态更新的线段，跟随炮弹移动 */}
      {allSegments.map((seg, i) => {
        const geo = new THREE.BufferGeometry();
        // 预分配 TRAIL_SEGMENTS+1 个顶点
        const positions = new Float32Array((TRAIL_SEGMENTS + 1) * 3);
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.LineBasicMaterial({
          color: '#ffcc44',
          transparent: true,
          opacity: 0,
          toneMapped: false,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const line = new THREE.Line(geo, mat);
        // 存储引用供 useFrame 更新顶点
        trailRefs.current[i] = line;
        trailGeoRefs.current[i] = geo;
        return (
          <primitive
            key={`trail-${seg.warId}-${seg.idx}`}
            object={line}
          />
        );
      })}
      {/* 沿弧线流动的发光光点（炮弹） */}
      {allSegments.map((seg, i) => (
        <mesh
          key={`dot-${seg.warId}-${seg.idx}`}
          ref={(el) => { dotRefs.current[i] = el; }}
        >
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshBasicMaterial
            color="#ffcc44"
            transparent
            opacity={0.8}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      {/* 爆炸冲击波环 */}
      {allSegments.map((seg, i) => (
        <mesh
          key={`shock-${seg.warId}-${seg.idx}`}
          ref={(el) => { shockRefs.current[i] = el; }}
          visible={false}
        >
          <ringGeometry args={[0.8, 1, 16]} />
          <meshBasicMaterial
            color="#ff6633"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      {/* 爆炸火花粒子 */}
      {allSegments.map((seg, i) =>
        Array.from({ length: SPARK_COUNT }, (_, s) => (
          <mesh
            key={`spark-${seg.warId}-${seg.idx}-${s}`}
            ref={(el) => { sparkRefs.current[i * SPARK_COUNT + s] = el; }}
            visible={false}
          >
            <sphereGeometry args={[0.003, 6, 6]} />
            <meshBasicMaterial
              color="#ffaa22"
              transparent
              opacity={0}
              toneMapped={false}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))
      )}
    </group>
  );
}
