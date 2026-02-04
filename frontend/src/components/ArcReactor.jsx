import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Trail } from '@react-three/drei';
import * as THREE from 'three';

const ArcReactor = () => {
  const group = useRef();
  const coreRef = useRef();
  const outerRingRef = useRef();
  const [booted, setBooted] = useState(false);

  // --- SCI-FI BOOT SEQUENCE ---
  useEffect(() => {
    // Instant power surge instead of sputtering
    setTimeout(() => setBooted(true), 500);
  }, []);

  // --- ANIMATION LOOP ---
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // 1. Magnetic Floating (smoother and wider)
    if (group.current) {
      group.current.rotation.y = Math.sin(time * 0.3) * 0.1;
      group.current.rotation.x = Math.cos(time * 0.3) * 0.1;
    }

    // 2. High-Speed Core Spin
    if (booted && coreRef.current) {
      coreRef.current.rotation.z -= delta * 15; // Turbine speed
    }

    // 3. Counter-Rotating Outer Field
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.5;
      // Pulse scale slightly
      const scalePulse = 1 + Math.sin(time * 5) * 0.02;
      outerRingRef.current.scale.set(scalePulse, scalePulse, scalePulse);
    }
  });

  // --- NANO-TECH MATERIALS ---
  const neonBlue = new THREE.Color("#00f3ff");
  const brightWhite = new THREE.Color("#ffffff");

  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={0.8}>
      <group ref={group} scale={[1.1, 1.1, 1.1]} rotation={[Math.PI / 6, -Math.PI / 6, 0]}>

        {/* --- 1. OUTER CHASSIS (Chrome, not Black) --- */}
        <mesh>
          <torusGeometry args={[1.3, 0.08, 32, 100]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={1}
            roughness={0.1}
            envMapIntensity={2}
          />
        </mesh>

        {/* --- 2. ENERGY CONDUCTORS (Replacing Copper Coils) --- */}
        {/* These are now glowing energy cells */}
        {[...Array(10)].map((_, i) => (
          <group key={i} rotation={[0, 0, (i / 10) * Math.PI * 2]}>
            <mesh position={[1.1, 0, 0]}>
              <boxGeometry args={[0.15, 0.4, 0.1]} />
              <meshStandardMaterial
                color="#888"
                metalness={1}
                roughness={0.2}
              />
            </mesh>
            {/* The "Power Line" on top of the block */}
            <mesh position={[1.1, 0, 0.06]}>
              <boxGeometry args={[0.05, 0.35, 0.02]} />
              <meshBasicMaterial color={booted ? neonBlue : "#333"} toneMapped={false} />
            </mesh>
          </group>
        ))}

        {/* --- 3. THE PLASMA RING (Pure Light) --- */}
        <mesh>
          <torusGeometry args={[1.1, 0.12, 32, 100]} />
          <meshBasicMaterial
            color={neonBlue}
            toneMapped={false} // Makes it super bright (ignores scene light limits)
            transparent
            opacity={booted ? 0.9 : 0.2}
          />
        </mesh>
        {/* Glow Halo around the ring */}
        {booted && (
          <mesh position={[0,0,-0.1]}>
             <torusGeometry args={[1.1, 0.25, 32, 100]} />
             <meshBasicMaterial color={neonBlue} transparent opacity={0.2} toneMapped={false} />
          </mesh>
        )}

        {/* --- 4. CENTER TURBINE (The Engine) --- */}
        <group ref={coreRef}>
          {/* Turbine Blades */}
          {[...Array(6)].map((_, i) => (
            <mesh key={i} rotation={[0, 0, i * (Math.PI / 3)]}>
              <boxGeometry args={[0.1, 0.8, 0.02]} />
              <meshStandardMaterial color="#fff" metalness={1} roughness={0} />
            </mesh>
          ))}
          {/* Central Eye */}
          <mesh position={[0,0,0.05]}>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} rotation={[Math.PI/2, 0, 0]} />
            <meshBasicMaterial color={booted ? "#fff" : "#333"} />
          </mesh>
        </group>

        {/* --- 5. HOLOGRAPHIC OUTER FIELD (Sci-Fi Detail) --- */}
        <group ref={outerRingRef}>
          {/* Thin Energy Line rotating outside */}
          <mesh rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[1.6, 0.01, 16, 100]} />
            <meshBasicMaterial color={neonBlue} transparent opacity={0.3} />
          </mesh>
          {/* Floating Data Nodes */}
          {[0, 1, 2, 3].map((k) => (
             <mesh key={k} position={[1.6 * Math.cos(k*1.57), 1.6 * Math.sin(k*1.57), 0]}>
               <sphereGeometry args={[0.04, 16, 16]} />
               <meshBasicMaterial color={neonBlue} />
             </mesh>
          ))}
        </group>

        {/* --- LIGHTS & PARTICLES --- */}
        <pointLight distance={5} decay={1} color={neonBlue} intensity={booted ? 3 : 0} />

        {/* High-speed energy trail particles */}
        {booted && (
          <Sparkles
            count={100}
            scale={3.5}
            size={4}
            speed={2}
            opacity={0.8}
            color="#aaddff"
          />
        )}

      </group>
    </Float>
  );
};

export default ArcReactor;