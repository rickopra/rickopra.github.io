import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const fragment = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;
  uniform vec2 uPointer;
  void main() {
    vec2 p = vUv * vec2(uAspect, 1.0) + uPointer * 0.025;
    float t = uTime * 0.16;
    float wave = sin(p.x * 7.0 + p.y * 9.0 + t) * 0.09;
    float line = abs(sin(p.x * 9.0 + p.y * 14.0 + wave + t));
    float crossLine = abs(sin(p.x * 15.0 - p.y * 8.0 + sin(p.x * 4.0 + t) * 0.5));
    float caustic = pow(1.0 - min(line, crossLine), 18.0);
    float sweep = smoothstep(0.0, 0.04, p.y - p.x * 0.23 - 0.12 + sin(t) * 0.025);
    vec3 blue = mix(vec3(0.005, 0.105, 0.53), vec3(0.0, 0.35, 0.92), vUv.y);
    blue = mix(blue, vec3(0.035, 0.70, 0.96), (1.0-sweep)*0.85);
    blue += vec3(0.04, 0.16, 0.20) * caustic * (0.2 + vUv.x * 0.8);
    float ray = pow(max(0.0, sin(p.x * 3.4 + p.y * 2.0 + t * 0.25)), 28.0);
    blue += ray * vec3(0.015, 0.07, 0.13);
    gl_FragColor = vec4(blue, 1.0);
  }
`;

export default function TideScene({ motion }: { motion: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const enabled = useRef(motion);
  const invalidate = useRef(() => {});
  useEffect(() => { enabled.current = motion; invalidate.current(); }, [motion]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'low-power', preserveDrawingBuffer: true });
    } catch {
      element.dataset.renderer = 'fallback';
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    element.appendChild(renderer.domElement);
    element.dataset.renderer = 'webgl';
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
    camera.position.z = 1;
    const uniforms = { uTime: { value: 0 }, uAspect: { value: 1 }, uPointer: { value: new THREE.Vector2() } };
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,1.0);}', fragmentShader: fragment });
    scene.add(new THREE.Mesh(geometry, material));
    let frame = 0;
    let previous = performance.now();
    const target = new THREE.Vector2();
    const draw = () => {
      frame = 0;
      const now = performance.now();
      if (enabled.current && !document.hidden) {
        uniforms.uTime.value += Math.min((now - previous) / 1000, 0.05);
        uniforms.uPointer.value.lerp(target, 0.035);
      }
      previous = now;
      renderer.render(scene, camera);
      element.dataset.frame = String(Math.round(uniforms.uTime.value * 100));
      if (enabled.current && !document.hidden) frame = requestAnimationFrame(draw);
    };
    const resume = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(draw); };
    invalidate.current = resume;
    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      uniforms.uAspect.value = width / height;
      resume();
    };
    const pointer = (event: PointerEvent) => target.set(event.clientX / window.innerWidth - 0.5, event.clientY / window.innerHeight - 0.5);
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    window.addEventListener('pointermove', pointer, { passive: true });
    document.addEventListener('visibilitychange', resume);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('pointermove', pointer);
      document.removeEventListener('visibilitychange', resume);
      invalidate.current = () => {};
      geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);
  return <div ref={host} className="tide-scene" aria-hidden="true" />;
}
