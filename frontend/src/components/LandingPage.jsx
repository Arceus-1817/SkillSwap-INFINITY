import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, Float } from '@react-three/drei';
import { ArrowRight, Zap, Shield, Globe, Gamepad2 } from 'lucide-react';
import ArcReactor from './ArcReactor';

// --- 1. THE HOLOGRAPHIC NAVBAR ---
const Navbar = ({ onJoin }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1200px',
        background: scrolled ? 'rgba(5, 5, 5, 0.8)' : 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '50px',
        padding: '12px 30px',
        transition: 'all 0.3s ease'
      }}>
        {/* Logo */}
        <div style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-1px', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', background: '#00f3ff', borderRadius: '50%', boxShadow: '0 0 10px #00f3ff' }}></div>
          SkillSwap
        </div>

        {/* Desktop Links */}
        <div className="nav-links" style={{ display: 'flex', gap: '40px', color: '#a1a1aa', fontSize: '0.9rem', fontWeight: '500' }}>
          {['Protocol', 'Network', 'Governance'].map((item) => (
            <a key={item} href="#" style={{ textDecoration: 'none', color: 'inherit', transition: '0.3s' }} className="hover-glow">
              {item}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 243, 255, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onJoin}
          style={{
            background: 'white',
            color: 'black',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '30px',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          Enter Dashboard
        </motion.button>
      </div>
    </motion.nav>
  );
};

// --- 2. MAIN LANDING PAGE COMPONENT ---
const LandingPage = ({ onEnterApp, onPlayTraining, onPlaySkillRain }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div style={{ background: '#050505', color: 'white', minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>

      <Navbar onJoin={onEnterApp} />

      {/* BACKGROUND GRID */}
      <div className="grid-bg" />

      {/* --- HERO SECTION --- */}
      <section style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '120px 40px 0',
        position: 'relative',
        zIndex: 2
      }}>

        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ paddingRight: '40px' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px',
            background: 'rgba(0, 243, 255, 0.05)',
            border: '1px solid rgba(0, 243, 255, 0.2)',
            borderRadius: '20px',
            color: '#00f3ff',
            marginBottom: '30px',
            fontSize: '0.8rem',
            fontWeight: '600',
            letterSpacing: '1px'
          }}>
            <span style={{ width: '6px', height: '6px', background: '#00f3ff', borderRadius: '50%', animate: 'pulse 2s infinite' }}></span>
            SYSTEM V.4.0 ONLINE
          </div>

          <h1 style={{
            fontSize: 'clamp(3.5rem, 6vw, 6rem)',
            fontWeight: '800',
            lineHeight: '1',
            marginBottom: '30px',
            letterSpacing: '-3px'
          }}>
            UNLOCK YOUR <br />
            <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>TRUE</span> <span style={{ color: '#00f3ff', textShadow: '0 0 30px rgba(0,243,255,0.5)' }}>POTENTIAL</span>
          </h1>

          <p style={{ fontSize: '1.2rem', color: '#a1a1aa', maxWidth: '500px', marginBottom: '40px', lineHeight: '1.7' }}>
            The first decentralized skill exchange protocol. Trade knowledge like currency in a trustless, high-speed network.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start' }}>

            {/* Primary Action: Enter App */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 243, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onEnterApp}
              style={{
                padding: '18px 40px',
                fontSize: '1.2rem',
                background: 'white',
                color: 'black',
                border: 'none',
                borderRadius: '50px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '240px',
                justifyContent: 'center'
              }}
            >
              Initialize Protocol <ArrowRight size={20} />
            </motion.button>

            {/* Game Options */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <motion.button
                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
                onClick={onPlayTraining}
                style={{
                  padding: '12px 20px',
                  background: 'transparent',
                  border: '1px solid #334155',
                  color: '#94a3b8',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem'
                }}
              >
                <Gamepad2 size={16} /> Training Sim
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, background: 'rgba(59, 130, 246, 0.1)', borderColor: '#3b82f6', color: '#3b82f6' }}
                onClick={onPlaySkillRain}
                style={{
                  padding: '12px 20px',
                  background: 'transparent',
                  border: '1px solid #334155',
                  color: '#94a3b8',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem'
                }}
              >
                <Zap size={16} /> Skill Rain
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Right: 3D Arc Reactor */}
        <div style={{ height: '80vh', position: 'relative' }}>
          <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
             <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
               <ArcReactor />
             </Float>
             <Environment preset="city" />
             <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2.5} far={4} color="#00f3ff" />
          </Canvas>
        </div>

      </section>

      {/* --- SCROLLING MARQUEE --- */}
      <div style={{ background: '#00f3ff', padding: '15px 0', transform: 'rotate(-2deg) scale(1.05)', position: 'relative', zIndex: 3, marginBottom: '100px' }}>
         <motion.div
           animate={{ x: [0, -1000] }}
           transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
           style={{ display: 'flex', gap: '50px', fontSize: '1.5rem', fontWeight: '900', color: 'black', whiteSpace: 'nowrap' }}
         >
           {[...Array(10)].map((_, i) => (
             <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
               <Zap size={20} fill="black" /> PROTOCOL LIVE
               <span style={{ opacity: 0.3 }}>//</span>
               LEARN FASTER
               <span style={{ opacity: 0.3 }}>//</span>
             </span>
           ))}
         </motion.div>
      </div>

      {/* --- FEATURES GRID --- */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px 100px', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>SYSTEM ARCHITECTURE</h2>
          <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto' }}>Advanced modular learning environments powered by peer-to-peer latency-free connections.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <FeatureCard
            icon={<Globe size={40} color="#00f3ff" />}
            title="Global Node Network"
            desc="Connect instantly with mentors from 140+ countries via our low-latency skill bridge."
          />
          <FeatureCard
            icon={<Shield size={40} color="#00f3ff" />}
            title="Verified Proof-of-Skill"
            desc="Blockchain-backed certification ensures every mentor is vetted and authentic."
          />
          <FeatureCard
            icon={<Zap size={40} color="#00f3ff" />}
            title="Hyper-Fast Learning"
            desc="Our proprietary algorithm matches you with the perfect peer in milliseconds."
          />
        </div>
      </section>

      {/* STYLES */}
      <style>{`
        .grid-bg {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(circle at 50% 50%, black, transparent 90%);
          z-index: 1;
        }
        .hover-glow:hover {
          color: white !important;
          text-shadow: 0 0 10px rgba(255,255,255,0.5);
        }
        @media (max-width: 900px) {
           section { grid-template-columns: 1fr !important; text-align: center; }
           .nav-links { display: none !important; }
           h1 { font-size: 3rem !important; }
        }
      `}</style>
    </div>
  );
};

// --- SUB-COMPONENT: GLASS CARD ---
const FeatureCard = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -10 }}
    style={{
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '40px',
      borderRadius: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '2px',
      background: 'linear-gradient(90deg, transparent, #00f3ff, transparent)'
    }} />
    <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0, 243, 255, 0.1)', borderRadius: '15px', display: 'inline-block' }}>
      {icon}
    </div>
    <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '15px' }}>{title}</h3>
    <p style={{ color: '#888', lineHeight: '1.6' }}>{desc}</p>
  </motion.div>
);

export default LandingPage;