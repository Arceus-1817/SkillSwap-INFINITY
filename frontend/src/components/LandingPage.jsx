import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';
import { 
  Zap, Shield, Globe, ArrowRight, Hexagon, Play, 
  Cpu, Terminal 
} from 'lucide-react';
import ArcReactor from './ArcReactor';

// --- 1. THE 3D UNIVERSE BACKGROUND ---
function ParticleField() {
  const count = 800; 
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25; 
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
      
      const colorType = Math.random();
      if (colorType > 0.9) { 
         colors[i * 3] = 1; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 0.2;
      } else { 
         colors[i * 3] = 0; colors[i * 3 + 1] = 0.8 + Math.random() * 0.2; colors[i * 3 + 2] = 1;
      }
    }
    return [positions, colors];
  }, [count]);

  const points = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    points.current.rotation.y = t * 0.05; 
    points.current.rotation.z = t * 0.02;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.6} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

// --- 2. MAIN COMPONENT ---
const LandingPage = ({ onGetStarted }) => { // <--- Accepts the navigation prop
  const { scrollYProgress } = useScroll();
  
  // Parallax effects
  const yHero = useTransform(scrollYProgress, [0, 0.2], [0, -200]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div style={{ background: '#020617', minHeight: '300vh', color: 'white', fontFamily: 'Inter, sans-serif', overflowX: 'hidden', position: 'relative' }}>
      
      {/* A. PERSISTENT 3D BACKGROUND (Fixed) */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <fog attach="fog" args={['#020617', 5, 20]} />
          <ambientLight intensity={0.5} />
          <Stars radius={200} depth={100} count={15000} factor={4} saturation={0} fade speed={2} />
          <Float speed={2} rotationIntensity={2.5} floatIntensity={2.5}>
             <ParticleField />
          </Float>
          <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5} position={[1, -1, 2]}>
            <ArcReactor />
          </Float>
          
        </Canvas>
      </div>

      {/* B. PROGRESS BAR (HUD STYLE) */}
      <motion.div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '2px', background: '#00f3ff', scaleX: scrollYProgress, transformOrigin: '0%', zIndex: 100, boxShadow: '0 0 10px #00f3ff' }} />

      {/* C. MAIN CONTENT SCROLL CONTAINER */}
      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* --- SECTION 1: HERO (THE INITIALIZE) --- */}
        <nav style={{ position: 'fixed', top: 0, width: '100%', display: 'flex', justifyContent: 'space-between', padding: '30px 50px', zIndex: 50, mixBlendMode: 'difference' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', letterSpacing: '2px' }}>
              <Hexagon fill="white" size={24} /> SKILLSWAP_OS
           </div>
           {/* LOG IN BUTTON: NAVIGATES TO AUTH PAGE */}
           <button onClick={onGetStarted} style={hudBtnStyle}>LOG IN</button>
        </nav>

        <section style={{ height: '100vh', display: 'flex', alignItems: 'center', padding: '0 50px', position: 'relative' }}>
           <motion.div style={{ maxWidth: '800px', y: yHero, opacity: opacityHero }}>
              
              {/* HUD DECORATIONS */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', fontFamily: 'monospace', color: '#00f3ff', fontSize: '0.8rem' }}>
                 <span>// SYSTEM.INIT_V4</span>
                 <span>// SECURE_CONNECTION: TRUE</span>
                 <span>// TARGET: BRAIN_UPLINK</span>
              </div>

              <h1 style={{ fontSize: 'clamp(4rem, 8vw, 7rem)', fontWeight: '900', lineHeight: '0.9', marginBottom: '30px', letterSpacing: '-3px' }}>
                  UPLOAD YOUR <br />
                  <span style={{ WebkitTextStroke: '2px rgba(255,255,255,0.2)', color: 'transparent' }}>CONSCIOUSNESS</span> <br />
                  TO THE <span style={{ color: '#00f3ff', textShadow: '0 0 50px rgba(0,243,255,0.5)' }}>GRID.</span>
              </h1>

              <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', lineHeight: '1.6', marginBottom: '50px', borderLeft: '2px solid #00f3ff', paddingLeft: '20px' }}>
                  The first decentralized protocol for direct peer-to-peer skill synthesis. 
                  Bypass the learning curve. Connect. Download. Evolve.
              </p>

              <div style={{ display: 'flex', gap: '20px' }}>
                  {/* MAIN CTA: NAVIGATES TO AUTH PAGE */}
                  <button onClick={onGetStarted} style={primaryBtnStyle}>
                      INITIALIZE PROTOCOL <Zap size={18} />
                  </button>
                  <button style={secondaryBtnStyle}>
                      <Play size={18} /> RUN DIAGNOSTICS
                  </button>
              </div>
           </motion.div>
        </section>


        {/* --- SECTION 2: THE ARCHITECTURE (HUD CARDS) --- */}
        <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '100px 20px' }}>
            <motion.div 
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                style={{ textAlign: 'center', marginBottom: '80px' }}
            >
                <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>SYSTEM ARCHITECTURE</h2>
                <div style={{ width: '100px', height: '4px', background: '#00f3ff', margin: '0 auto', boxShadow: '0 0 20px #00f3ff' }}></div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', maxWidth: '1200px', width: '100%' }}>
                <HudCard icon={<Cpu size={32} />} title="Neural Processing" desc="AI-driven matching algorithm finds your perfect mentor node in < 12ms." delay={0} />
                <HudCard icon={<Shield size={32} />} title="Quantum Encryption" desc="Sessions are secured via end-to-end AES-256 encryption. Zero leaks." delay={0.2} />
                <HudCard icon={<Globe size={32} />} title="Global Grid" desc="Access nodes from 140+ sovereign territories. Language translation active." delay={0.4} />
            </div>
        </section>


        {/* --- SECTION 3: THE DATA STREAM (TECH SPECS) --- */}
        <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(0,243,255,0.1)', borderBottom: '1px solid rgba(0,243,255,0.1)' }}>
            <div style={{ maxWidth: '1200px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', padding: '0 40px', alignItems: 'center' }}>
                
                {/* Left: Text */}
                <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Terminal size={32} color="#00f3ff" /> LIVE_TELEMETRY
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '30px', lineHeight: '1.8' }}>
                        SkillSwap operates on a high-frequency low-latency mesh network. 
                        We optimized the WebRTC handshake protocols to deliver video clarity 
                        indistinguishable from reality.
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, fontFamily: 'monospace', color: '#00f3ff' }}>
                        <li style={{ marginBottom: '10px' }}>{'>'} STATUS: OPERATIONAL</li>
                        <li style={{ marginBottom: '10px' }}>{'>'} UPTIME: 99.999%</li>
                        <li style={{ marginBottom: '10px' }}>{'>'} PACKET_LOSS: 0.001%</li>
                    </ul>
                </motion.div>

                {/* Right: The "Holo-Display" */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}
                    style={{ 
                        background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)', 
                        border: '1px solid rgba(0, 243, 255, 0.3)', borderRadius: '20px', padding: '40px',
                        boxShadow: '0 0 50px rgba(0, 243, 255, 0.1)', position: 'relative'
                    }}
                >
                    {/* Decorative Corner Brackets */}
                    <div style={{ position: 'absolute', top: -1, left: -1, width: '20px', height: '20px', borderTop: '2px solid #00f3ff', borderLeft: '2px solid #00f3ff' }}></div>
                    <div style={{ position: 'absolute', top: -1, right: -1, width: '20px', height: '20px', borderTop: '2px solid #00f3ff', borderRight: '2px solid #00f3ff' }}></div>
                    <div style={{ position: 'absolute', bottom: -1, left: -1, width: '20px', height: '20px', borderBottom: '2px solid #00f3ff', borderLeft: '2px solid #00f3ff' }}></div>
                    <div style={{ position: 'absolute', bottom: -1, right: -1, width: '20px', height: '20px', borderBottom: '2px solid #00f3ff', borderRight: '2px solid #00f3ff' }}></div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>12ms</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>PING</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>4k</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>RES</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>10Gb</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>BANDWIDTH</div>
                        </div>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#00f3ff', fontFamily: 'monospace' }}>
                        SCANNING NETWORK NODES... <br/>
                        NODE_834 CONNECTED via TOKYO <br/>
                        NODE_112 CONNECTED via NEW_YORK <br/>
                        NODE_559 CONNECTED via LONDON
                    </div>
                </motion.div>
            </div>
        </section>


        {/* --- SECTION 4: CLEARANCE LEVELS (PRICING) --- */}
        <section style={{ padding: '100px 20px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
            <motion.h2 
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }}
                style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '60px' }}
            >
                CLEARANCE LEVELS
            </motion.h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                <PriceCard level="LEVEL 1" title="Initiate" price="FREE" features={["Basic Access", "5 Sessions/Mo", "Standard Latency"]} />
                <PriceCard level="LEVEL 5" title="Architect" price="$15/mo" features={["Unlimited Access", "4K Streaming", "Priority Node Routing", "Neural Badge"]} highlight />
                <PriceCard level="LEVEL 10" title="Visionary" price="$50/mo" features={["Dedicated Server", "Early Access V5.0", "Voting Rights", "Mentor Status"]} />
            </div>
        </section>


        {/* --- SECTION 5: FOOTER (SHUTDOWN) --- */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '80px 40px', background: 'black', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px', maxWidth: '1200px', margin: '0 auto', zIndex: 10, position: 'relative' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', marginBottom: '20px', color: '#00f3ff' }}>
                        <Hexagon size={20} fill="#00f3ff" color="black" /> SKILLSWAP_OS
                    </div>
                    <p style={{ color: '#64748b', maxWidth: '300px' }}>
                        Decentralized knowledge transfer protocol. <br/> 
                        System Version: 4.2.1 (Stable)
                    </p>
                </div>
                
                <div style={{ display: 'flex', gap: '60px' }}>
                    <FooterColumn title="PROTOCOL" links={['Network Status', 'Node Map', 'Encryption Specs']} />
                    <FooterColumn title="ACCESS" links={['Login', 'Request Key', 'Enterprise']} />
                    <FooterColumn title="LEGAL" links={['Terms of Uplink', 'Privacy Core']} />
                </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '60px', color: '#334155', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                © 2026 STARK INDUSTRIES / SKILLSWAP PROTOCOL. TERMINATING SESSION...
            </div>
        </footer>

      </div>
    </div>
  );
};

// --- SUB-COMPONENTS & STYLES ---

const HudCard = ({ icon, title, desc, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }}
        whileHover={{ scale: 1.05, borderColor: '#00f3ff', boxShadow: '0 0 30px rgba(0,243,255,0.2)' }}
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', padding: '40px', position: 'relative', cursor: 'pointer' }}
    >
        <div style={{ color: '#00f3ff', marginBottom: '20px' }}>{icon}</div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '15px' }}>{title}</h3>
        <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>{desc}</p>
        <div style={{ position: 'absolute', top: 10, right: 10, width: '30px', height: '30px', borderTop: '2px solid rgba(255,255,255,0.1)', borderRight: '2px solid rgba(255,255,255,0.1)' }}></div>
    </motion.div>
);

const PriceCard = ({ level, title, price, features, highlight }) => (
    <div style={{ 
        border: highlight ? '1px solid #00f3ff' : '1px solid rgba(255,255,255,0.1)', 
        background: highlight ? 'rgba(0, 243, 255, 0.05)' : 'transparent',
        padding: '40px', position: 'relative' 
    }}>
        {highlight && <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', background: '#00f3ff', color: 'black', padding: '4px 12px', fontSize: '0.8rem', fontWeight: 'bold' }}>RECOMMENDED</div>}
        <div style={{ color: highlight ? '#00f3ff' : '#64748b', fontSize: '0.9rem', marginBottom: '10px', fontFamily: 'monospace' }}>{level}</div>
        <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>{title}</h3>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: highlight ? 'white' : '#94a3b8', marginBottom: '30px' }}>{price}</div>
        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {features.map((f, i) => <li key={i} style={{ display: 'flex', gap: '10px' }}><ArrowRight size={16} color="#00f3ff" /> {f}</li>)}
        </ul>
        <button style={{ width: '100%', marginTop: '30px', padding: '15px', background: highlight ? '#00f3ff' : 'transparent', border: highlight ? 'none' : '1px solid rgba(255,255,255,0.2)', color: highlight ? 'black' : 'white', fontWeight: 'bold', cursor: 'pointer' }}>
            SELECT
        </button>
    </div>
);

const FooterColumn = ({ title, links }) => (
    <div>
        <div style={{ fontWeight: 'bold', marginBottom: '20px', color: 'white' }}>{title}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {links.map(l => <a key={l} href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem' }}>{l}</a>)}
        </div>
    </div>
);

const primaryBtnStyle = {
    padding: '18px 40px', background: '#00f3ff', color: '#000', border: 'none', 
    fontWeight: '900', letterSpacing: '1px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
    clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
    transition: '0.3s', boxShadow: '0 0 30px rgba(0,243,255,0.3)'
};

const secondaryBtnStyle = {
    padding: '18px 40px', background: 'transparent', color: '#00f3ff', border: '1px solid rgba(0,243,255,0.3)', 
    fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
    clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
};

const hudBtnStyle = {
    padding: '10px 24px', background: 'rgba(0, 243, 255, 0.1)', color: '#00f3ff', border: '1px solid #00f3ff',
    fontWeight: 'bold', letterSpacing: '1px', cursor: 'pointer'
};

export default LandingPage;