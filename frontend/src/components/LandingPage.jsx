import { useState } from 'react';
import { motion } from 'framer-motion';
import ArcReactor from './hud/ArcReactor';
import AuthPage from './auth/AuthPage';
import { Activity, Battery, Wifi } from 'lucide-react'; // New icons for HUD

const LandingPage = ({ onLoginSuccess }) => {
  const [bootStatus, setBootStatus] = useState('idle');
  const [logs, setLogs] = useState([]);

  // Your chosen Iron Man outline image
  const IRON_MAN_IMG = "/hero-image.jpg";

  const startBootSequence = () => {
    setBootStatus('booting');

    const systemLogs = [
      "J.A.R.V.I.S. ONLINE...",
      "CONNECTING TO SATELLITE...",
      "IMPORTING PREFERENCES...",
      "SYSTEM CALIBRATED."
    ];

    systemLogs.forEach((log, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
      }, index * 600);
    });

    setTimeout(() => {
      setBootStatus('active');
    }, 3000);
  };

  if (bootStatus === 'active') {
    return <AuthPage onLoginSuccess={onLoginSuccess} onBack={() => setBootStatus('idle')} />;
  }

  // --- HUD WIDGET STYLES ---
  const widgetStyle = {
    position: 'absolute', color: '#00f3ff', fontFamily: 'monospace', fontSize: '0.8rem', 
    display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.7
  };

  return (
    <div style={{
      width: '100vw', height: '100vh', background: 'black', overflow: 'hidden', position: 'relative',
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>

      {/* 1. BACKGROUND IMAGE */}
      <motion.div 
        initial={{ scale: 3.2, opacity: 0 }}
        animate={{ scale: 2, opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
            position: 'absolute', 
            top: '-50%',    
            left: '0', 
            width: '100%',
            height: '100%', 
            backgroundImage: `url(${IRON_MAN_IMG})`,
            backgroundRepeat: 'no-repeat',  
            backgroundSize: 'contain',      
            backgroundPosition: 'center top',
            filter: bootStatus === 'booting' ? 'brightness(1.2) contrast(1.1)' : 'brightness(0.6)',
            transition: 'filter 3s ease'
        }}
      />

      {/* 2. THE ARC REACTOR OVERLAY */}
      <div style={{
        position: 'absolute',
        top: '74.9%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        zIndex: 10
      }}>
        <ArcReactor onClick={startBootSequence} booting={bootStatus === 'booting'} />
      </div>

      {/* 3. NEW: CORNER HUD WIDGETS (Fills the empty space) */}
      
      {/* Top Left: CPU & Network */}
      <div style={{ ...widgetStyle, top: '40px', left: '40px', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} /> CPU_CORE: STABLE
        </div>
        <div style={{ width: '150px', height: '2px', background: '#333', marginTop: '5px' }}>
            <motion.div 
                animate={{ width: ["20%", "80%", "40%"] }} 
                transition={{ duration: 2, repeat: Infinity }} 
                style={{ height: '100%', background: '#00f3ff' }} 
            />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
          <Wifi size={18} /> NET_UPLINK: ACTIVE
        </div>
      </div>

      {/* Top Right: Time & Location */}
      <div style={{ ...widgetStyle, top: '40px', right: '40px', textAlign: 'right', flexDirection: 'column', alignItems: 'flex-end' }}>
         <div>LOC: 34.0259° N, 118.7798° W</div>
         <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>MALIBU_SECTOR_4</div>
      </div>

      {/* Bottom Left: Battery & Power */}
      <div style={{ ...widgetStyle, bottom: '40px', left: '40px' }}>
         <Battery size={24} /> 
         <div>
            <div>POWER_CELLS: 400%</div>
            <div style={{ fontSize: '0.7rem', color: '#888' }}>RECHARGING...</div>
         </div>
      </div>

      {/* Bottom Right: Title (Moved slightly up to fit widget) */}
      <div style={{ position: 'absolute', bottom: '40px', right: '40px', textAlign: 'right', zIndex: 20 }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0, letterSpacing: '8px', color: 'white', fontFamily: 'Impact, sans-serif' }}>MARK V</h1>
        <div style={{ fontSize: '0.9rem', opacity: 0.8, color: '#00f3ff', letterSpacing: '2px' }}>SKILLSWAP PROTOCOL // VER 2.0</div>
      </div>

      {/* 4. SYSTEM LOGS (Floating Left - Adjusted) */}
      <div style={{ position: 'absolute', left: '5%', top: '50%', width: '300px', fontFamily: 'monospace' }}>
        {logs.map((log, i) => (
          <motion.div
            key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#00f3ff', textShadow: '0 0 5px #00f3ff' }}
          >
            {`> ${log}`}
          </motion.div>
        ))}
      </div>

      {/* 5. DECORATIVE GRID LINES (Subtle Background Detail) */}
      <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          maskImage: 'radial-gradient(circle, black 40%, transparent 90%)'
      }}></div>

    </div>
  );
};

export default LandingPage;