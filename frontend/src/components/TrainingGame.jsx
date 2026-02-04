import { useState, useEffect, useRef } from 'react';
import { X, Terminal, Cpu, Play } from 'lucide-react';

const CODE_SNIPPETS = [
  "System.out.println('Hello World');",
  "import React, { useState } from 'react';",
  "public static void main(String[] args)",
  "const [data, setData] = useState([]);",
  "pip install numpy pandas tensorflow",
  "SELECT * FROM users WHERE id = 1;",
  "git commit -m 'Fixed critical bug'",
  "npm run dev -- --host",
  "while(true) { keepCoding(); }",
  "sudo apt-get update && upgrade"
];

const TrainingGame = ({ onClose }) => {
  const [gameState, setGameState] = useState('START'); // START, PLAYING, WON, LOST
  const [currentSnippet, setCurrentSnippet] = useState("");
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const inputRef = useRef(null);

  // Initialize Game
  const startGame = () => {
    setGameState('PLAYING');
    setScore(0);
    setTimeLeft(30);
    setInput("");
    nextSnippet();
    // Auto-focus input
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const nextSnippet = () => {
    const random = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
    setCurrentSnippet(random);
    setInput("");
  };

  // Timer Logic
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('LOST');
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Win Condition
  useEffect(() => {
    if (score >= 5) {
      setGameState('WON');
    }
  }, [score]);

  // Input Handler
  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);

    if (val === currentSnippet) {
      setScore(s => s + 1);
      nextSnippet();
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(5, 5, 10, 0.95)',
      backdropFilter: 'blur(10px)',
      zIndex: 100,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{
        width: '600px',
        padding: '40px',
        background: '#0f172a',
        border: '2px solid #00f3ff',
        borderRadius: '16px',
        boxShadow: '0 0 50px rgba(0, 243, 255, 0.2)',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        {/* --- STATE: START MENU --- */}
        {gameState === 'START' && (
          <div>
            <Cpu size={64} color="#00f3ff" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '10px', fontFamily: 'monospace' }}>NEURAL UPLINK</h2>
            <p style={{ color: '#94a3b8', marginBottom: '30px' }}>
              Calibrate your connection speed. <br/>
              Type <strong>5 code snippets</strong> correctly in <strong>30 seconds</strong>.
            </p>
            <button
              onClick={startGame}
              style={{
                background: '#00f3ff', color: 'black', border: 'none',
                padding: '12px 32px', fontSize: '1.2rem', fontWeight: 'bold',
                borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto'
              }}
            >
              <Play size={20} /> INITIATE LINK
            </button>
          </div>
        )}

        {/* --- STATE: PLAYING --- */}
        {gameState === 'PLAYING' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#00f3ff', fontFamily: 'monospace', fontSize: '1.2rem' }}>
              <span>SCORE: {score}/5</span>
              <span>TIME: {timeLeft}s</span>
            </div>

            <div style={{
              background: '#1e293b', padding: '20px', borderRadius: '8px', marginBottom: '20px',
              fontFamily: 'monospace', fontSize: '1.4rem', color: '#e2e8f0', letterSpacing: '1px'
            }}>
              {currentSnippet}
            </div>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInput}
              placeholder="Type the code above..."
              style={{
                width: '100%', padding: '15px', fontSize: '1.2rem',
                background: 'black', border: '1px solid #334155', color: '#00f3ff',
                fontFamily: 'monospace', outline: 'none', borderRadius: '8px'
              }}
            />
          </div>
        )}

        {/* --- STATE: WON --- */}
        {gameState === 'WON' && (
          <div>
             <h2 style={{ fontSize: '3rem', color: '#4ade80', marginBottom: '10px' }}>UPLOAD COMPLETE</h2>
             <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Your neural link is fully optimized.</p>
             <button onClick={onClose} style={{ background: '#334155', color: 'white', padding: '10px 24px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Return to Dashboard</button>
          </div>
        )}

        {/* --- STATE: LOST --- */}
        {gameState === 'LOST' && (
          <div>
             <h2 style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '10px' }}>CONNECTION FAILED</h2>
             <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Latency too high. Try again?</p>
             <button onClick={startGame} style={{ background: '#00f3ff', color: 'black', padding: '10px 24px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Retry</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default TrainingGame;