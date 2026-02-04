import { useEffect, useRef, useState } from 'react';
import { X, Trophy, AlertTriangle } from 'lucide-react';

const SystemDefender = ({ onClose }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('START'); // START, PLAYING, GAME_OVER
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Game Configuration
  const PLAYER_SPEED = 7;
  const BULLET_SPEED = 10;
  const ENEMY_SPEED_BASE = 2;
  const SPAWN_RATE_BASE = 60; // Frames between spawns

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let frames = 0;

    // Game Objects
    let player = { x: canvas.width / 2, y: canvas.height - 50, width: 40, height: 40, color: '#00f3ff' };
    let bullets = [];
    let enemies = [];
    let particles = [];
    let keys = {};

    // Input Listeners
    const handleKeyDown = (e) => (keys[e.code] = true);
    const handleKeyUp = (e) => (keys[e.code] = false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // --- GAME LOOP ---
    const render = () => {
      if (gameState !== 'PLAYING') return;

      frames++;
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 1. Player Logic
      if ((keys['ArrowLeft'] || keys['KeyA']) && player.x > 0) player.x -= PLAYER_SPEED;
      if ((keys['ArrowRight'] || keys['KeyD']) && player.x < canvas.width - player.width) player.x += PLAYER_SPEED;

      // Auto-shoot every 15 frames
      if (frames % 15 === 0) {
        bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10, color: '#00f3ff' });
      }

      // Draw Player
      ctx.shadowBlur = 20;
      ctx.shadowColor = player.color;
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
      ctx.shadowBlur = 0;

      // 2. Bullet Logic
      bullets.forEach((b, i) => {
        b.y -= BULLET_SPEED;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);
        // Remove off-screen bullets
        if (b.y < 0) bullets.splice(i, 1);
      });

      // 3. Enemy Logic
      // Difficulty Scaling: Spawns get faster as score increases
      const currentSpawnRate = Math.max(20, SPAWN_RATE_BASE - Math.floor(score / 50));
      if (frames % currentSpawnRate === 0) {
        const size = Math.random() * 20 + 20;
        enemies.push({
          x: Math.random() * (canvas.width - size),
          y: -size,
          width: size,
          height: size,
          speed: ENEMY_SPEED_BASE + Math.random() + (score / 200),
          color: '#ff0055' // Glitch Red
        });
      }

      enemies.forEach((enemy, eIndex) => {
        enemy.y += enemy.speed;

        // Draw Enemy (Glitch Effect)
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff0055';
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Random horizontal glitch jitter
        if (Math.random() > 0.9) enemy.x += (Math.random() - 0.5) * 10;

        ctx.shadowBlur = 0;

        // Collision: Enemy hits Player (GAME OVER)
        if (
          enemy.x < player.x + player.width &&
          enemy.x + enemy.width > player.x &&
          enemy.y < player.y + player.height &&
          enemy.y + enemy.height > player.y
        ) {
          endGame();
        }

        // Collision: Enemy hits bottom (GAME OVER)
        if (enemy.y > canvas.height) {
          endGame();
        }

        // Collision: Bullet hits Enemy
        bullets.forEach((bullet, bIndex) => {
          if (
            bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y
          ) {
            // BOOM!
            createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.color);
            enemies.splice(eIndex, 1);
            bullets.splice(bIndex, 1);
            setScore(s => s + 10);
          }
        });
      });

      // 4. Particle System (Explosions)
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        ctx.fillStyle = `rgba(255, 0, 85, ${p.life})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        if (p.life <= 0) particles.splice(i, 1);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const createExplosion = (x, y, color) => {
      for (let i = 0; i < 10; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          life: 1,
          size: Math.random() * 4,
          color
        });
      }
    };

    const endGame = () => {
      setGameState('GAME_OVER');
      cancelAnimationFrame(animationFrameId);
    };

    if (gameState === 'PLAYING') {
      render();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, score]);

  const resetGame = () => {
    if (score > highScore) setHighScore(score);
    setScore(0);
    setGameState('PLAYING');
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0, 0, 0, 0.9)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{ position: 'relative', border: '2px solid #333', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 0 50px rgba(255, 0, 85, 0.2)' }}>

        {/* Game Header */}
        <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontFamily: 'monospace', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: '20px', fontSize: '1.2rem' }}>
             <span style={{ color: '#00f3ff' }}>SCORE: {score}</span>
             <span style={{ color: '#ff0055' }}>HIGH: {highScore}</span>
          </div>
        </div>

        {/* Close Button */}
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'white', cursor: 'pointer', zIndex: 10 }}>
          <X size={30} />
        </button>

        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{ background: '#050505', display: 'block' }}
        />

        {/* --- START SCREEN --- */}
        {gameState === 'START' && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: 'white' }}>
            <h1 style={{ fontSize: '3rem', fontFamily: 'monospace', marginBottom: '10px', color: '#ff0055' }}>SYSTEM DEFENDER</h1>
            <p style={{ marginBottom: '30px', color: '#888' }}>Defend the Kernel from Glitches.</p>
            <p style={{ marginBottom: '30px', fontSize: '0.9rem' }}>Controls: Left/Right Arrows</p>
            <button onClick={() => setGameState('PLAYING')} style={{ padding: '15px 40px', fontSize: '1.5rem', background: '#00f3ff', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>
              START MISSION
            </button>
          </div>
        )}

        {/* --- GAME OVER SCREEN --- */}
        {gameState === 'GAME_OVER' && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: 'white' }}>
            <AlertTriangle size={60} color="#ff0055" style={{ marginBottom: '20px' }} />
            <h1 style={{ fontSize: '3rem', fontFamily: 'monospace', marginBottom: '10px' }}>SYSTEM CRITICAL</h1>
            <p style={{ fontSize: '1.5rem', marginBottom: '30px' }}>Final Score: {score}</p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <button onClick={resetGame} style={{ padding: '12px 30px', fontSize: '1.2rem', background: '#00f3ff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                RETRY
              </button>
              <button onClick={onClose} style={{ padding: '12px 30px', fontSize: '1.2rem', background: '#333', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                EXIT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemDefender;