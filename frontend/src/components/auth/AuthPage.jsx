import { useState } from 'react';
import { motion } from 'framer-motion';
import Login from './Login';
import Register from './Register';
import { ArrowLeft, Cpu, Lock } from 'lucide-react';

const AuthPage = ({ onLoginSuccess, onBack }) => {
  const [view, setView] = useState('login');
  const cyan = '#00f3ff';

  return (
    <div style={{
      height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#050505', color: cyan, fontFamily: '"Courier New", Courier, monospace',
      overflow: 'hidden', position: 'relative'
    }}>

      {/* 1. BACKGROUND GRID */}
      <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          zIndex: 0
      }}></div>

      {/* 2. ROTATING HUD RINGS */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        style={{ position: 'absolute', width: '700px', height: '700px', border: `1px dashed ${cyan}`, borderRadius: '50%', opacity: 0.2 }}
      />
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        style={{ position: 'absolute', width: '600px', height: '600px', border: `2px solid ${cyan}`, borderRadius: '50%', opacity: 0.1, borderLeftColor: 'transparent', borderRightColor: 'transparent' }}
      />

      {/* 3. THE CENTER DATA CORE */}
      <div style={{
          position: 'relative', zIndex: 10, width: '400px',
          background: 'rgba(0, 10, 20, 0.9)',
          border: `1px solid ${cyan}`,
          boxShadow: `0 0 50px rgba(0, 243, 255, 0.15), inset 0 0 20px rgba(0, 243, 255, 0.05)`,
          padding: '40px',
          borderRadius: '20px',
          clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
      }}>

          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ borderBottom: `2px solid ${cyan}`, paddingBottom: '10px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <Lock size={20} />
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px' }}>
                      {view === 'login' ? 'SECURE_LOGIN' : 'NEW_UPLINK'}
                  </span>
              </div>
          </div>

          {view === 'login' ? (
              <Login
                onLoginSuccess={onLoginSuccess}
                onSwitchToRegister={() => setView('register')}
              />
          ) : (
              <Register
                onRegisterSuccess={() => setView('login')}
                onSwitchToLogin={() => setView('login')}
              />
          )}

          <button onClick={onBack} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: cyan, cursor: 'pointer', opacity: 0.5 }}>
              <ArrowLeft size={18} />
          </button>
      </div>

      <div style={{ position: 'absolute', top: 40, left: 40, opacity: 0.6 }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '5px' }}><Cpu size={16} /> CPU_LOAD: 12%</div>
          <div style={{ width: '150px', height: '4px', background: '#111' }}><div style={{ width: '12%', height: '100%', background: cyan }}></div></div>
      </div>
    </div>
  );
};

export default AuthPage;