import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { checkIsSoftwareGl } from './threeUtils';

interface ServiceCard3DProps {
  type: 'document' | 'data' | 'email' | 'workflow';
  isHovered: boolean;
}

export const ServiceCard3D: React.FC<ServiceCard3DProps> = ({ type, isHovered }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(isHovered);
  hoverRef.current = isHovered;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 180;
    const isSoftwareGl = checkIsSoftwareGl();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x0e172a, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x8b5cf6, 2.5, 10);
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    let updateAnimation: (time: number, delta: number) => void = () => {};

    // Build specific 3D model according to service type
    if (type === 'document') {
      // Document stack with laser scanner
      const stackGroup = new THREE.Group();
      rootGroup.add(stackGroup);

      // 3 Stacked documents
      for (let i = 0; i < 3; i++) {
        const doc = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 1.5, 0.04),
          new THREE.MeshStandardMaterial({
            color: i === 2 ? 0x1e293b : 0x0f172a,
            roughness: 0.3,
            metalness: 0.5,
          })
        );
        doc.position.set(i * 0.05, -i * 0.05, -i * 0.08);
        doc.rotation.z = (i - 1) * 0.06;
        stackGroup.add(doc);
      }

      // Laser scanner beam
      const laserGeo = new THREE.BoxGeometry(1.4, 0.04, 0.06);
      const laserMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const laser = new THREE.Mesh(laserGeo, laserMat);
      stackGroup.add(laser);

      updateAnimation = (time) => {
        laser.position.y = Math.sin(time * 2.5) * 0.65;
        stackGroup.rotation.y = Math.sin(time * 0.8) * 0.2;
        stackGroup.rotation.x = Math.cos(time * 0.7) * 0.1;
      };
    } else if (type === 'data') {
      // 3D Bar Matrix and Data Ring
      const dataGroup = new THREE.Group();
      rootGroup.add(dataGroup);

      const colors = [0x0066ff, 0x38bdf8, 0x8b5cf6, 0x06b6d4];
      const bars: THREE.Mesh[] = [];

      for (let x = -1; x <= 1; x++) {
        for (let z = -1; z <= 1; z++) {
          const heightVal = 0.4 + Math.random() * 0.6;
          const bar = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, heightVal, 0.2),
            new THREE.MeshStandardMaterial({
              color: colors[(Math.abs(x + z)) % colors.length],
              roughness: 0.2,
              metalness: 0.8,
            })
          );
          bar.position.set(x * 0.35, heightVal / 2 - 0.4, z * 0.35);
          dataGroup.add(bar);
          bars.push(bar);
        }
      }

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.9, 0.02, 12, 48),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 })
      );
      ring.rotation.x = Math.PI / 2;
      dataGroup.add(ring);

      updateAnimation = (time, delta) => {
        dataGroup.rotation.y += delta * (hoverRef.current ? 1.5 : 0.6);
        bars.forEach((bar, i) => {
          bar.scale.y = 0.8 + Math.sin(time * 2 + i) * 0.3;
        });
      };
    } else if (type === 'email') {
      // 3D Envelope with Floating Airplane
      const emailGroup = new THREE.Group();
      rootGroup.add(emailGroup);

      const envelope = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 0.8, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.5 })
      );
      const flap = new THREE.Mesh(
        new THREE.ConeGeometry(0.65, 0.4, 4),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.7 })
      );
      flap.rotation.x = Math.PI;
      flap.rotation.y = Math.PI / 4;
      flap.position.set(0, 0.15, 0.05);
      emailGroup.add(envelope, flap);

      // Paper plane
      const planeGeo = new THREE.ConeGeometry(0.25, 0.5, 3);
      planeGeo.rotateX(Math.PI / 2);
      const planeMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.2 });
      const plane = new THREE.Mesh(planeGeo, planeMat);
      emailGroup.add(plane);

      updateAnimation = (time) => {
        emailGroup.rotation.y = Math.sin(time * 1.2) * 0.25;
        emailGroup.rotation.x = Math.cos(time * 0.9) * 0.15;
        plane.position.set(Math.cos(time * 2) * 0.9, Math.sin(time * 2) * 0.6, Math.sin(time * 2) * 0.3);
        plane.rotation.z = -time * 2;
      };
    } else {
      // Workflow: Dual interlocking gears
      const workflowGroup = new THREE.Group();
      rootGroup.add(workflowGroup);

      const gear1 = new THREE.Mesh(
        new THREE.TorusGeometry(0.55, 0.08, 12, 24),
        new THREE.MeshStandardMaterial({ color: 0x0066ff, roughness: 0.2, metalness: 0.8 })
      );
      const gear2 = new THREE.Mesh(
        new THREE.TorusGeometry(0.4, 0.06, 12, 24),
        new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.2, metalness: 0.8 })
      );
      gear2.position.set(0.8, 0.4, 0);

      workflowGroup.add(gear1, gear2);

      updateAnimation = (_, delta) => {
        const speed = hoverRef.current ? 2.2 : 0.8;
        gear1.rotation.z += delta * speed;
        gear2.rotation.z -= delta * speed * 1.35;
        workflowGroup.rotation.y = Math.sin(delta * 0.5) * 0.2;
      };
    }

    let clock = new THREE.Clock();
    let animId = 0;

    const tick = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      updateAnimation(time, delta);
      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [type]);

  return (
    <div
      ref={mountRef}
      className="w-full h-44 sm:h-48 relative flex items-center justify-center pointer-events-none"
    />
  );
};
