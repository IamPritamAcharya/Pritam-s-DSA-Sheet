import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './ThreeCanvas.css';

export function ThreeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth, h = mount.clientHeight;

    // ─── Scene ───
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ─── Particles ───
    const COUNT = 220;
    const positions  = new Float32Array(COUNT * 3);
    const colors     = new Float32Array(COUNT * 3);
    const velocities: number[] = [];

    const palette = [
      new THREE.Color(0x7c6af7),
      new THREE.Color(0xa855f7),
      new THREE.Color(0x34d399),
      new THREE.Color(0x6366f1),
      new THREE.Color(0xec4899),
    ];

    for (let i = 0; i < COUNT; i++) {
      positions[i*3]   = (Math.random() - 0.5) * 14;
      positions[i*3+1] = (Math.random() - 0.5) * 9;
      positions[i*3+2] = (Math.random() - 0.5) * 5;

      velocities.push(
        (Math.random() - 0.5) * 0.004,
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.002,
      );

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.048,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ─── Connection Lines ───
    const CONNECT_DIST = 2.2;
    const maxLines     = COUNT * 6;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors    = new Float32Array(maxLines * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeo.setAttribute('color',    new THREE.BufferAttribute(lineColors,    3).setUsage(THREE.DynamicDrawUsage));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.12,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // ─── Wireframe torus knots ───
    const torus1 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.8, 0.4, 140, 18, 2, 3),
      new THREE.MeshBasicMaterial({ color: 0x7c6af7, wireframe: true, transparent: true, opacity: 0.045 })
    );
    torus1.position.set(3.5, -0.5, -2);
    scene.add(torus1);

    const torus2 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.2, 0.3, 100, 14, 3, 5),
      new THREE.MeshBasicMaterial({ color: 0x34d399, wireframe: true, transparent: true, opacity: 0.035 })
    );
    torus2.position.set(-4, 1.5, -3);
    scene.add(torus2);

    // Icosahedron — new element
    const icoMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.0, 1),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.05 })
    );
    icoMesh.position.set(-2.5, -1.5, -1.5);
    scene.add(icoMesh);

    // ─── Mouse parallax ───
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5);
      mouseY = -(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', onMouseMove);

    // ─── Resize ───
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ─── Animate ───
    let rafId: number;
    const tick = () => {
      rafId = requestAnimationFrame(tick);

      const pos = particleGeo.attributes.position.array as Float32Array;

      // Move particles
      for (let i = 0; i < COUNT; i++) {
        pos[i*3]   += velocities[i*3];
        pos[i*3+1] += velocities[i*3+1];
        pos[i*3+2] += velocities[i*3+2];
        if (pos[i*3]   >  7) pos[i*3]   = -7;
        if (pos[i*3]   < -7) pos[i*3]   =  7;
        if (pos[i*3+1] >  5) pos[i*3+1] = -5;
        if (pos[i*3+1] < -5) pos[i*3+1] =  5;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Build connection lines
      let lineIndex = 0;
      const lp = lineGeo.attributes.position.array as Float32Array;
      const lc = lineGeo.attributes.color.array    as Float32Array;

      for (let i = 0; i < COUNT && lineIndex < maxLines; i++) {
        for (let j = i + 1; j < COUNT && lineIndex < maxLines; j++) {
          const dx = pos[i*3] - pos[j*3];
          const dy = pos[i*3+1] - pos[j*3+1];
          const dz = pos[i*3+2] - pos[j*3+2];
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

          if (dist < CONNECT_DIST) {
            const alpha = 1 - dist / CONNECT_DIST;
            // p1
            lp[lineIndex*6]   = pos[i*3];
            lp[lineIndex*6+1] = pos[i*3+1];
            lp[lineIndex*6+2] = pos[i*3+2];
            // p2
            lp[lineIndex*6+3] = pos[j*3];
            lp[lineIndex*6+4] = pos[j*3+1];
            lp[lineIndex*6+5] = pos[j*3+2];
            // colors (fade by distance)
            lc[lineIndex*6]   = 0.49 * alpha;
            lc[lineIndex*6+1] = 0.42 * alpha;
            lc[lineIndex*6+2] = 0.97 * alpha;
            lc[lineIndex*6+3] = 0.49 * alpha;
            lc[lineIndex*6+4] = 0.42 * alpha;
            lc[lineIndex*6+5] = 0.97 * alpha;
            lineIndex++;
          }
        }
      }
      lineGeo.setDrawRange(0, lineIndex * 2);
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate    = true;

      // Rotate wireframes
      torus1.rotation.x += 0.003;   torus1.rotation.y += 0.004;
      torus2.rotation.x -= 0.002;   torus2.rotation.z += 0.003;
      icoMesh.rotation.y += 0.008;  icoMesh.rotation.x += 0.004;

      // Camera parallax
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.04;
      camera.position.y += (mouseY * 0.25 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      [particleGeo, lineGeo, torus1.geometry, torus2.geometry, icoMesh.geometry].forEach(g => g.dispose());
      [particleMat, lineMat, torus1.material as THREE.Material, torus2.material as THREE.Material, icoMesh.material as THREE.Material].forEach(m => m.dispose());
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="three-canvas" aria-hidden="true" />;
}
