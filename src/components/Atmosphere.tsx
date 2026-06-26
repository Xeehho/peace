import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Fresnel 大气层——用自定义 GLSL Shader 在地球边缘产生真实的大气散射光晕。
 *
 * 原理：视线方向与表面法线的夹角越大（即边缘），光晕越强。
 * 参考 NASA Earth Observatory 的地球边缘渐变效果。
 */

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uPower;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    // Fresnel 系数：dot(normal, viewDir) 在边缘趋近 0，取反后趋近 1
    float fresnel = 1.0 - max(dot(vNormal, vViewDir), 0.0);
    fresnel = pow(fresnel, uPower);

    vec3 color = uColor * fresnel * uIntensity;
    float alpha = fresnel * uIntensity;

    gl_FragColor = vec4(color, alpha);
  }
`;

export function Atmosphere() {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color('#5a9fd4') },
      uIntensity: { value: 1.4 },
      uPower: { value: 2.5 },
    }),
    []
  );

  return (
    <mesh scale={1.06}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}
