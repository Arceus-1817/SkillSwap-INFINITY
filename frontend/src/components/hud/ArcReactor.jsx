import { motion } from 'framer-motion';

const ArcReactor = ({ onClick, booting }) => {
  const cyan = '#00f3ff';
  
  return (
    <div 
      onClick={onClick}
      style={{ 
        position: 'relative', width: '220px', height: '220px', 
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        cursor: 'pointer',
        filter: booting ? `drop-shadow(0 0 50px ${cyan}) brightness(1.5)` : `drop-shadow(0 0 15px ${cyan})`
      }}
    >
      {/* 1. OUTER HUD RING (Dashed, Slow Spin) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: 'none', stroke: cyan, strokeWidth: '0.5', opacity: 0.6 }}>
           <circle cx="50" cy="50" r="48" strokeDasharray="4 2" />
           <circle cx="50" cy="50" r="40" strokeWidth="0.2" />
        </svg>
      </motion.div>

      {/* 2. MECHANICAL RINGS (Counter-Spin) */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 10, ease: "linear", repeat: Infinity }}
        style={{ position: 'absolute', inset: '10%' }}
      >
         <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: 'none', stroke: cyan, strokeWidth: '1', opacity: 0.8 }}>
            {/* Tech Ticks */}
            <path d="M50 5 L50 10" />
            <path d="M95 50 L90 50" />
            <path d="M50 95 L50 90" />
            <path d="M5 50 L10 50" />
            <circle cx="50" cy="50" r="35" strokeDasharray="20 10" strokeWidth="2" />
         </svg>
      </motion.div>

      {/* 3. THE TRIANGLE CORE (Mark VI Style) */}
      <motion.div
        animate={{ 
            scale: booting ? [1, 1.1, 50] : [1, 1.05, 1],
            opacity: booting ? [1, 1, 0] : 1
        }}
        transition={{ 
            duration: booting ? 2.5 : 2, 
            times: booting ? [0, 0.5, 1] : [0, 0.5, 1],
            repeat: booting ? 0 : Infinity 
        }}
        style={{ position: 'relative', width: '100px', height: '100px', zIndex: 10 }}
      >
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', filter: `drop-shadow(0 0 10px ${cyan})` }}>
            {/* The Triangle Shape */}
            <path 
                d="M10,25 L90,25 L50,95 Z" 
                fill="rgba(0, 243, 255, 0.2)" 
                stroke={cyan} 
                strokeWidth="3"
                strokeLinejoin="round"
            />
            {/* Inner Glow Triangle */}
            <path 
                d="M25,35 L75,35 L50,80 Z" 
                fill="#fff" 
                opacity="0.8"
            />
        </svg>
      </motion.div>

      {/* 4. CENTRAL TEXT (Hidden when booting) */}
      {!booting && (
          <div style={{ position: 'absolute', fontSize: '0.6rem', color: cyan, fontWeight: 'bold', letterSpacing: '1px', top: '60%', textShadow: '0 0 5px black' }}>
              INIT
          </div>
      )}

    </div>
  );
};

export default ArcReactor;