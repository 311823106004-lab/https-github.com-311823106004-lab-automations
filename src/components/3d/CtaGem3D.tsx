import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { checkIsSoftwareGl } from './threeUtils';

export const CtaGem3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;
    const isSoftwareGl = checkIsSoftwareGl();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.0);
    scene.add(ambientLight);

    const point1 = new THREE.PointLight(0x38bdf8, 4, 15);
    point1.position.set(3, 3, 3);
    scene.add(point1);

    const point2 = new THREE.PointLight(0x8b5cf6, 4, 15);
    point2.position.set(-3, -3, 3);
    scene.add(point2);

    const gemGroup = new THREE.Group();
    scene.add(gemGroup);

    // Inner Faceted Crystal
    const gemGeo = new THREE.OctahedronGeometry(1.2, 0);
    const gemMat = new THREE.MeshPhysicalMaterial({
      color: 0x0066ff,
      roughness: 0.1,
      metalness: 0.2,
      transmission: isSoftwareGl ? 0 : 0.9,
      ior: 1.6,
      transparent: true,
      opacity: 0.85,
    });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    gemGroup.add(gem);

    // Outer Wireframe Lattice
    const wireGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    gemGroup.add(wire);

    // Orbital ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.8, 0.02, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.6 })
    );
    ring.rotation.x = Math.PI / 3;
    gemGroup.add(ring);

    let clock = new THREE.Clock();
    let animId = 0;

    const tick = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      gem.rotation.y += delta * 0.5;
      gem.rotation.x = Math.sin(time * 0.8) * 0.2;
      wire.rotation.y -= delta * 0.3;
      wire.rotation.z += delta * 0.2;
      ring.rotation.z += delta * 0.4;

      gemGroup.position.y = Math.sin(time * 1.5) * 0.1;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
      gemGeo.dispose();
      gemMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-64 h-64 sm:w-72 sm:h-72 relative mx-auto pointer-events-none" />;
};
