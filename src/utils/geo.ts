import * as THREE from 'three';

const EARTH_RADIUS = 1;

export function latLonToVector3(lat: number, lon: number, radius: number = EARTH_RADIUS): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export function getCountryPosition(lat: number, lon: number): THREE.Vector3 {
  return latLonToVector3(lat, lon, EARTH_RADIUS * 1.02);
}

export function createArcPoints(
  start: THREE.Vector3,
  end: THREE.Vector3,
  segments: number = 64,
  height: number = 0.4
): THREE.Vector3[] {
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const midLength = mid.length();
  mid.normalize().multiplyScalar(midLength + height);

  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  return curve.getPoints(segments);
}
