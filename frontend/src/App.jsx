import { useState, useEffect } from 'react';
import SkillList from './components/SkillList';
import UserList from './components/UserList';
import LandingPage from './components/LandingPage';
import TrainingGame from './components/TrainingGame';
import SkillRain from './components/SkillRain'; // Import the new Skill Rain game
import { LayoutDashboard, LogOut, Activity, Gamepad2, Zap } from 'lucide-react';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeGame, setActiveGame] = useState(null); // 'TRAINING', 'SKILLRAIN' or null

  // Global Styles
  useEffect(() => {
    document.body.style.backgroundColor = '#0f172a';
    document.body.style.color = 'white';
    document.body.style.fontFamily = 'Inter, sans-serif';
    document.body.style.margin = '0';
  }, []);

  // --- GAME RENDERER ---
  // This renders the active game overlay on top of EVERYTHING else
  const renderGameOverlay = () => {
    if (activeGame === 'TRAINING') return <TrainingGame onClose={() => setActiveGame(null)} />;
    if (activeGame === 'SKILLRAIN') return <SkillRain onClose={() => setActiveGame(null)} />;
    return null;
  };

  // --- VIEW 1: LANDING PAGE ---
  if (!showDashboard) {
    return (
      <>
        {renderGameOverlay()}
        <LandingPage
          onEnterApp={() => setShowDashboard(true)}
          onPlayTraining={() => setActiveGame('TRAINING')}
          onPlaySkillRain={() => setActiveGame('SKILLRAIN')}
        />
      </>
    );
  }

  // --- VIEW 2: DASHBOARD ---
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', position: 'relative' }}>

      {renderGameOverlay()}

      <header style={{
        background: '#1e293b',
        borderBottom: '1px solid #334155',
        padding: '16px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#3b82f6', padding: '8px', borderRadius: '8px' }}>
            <LayoutDashboard size={20} color="white" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>
            SkillSwap <span style={{ color: '#60a5fa' }}>Dashboard</span>
          </span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>

          {/* Training Game Button */}
          <button
            onClick={() => setActiveGame('TRAINING')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#34d399',
              padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600',
              transition: '0.2s'
            }}
          >
            <Gamepad2 size={18} /> Training
          </button>

          {/* Skill Rain Game Button */}
          <button
            onClick={() => setActiveGame('SKILLRAIN')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', color: '#60a5fa',
              padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600',
              transition: '0.2s'
            }}
          >
            <Zap size={18} /> Skill Rain
          </button>

          {/* System Status */}
          <div style={{ height: '24px', width: '1px', background: '#334155', margin: '0 8px' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.9rem' }}>
             <Activity size={16} color="#3b82f6" /> Online
          </div>

          <button
            onClick={() => setShowDashboard(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#334155', border: 'none', color: 'white',
              padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
              transition: '0.2s'
            }}
          >
            <LogOut size={16} /> Disconnect
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <section>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#e2e8f0' }}>Your Skill Portfolio</h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Add skills you can teach others</p>
          </div>
          <SkillList />
        </section>
        <section>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#e2e8f0' }}>Community Mentors</h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Find peers to learn from</p>
          </div>
          <UserList />
        </section>
      </main>
    </div>
  );
}

export default App;