import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { checkIsSoftwareGl } from './threeUtils';

interface WorkflowScene3DProps {
  activeStageIndex: number;
  onSelectStage: (index: number) => void;
}

export const WorkflowScene3D: React.FC<WorkflowScene3DProps> = ({
  activeStageIndex,
  onSelectStage,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(activeStageIndex);
  activeIndexRef.current = activeStageIndex;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 420;
    const isSoftwareGl = checkIsSoftwareGl();

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070b14, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 8.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 3.0);
    dirLight.position.set(0, 6, 4);
    scene.add(dirLight);

    const stageNodesGroup = new THREE.Group();
    scene.add(stageNodesGroup);

    // 5 Stages
    const stageNames = ['Input', 'Understand', 'Process', 'Verify', 'Result'];
    const colors = [0x0066ff, 0x38bdf8, 0x8b5cf6, 0x10b981, 0x06b6d4];
    const nodeSpacing = 1.9;
    const startX = -((stageNames.length - 1) * nodeSpacing) / 2;

    const stageMeshes: THREE.Group[] = [];
    const interactiveObjects: THREE.Object3D[] = [];

    stageNames.forEach((_, idx) => {
      const nodeX = startX + idx * nodeSpacing;
      const stageG = new THREE.Group();
      stageG.position.set(nodeX, 0, 0);

      // Base Pedestal
      const baseGeo = new THREE.CylinderGeometry(0.45, 0.55, 0.15, 24);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.4,
        metalness: 0.8,
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      stageG.add(base);

      // Glowing Base Ring
      const ringGeo = new THREE.TorusGeometry(0.5, 0.02, 12, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: colors[idx] });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.08;
      stageG.add(ring);

      // Floating Representative Geometric Icon
      let iconMesh: THREE.Object3D;
      const iconMat = new THREE.MeshStandardMaterial({
        color: colors[idx],
        roughness: 0.2,
        metalness: 0.7,
        emissive: colors[idx],
        emissiveIntensity: 0.35,
      });

      if (idx === 0) {
        // Stage 1: Ingestion Box
        iconMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), iconMat);
      } else if (idx === 1) {
        // Stage 2: Understand / Ring Scanner
        const g = new THREE.Group();
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), iconMat);
        const orbit = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.03, 8, 24), ringMat);
        orbit.rotation.x = Math.PI / 3;
        g.add(sphere, orbit);
        iconMesh = g;
      } else if (idx === 2) {
        // Stage 3: Process / Octahedron Core
        iconMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.42), iconMat);
      } else if (idx === 3) {
        // Stage 4: Verify / Shield / Tetrahedron
        iconMesh = new THREE.Mesh(new THREE.TetrahedronGeometry(0.45), iconMat);
      } else {
        // Stage 5: Result / Star Icosahedron
        iconMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4), iconMat);
      }

      iconMesh.position.y = 0.75;
      iconMesh.userData = { stageIndex: idx };
      stageG.add(iconMesh);
      interactiveObjects.push(iconMesh);

      stageNodesGroup.add(stageG);
      stageMeshes.push(stageG);
    });

    // Connecting Pipeline Tubes between nodes
    const pipelinePoints: THREE.Vector3[] = [];
    stageNames.forEach((_, idx) => {
      pipelinePoints.push(new THREE.Vector3(startX + idx * nodeSpacing, 0.1, 0));
    });

    const pipeCurve = new THREE.CatmullRomCurve3(pipelinePoints);
    const pipeGeo = new THREE.TubeGeometry(pipeCurve, 40, 0.04, 8, false);
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.9,
    });
    const pipeMesh = new THREE.Mesh(pipeGeo, pipeMat);
    stageNodesGroup.add(pipeMesh);

    // Flowing Energy Pulse Packet
    const pulseGeo = new THREE.SphereGeometry(0.1, 12, 12);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const pulsePacket = new THREE.Mesh(pulseGeo, pulseMat);
    stageNodesGroup.add(pulsePacket);

    // Raycasting for Stage Selection Click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && obj.userData.stageIndex === undefined && obj.parent) {
          obj = obj.parent;
        }
        if (obj && obj.userData.stageIndex !== undefined) {
          onSelectStage(obj.userData.stageIndex);
        }
      }
    };

    container.addEventListener('click', handleClick);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    let animId = 0;

    const tick = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Move pulse packet along pipe
      const tProgress = (time * 0.25) % 1;
      const point = pipeCurve.getPointAt(tProgress);
      pulsePacket.position.copy(point);
      pulsePacket.position.y += 0.05;

      // Rotate each stage icon with subtle hover elevation
      stageMeshes.forEach((stageG, idx) => {
        const icon = stageG.children[2];
        const isActive = activeIndexRef.current === idx;

        if (icon) {
          icon.rotation.y += delta * (isActive ? 1.8 : 0.6);
          icon.rotation.x = Math.sin(time * 1.5 + idx) * 0.15;
          const targetY = isActive ? 0.95 + Math.sin(time * 3) * 0.08 : 0.75 + Math.sin(time * 1.8 + idx) * 0.04;
          icon.position.y += (targetY - icon.position.y) * 0.1;
          icon.scale.setScalar(isActive ? 1.25 : 1.0);
        }
      });

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      pipeGeo.dispose();
      pipeMat.dispose();
      pulseGeo.dispose();
      pulseMat.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onSelectStage]);

  return (
    <div
      ref={mountRef}
      className="w-full h-80 sm:h-96 relative cursor-pointer"
      title="Click any stage node to inspect workflow details"
    />
  );
};
