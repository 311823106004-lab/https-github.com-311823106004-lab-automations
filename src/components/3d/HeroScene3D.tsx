import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { checkIsSoftwareGl, createDocTexture } from './threeUtils';

export const HeroScene3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    const isSoftwareGl = checkIsSoftwareGl();

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070b14, 0.035);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lighting (Warm Key + Cool Violet Fill + Electric Blue Accent)
    const ambientLight = new THREE.AmbientLight(0x0a1628, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    const violetLight = new THREE.PointLight(0x8b5cf6, 3, 20);
    violetLight.position.set(-6, -3, 3);
    scene.add(violetLight);

    const blueLight = new THREE.PointLight(0x0066ff, 4, 15);
    blueLight.position.set(0, 0, 0);
    scene.add(blueLight);

    // ROOT HERO GROUP
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // 1. CENTRAL CONNECTED OPERATIONS SPHERE
    const sphereGroup = new THREE.Group();
    heroGroup.add(sphereGroup);

    // Inner glowing core
    const coreGeo = new THREE.IcosahedronGeometry(1.0, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0066ff,
      emissive: 0x0044cc,
      emissiveIntensity: 0.8,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
    });
    const innerCore = new THREE.Mesh(coreGeo, coreMat);
    sphereGroup.add(innerCore);

    // Outer refractive glass-like shell
    const glassGeo = new THREE.SphereGeometry(1.35, 32, 32);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.1,
      transmission: isSoftwareGl ? 0 : 0.85,
      ior: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      depthWrite: false,
    });
    const outerGlass = new THREE.Mesh(glassGeo, glassMat);
    sphereGroup.add(outerGlass);

    // Coordinate rings
    const ringGeo = new THREE.TorusGeometry(1.7, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 });
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.6 });
    const ringMat3 = new THREE.MeshBasicMaterial({ color: 0x0066ff, transparent: true, opacity: 0.8 });

    const ring1 = new THREE.Mesh(ringGeo, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    const ring2 = new THREE.Mesh(ringGeo, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.scale.setScalar(1.15);
    const ring3 = new THREE.Mesh(ringGeo, ringMat3);
    ring3.rotation.x = -Math.PI / 4;
    ring3.scale.setScalar(1.3);

    sphereGroup.add(ring1);
    sphereGroup.add(ring2);
    sphereGroup.add(ring3);

    // 2. FLOATING BUSINESS OBJECTS AROUND CENTRAL CORE
    const docTex = createDocTexture();

    // Node A: Floating Document / Invoice
    const docGroup = new THREE.Group();
    const docGeo = new THREE.BoxGeometry(0.7, 0.9, 0.04);
    const docMat = new THREE.MeshStandardMaterial({
      map: docTex,
      roughness: 0.3,
      metalness: 0.2,
      emissive: 0x0033aa,
      emissiveIntensity: 0.2,
    });
    const docMesh = new THREE.Mesh(docGeo, docMat);
    docGroup.add(docMesh);
    docGroup.position.set(-2.6, 1.4, 0.5);
    heroGroup.add(docGroup);

    // Node B: Floating Spreadsheet / Data Bar Chart
    const dataGroup = new THREE.Group();
    const barMat1 = new THREE.MeshStandardMaterial({ color: 0x0066ff, roughness: 0.2, metalness: 0.7 });
    const barMat2 = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.7 });
    const barMat3 = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.2, metalness: 0.7 });
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.45, 0.18), barMat1);
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.75, 0.18), barMat2);
    const b3 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.95, 0.18), barMat3);
    b1.position.set(-0.25, 0.22, 0);
    b2.position.set(0, 0.37, 0);
    b3.position.set(0.25, 0.47, 0);
    const basePlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.05, 16),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 })
    );
    dataGroup.add(b1, b2, b3, basePlate);
    dataGroup.position.set(2.8, 1.2, 0.3);
    heroGroup.add(dataGroup);

    // Node C: Floating Email / Mail Envelope
    const emailGroup = new THREE.Group();
    const envBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.5, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.4 })
    );
    // Envelope Flap
    const flapGeo = new THREE.ConeGeometry(0.4, 0.3, 4);
    flapGeo.rotateX(Math.PI);
    flapGeo.rotateY(Math.PI / 4);
    const flapMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, metalness: 0.6 });
    const envFlap = new THREE.Mesh(flapGeo, flapMat);
    envFlap.position.set(0, 0.1, 0.05);
    emailGroup.add(envBody, envFlap);
    emailGroup.position.set(-2.2, -1.6, 0.8);
    heroGroup.add(emailGroup);

    // Node D: Floating Workflow Cog / Orchestrator
    const gearGroup = new THREE.Group();
    const gearGeo = new THREE.TorusGeometry(0.4, 0.1, 12, 24);
    const gearMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x3b0764,
      emissiveIntensity: 0.4,
    });
    const gearMesh = new THREE.Mesh(gearGeo, gearMat);
    gearGroup.add(gearMesh);

    // Teeth on gear
    for (let i = 0; i < 6; i++) {
      const tooth = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.12, 0.15),
        new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.3 })
      );
      const angle = (i / 6) * Math.PI * 2;
      tooth.position.set(Math.cos(angle) * 0.45, Math.sin(angle) * 0.45, 0);
      tooth.rotation.z = angle;
      gearGroup.add(tooth);
    }
    gearGroup.position.set(2.4, -1.5, 0.6);
    heroGroup.add(gearGroup);

    // 3. LIGHT TRAILS & CONNECTING PIPELINES (Between center and nodes)
    const nodes = [docGroup, dataGroup, emailGroup, gearGroup];
    const trailLines: THREE.Line[] = [];
    const pulseBeads: THREE.Mesh[] = [];

    const beadGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const beadMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    nodes.forEach((targetNode) => {
      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(targetNode.position.x * 0.5, targetNode.position.y * 0.5 + 0.3, targetNode.position.z * 0.5),
        targetNode.position.clone(),
      ];
      const curve = new THREE.CatmullRomCurve3(points);
      const curvePoints = curve.getPoints(30);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x0066ff,
        transparent: true,
        opacity: 0.35,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      heroGroup.add(line);
      trailLines.push(line);

      const bead = new THREE.Mesh(beadGeo, beadMat);
      heroGroup.add(bead);
      pulseBeads.push(bead);
    });

    // 4. FLOATING DATA PARTICLES (Constellation)
    const particleCount = isSoftwareGl ? 80 : 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 14;
      particlePos[i + 1] = (Math.random() - 0.5) * 10;
      particlePos[i + 2] = (Math.random() - 0.5) * 8 - 1;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Interaction Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.6;
      targetY = y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 600;
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

      // Smooth camera / scene tilt interpolation
      mouseX += (targetX - mouseX) * (delta * 3.5);
      mouseY += (targetY - mouseY) * (delta * 3.5);

      heroGroup.rotation.y = mouseX * 0.4 + Math.sin(time * 0.2) * 0.05;
      heroGroup.rotation.x = -mouseY * 0.3;

      // Rotate sphere core and rings
      innerCore.rotation.x += delta * 0.3;
      innerCore.rotation.y += delta * 0.5;
      ring1.rotation.z += delta * 0.4;
      ring2.rotation.x -= delta * 0.3;
      ring3.rotation.y += delta * 0.2;

      // Floating gentle bobbing for nodes
      docGroup.position.y = 1.4 + Math.sin(time * 1.5) * 0.12;
      docGroup.rotation.y = Math.sin(time * 0.8) * 0.2;
      docGroup.rotation.z = Math.cos(time * 0.9) * 0.08;

      dataGroup.position.y = 1.2 + Math.cos(time * 1.7) * 0.14;
      dataGroup.rotation.y += delta * 0.6;

      emailGroup.position.y = -1.6 + Math.sin(time * 1.6 + 1) * 0.12;
      emailGroup.rotation.x = Math.sin(time * 0.7) * 0.15;

      gearGroup.position.y = -1.5 + Math.cos(time * 1.4 + 2) * 0.13;
      gearGroup.rotation.z += delta * 0.8;

      // Move light pulse beads along pipelines
      pulseBeads.forEach((bead, idx) => {
        const targetNode = nodes[idx];
        const progress = (time * 0.5 + idx * 0.25) % 1;
        bead.position.lerpVectors(new THREE.Vector3(0, 0, 0), targetNode.position, progress);
        bead.scale.setScalar(0.8 + Math.sin(progress * Math.PI) * 0.6);
      });

      // Slowly rotate particle dust
      particles.rotation.y = time * 0.02;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);

      // Clean disposal
      coreGeo.dispose();
      coreMat.dispose();
      glassGeo.dispose();
      glassMat.dispose();
      ringGeo.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      ringMat3.dispose();
      docGeo.dispose();
      docMat.dispose();
      docTex.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[480px] sm:min-h-[580px] lg:min-h-[680px] relative pointer-events-auto"
      style={{ touchAction: 'none' }}
    />
  );
};
