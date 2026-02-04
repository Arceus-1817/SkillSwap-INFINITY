import { useEffect, useRef, useState } from 'react';
import { X, Trophy, AlertTriangle, Play, Zap } from 'lucide-react';

const SKILLS = ["React", "Java", "Python", "SQL", "Design", "AWS", "Figma", "Node", "Git"];

const SkillRain = ({ onClose }) => {
  const canvasRef = useRef(null);

  // Game State
  const [gameState, setGameState] = useState('START');
  const [displayScore, setDisplayScore] = useState(0); // For UI only
  const [highScore, setHighScore] = useState(0);

  // WE USE REFS FOR GAME LOGIC TO PREVENT RE-RENDERS FROM RESETTING THE LOOP
  const scoreRef = useRef(0);
  const animationRef = useRef(null);

  // Game Configuration Constants
  const PLAYER_WIDTH = 80;
  const PLAYER_HEIGHT = 15;
  const BASE_SPEED = 3;
  const BASE_SPAWN_RATE = 50;

  useEffect(() => {
    // Only run the game loop if we are PLAYING
    if (gameState !== 'PLAYING') {
      cancelAnimationFrame(animationRef.current);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Internal Game Variables (Persist without causing re-renders)
    let frameCount = 0;
    let player = { x: canvas.width / 2 - PLAYER_WIDTH / 2, y: canvas.height - 40 };
    let drops = [];
    let particles = [];
    let keys = {};

    // Input Handling
    const handleKeyDown = (e) => keys[e.code] = true;
    const handleKeyUp = (e) => keys[e.code] = false;

    // Mouse/Touch logic (attached to window to prevent getting stuck)
    const updatePlayerPos = (clientX) => {
      const rect = canvas.getBoundingClientRect();
      let newX = clientX - rect.left - PLAYER_WIDTH / 2;
      // Clamp to screen edges
      if (newX < 0) newX = 0;
      if (newX > canvas.width - PLAYER_WIDTH) newX = canvas.width - PLAYER_WIDTH;
      player.x = newX;
    };

    const handleMouseMove = (e) => updatePlayerPos(e.clientX);
    const handleTouchMove = (e) => updatePlayerPos(e.touches[0].clientX);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // --- MAIN GAME LOOP ---
    const render = () => {
      frameCount++;

      // 1. CALCULATE DIFFICULTY
      // Every 50 points, speed increases by 0.5
      const difficultyMultiplier = Math.floor(scoreRef.current / 50);
      const currentGravity = BASE_SPEED + (difficultyMultiplier * 0.5);
      // Spawn rate decreases (gets faster) but caps at 20 frames
      const currentSpawnRate = Math.max(20, BASE_SPAWN_RATE - (difficultyMultiplier * 2));

      // 2. Clear Screen
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Player Movement (Keyboard fallback)
      if (keys['ArrowLeft']) player.x -= 8;
      if (keys['ArrowRight']) player.x += 8;
      // Clamp keyboard movement
      if (player.x < 0) player.x = 0;
      if (player.x > canvas.width - PLAYER_WIDTH) player.x = canvas.width - PLAYER_WIDTH;

      // Draw Player Tray
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00f3ff';
      ctx.fillStyle = '#00f3ff';
      ctx.beginPath();
      ctx.roundRect(player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT, 8);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 4. Spawner Logic
      if (frameCount % currentSpawnRate === 0) {
        const isBug = Math.random() > 0.85; // 15% chance of bug
        drops.push({
          x: Math.random() * (canvas.width - 60),
          y: -40,
          width: isBug ? 30 : 60,
          height: 30,
          type: isBug ? 'BUG' : 'SKILL',
          text: isBug ? '🐛' : SKILLS[Math.floor(Math.random() * SKILLS.length)],
          speed: currentGravity, // Use dynamic speed
          color: isBug ? '#ff0055' : 'white'
        });
      }

      // 5. Drop Logic
      for (let i = drops.length - 1; i >= 0; i--) {
        let drop = drops[i];
        drop.y += drop.speed;

        // Draw Drop
        if (drop.type === 'BUG') {
           ctx.font = "24px sans-serif";
           ctx.textAlign = "center";
           ctx.fillText('👾', drop.x + 15, drop.y + 20);
        } else {
           // Skill Pill
           ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
           ctx.beginPath();
           ctx.roundRect(drop.x, drop.y, drop.width, drop.height, 6);
           ctx.fill();
           ctx.fillStyle = 'white';
           ctx.font = "bold 14px monospace";
           ctx.textAlign = "center";
           ctx.fillText(drop.text, drop.x + drop.width/2, drop.y + 20);
        }

        // COLLISION DETECTION
        if (
          drop.y + drop.height > player.y &&
          drop.y < player.y + PLAYER_HEIGHT &&
          drop.x + drop.width > player.x &&
          drop.x < player.x + PLAYER_WIDTH
        ) {
          if (drop.type === 'SKILL') {
            // SUCCESS: Add Score
            scoreRef.current += 10;
            setDisplayScore(scoreRef.current); // Sync UI
            createExplosion(drop.x + drop.width/2, drop.y, '#00f3ff');
          } else {
            // FAILURE: Bug Hit
            createExplosion(drop.x + drop.width/2, drop.y, '#ff0055');
            endGame();
            return; // Stop rendering this frame
          }
          drops.splice(i, 1); // Remove drop
          continue;
        }

        // Remove drops that fall off screen
        if (drop.y > canvas.height) {
          drops.splice(i, 1);
        }
      }

      // 6. Particle System
      for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        if (p.life <= 0) particles.splice(i, 1);
      }

      animationRef.current = requestAnimationFrame(render);
    };

    const createExplosion = (x, y, color) => {
      for (let i = 0; i < 12; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          life: 1,
          size: Math.random() * 3 + 2,
          color
        });
      }
    };

    // Start Loop
    render();

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, [gameState]); // Dependencies: Only restart if gameState changes (START -> PLAYING)

  const startGame = () => {
    scoreRef.current = 0; // Reset internal score
    setDisplayScore(0);   // Reset UI score
    setGameState('PLAYING');
  };

  const endGame = () => {
    if (scoreRef.current > highScore) setHighScore(scoreRef.current);
    setGameState('GAME_OVER');
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
      zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{ position: 'relative', background: '#0f172a', border: '1px solid #334155', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>

        {/* HUD */}
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, fontFamily: 'monospace', fontSize: '1.2rem', display: 'flex', gap: '20px' }}>
          <span style={{ color: 'white' }}>SCORE: <span style={{ color: '#00f3ff', fontWeight: 'bold' }}>{displayScore}</span></span>
          <span style={{ color: '#64748b' }}>HIGH: {highScore}</span>
        </div>

        <button onClick={onClose} style={{ position: 'absolute', top: 15, right: 15, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', zIndex: 10 }}>
          <X size={28} />
        </button>

        <canvas
          ref={canvasRef}
          width={600}
          height={500}
          style={{ cursor: 'none', background: '#0f172a', display: 'block', maxWidth: '100vw' }}
        />

        {/* --- START SCREEN --- */}
        {gameState === 'START' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.9)' }}>
            <Trophy size={60} color="#00f3ff" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '10px', fontWeight: '800' }}>SKILL RAIN</h2>
            <p style={{ color: '#94a3b8', marginBottom: '30px', textAlign: 'center', lineHeight: '1.6' }}>
              Move mouse to catch <strong>Skills</strong>.<br/>
              Avoid the <span style={{ color: '#ff0055' }}>Bugs</span>.<br/>
              <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Speed increases every 50 points.</span>
            </p>
            <button
              onClick={startGame}
              style={{ padding: '12px 32px', fontSize: '1.2rem', background: '#00f3ff', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Play size={20} fill="black" /> START GAME
            </button>
          </div>
        )}

        {/* --- GAME OVER --- */}
        {gameState === 'GAME_OVER' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.95)' }}>
            <AlertTriangle size={60} color="#ff0055" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '10px', fontWeight: '800' }}>SYSTEM CRASHED!</h2>
            <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '10px' }}>You hit a Bug.</p>
            <div style={{ fontSize: '3rem', color: 'white', marginBottom: '30px', fontFamily: 'monospace', fontWeight: 'bold' }}>{scoreRef.current}</div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={startGame} style={{ padding: '12px 30px', background: '#00f3ff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>TRY AGAIN</button>
              <button onClick={onClose} style={{ padding: '12px 30px', background: '#334155', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>EXIT</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SkillRain;