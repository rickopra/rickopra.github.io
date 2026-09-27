import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function NetworkScene({ motion }: { motion: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const enabled = useRef(motion);
  const invalidate = useRef<() => void>(() => undefined);

  useEffect(() => {
    enabled.current = motion;
    invalidate.current();
  }, [motion]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power', preserveDrawingBuffer: true });
    } catch {
      element.dataset.renderer = 'fallback';
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    element.appendChild(renderer.domElement);
    element.dataset.renderer = 'webgl';
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 80);
    camera.position.set(0, 0, 12);
    const group = new THREE.Group();
    scene.add(group);
    const geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(4.8, 3.9, 0.04));
    const material = new THREE.LineBasicMaterial({ color: 0x72eaf3, transparent: true, opacity: 0.32 });
    const gates: THREE.LineSegments[] = [];
    for (let index = 0; index < 7; index += 1) {
      const gate = new THREE.LineSegments(geometry, material);
      gate.position.set(0.5 + index * 0.28, 0.3 + index * 0.08, -index * 1.25);
      gate.rotation.z = -0.4;
      group.add(gate);
      gates.push(gate);
    }
    const positions = new Float32Array([
      -8, -2.5, -1, 9, 5, -8,
      -8, -3.5, -1, 9, 4, -8,
      -8, -4.5, -1, 9, 3, -8,
      -8, -5.5, -1, 9, 2, -8,
    ]);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xb4faff, transparent: true, opacity: 0.21 });
    group.add(new THREE.LineSegments(lineGeometry, lineMaterial));
    const pointer = new THREE.Vector2();
    let animationFrame = 0;
    let visible = true;
    let elapsed = 0;
    let previous = performance.now();

    const render = () => {
      animationFrame = 0;
      const now = performance.now();
      if (enabled.current && visible && !document.hidden) {
        elapsed += Math.min((now - previous) / 1000, 0.05);
        group.rotation.y += (pointer.x * 0.1 - group.rotation.y) * 0.025;
        group.rotation.x += (-pointer.y * 0.06 - group.rotation.x) * 0.025;
        gates.forEach((gate, index) => {
          gate.rotation.z = -0.4 + Math.sin(elapsed * 0.22 + index * 0.24) * 0.055;
          gate.position.y = 0.3 + index * 0.08 + Math.sin(elapsed * 0.4 + index * 0.4) * 0.11;
        });
      }
      previous = now;
      renderer.render(scene, camera);
      element.dataset.frame = String(Math.round(elapsed * 100));
      if (enabled.current && visible && !document.hidden) animationFrame = requestAnimationFrame(render);
    };
    const resume = () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(render);
    };
    invalidate.current = resume;
    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      group.position.x = width < 650 ? 1.8 : 2.8;
      resume();
    };
    const onPointer = (event: PointerEvent) => {
      if (!enabled.current) return;
      const bounds = element.getBoundingClientRect();
      pointer.set((event.clientX - bounds.left) / bounds.width - 0.5, (event.clientY - bounds.top) / bounds.height - 0.5);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element);
    const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
    intersectionObserver.observe(element);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', resume);
    resize();
    return () => {
      cancelAnimationFrame(animationFrame);
      invalidate.current = () => undefined;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', resume);
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} className="network-scene" aria-hidden="true" />;
}
