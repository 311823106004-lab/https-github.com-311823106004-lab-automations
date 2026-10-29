import * as THREE from 'three';

// Detect software WebGL to adapt rendering parameters seamlessly (from Three.js skill)
export const checkIsSoftwareGl = (): boolean => {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
};

// Procedural grid texture for floating cards and background planes
export const createProceduralGridTexture = (size = 256, color = '#0066FF', bg = '#070B14'): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35;

  const step = 32;
  for (let x = 0; x <= size; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  for (let y = 0; y <= size; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  // Accent glow dots at intersections
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.8;
  for (let x = 0; x <= size; x += step * 2) {
    for (let y = 0; y <= size; y += step * 2) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};

// Procedural document lines texture for 3D document meshes
export const createDocTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0F1A36';
  ctx.fillRect(0, 0, 128, 160);

  // Border
  ctx.strokeStyle = '#2563EB';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, 126, 158);

  // Header bar
  ctx.fillStyle = '#38BDF8';
  ctx.fillRect(12, 16, 50, 6);

  // Lines of text
  ctx.fillStyle = '#64748B';
  const lines = [32, 44, 56, 68, 80, 96, 108, 120, 132];
  lines.forEach((y, i) => {
    const w = i % 3 === 0 ? 90 : i % 2 === 0 ? 70 : 80;
    ctx.fillRect(12, y, w, 3);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};
