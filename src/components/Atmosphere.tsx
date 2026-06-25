export function Atmosphere() {
  return (
    <mesh scale={1.035}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial
        color="#c88a3d"
        transparent
        opacity={0.06}
        side={1}
        blending={2}
        depthWrite={false}
      />
    </mesh>
  );
}
