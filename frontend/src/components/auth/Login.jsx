import { useState } from 'react';
import axios from 'axios'; // Replaced Firebase with Axios
import { ChevronRight, Loader2 } from 'lucide-react';

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); setError('');

    // Pointing back to your Spring Boot REST API
    axios.post('/api/auth/login', { email, password })
      .then((res) => {
        // Assuming your Java backend returns the User object
        onLoginSuccess(res.data);
      })
      .catch((error) => {
        console.error("Login Error:", error);
        // Custom error message for Java 401/403 responses
        setError("ERR: INVALID_CREDENTIALS_OR_NODE_OFFLINE");
        setLoading(false);
      });
  };

  const inputStyle = {
    width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #00f3ff',
    padding: '10px 0', color: 'white', fontFamily: '"Courier New", monospace', fontSize: '1rem',
    outline: 'none', marginBottom: '20px', transition: '0.3s'
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      {error && <div style={{ color: '#ff3333', marginBottom: '15px', fontSize: '0.8rem', border: '1px solid #ff3333', padding: '8px' }}>{`> ${error}`}</div>}

      <div>
        <label style={{ fontSize: '0.7rem', opacity: 0.7, display: 'block', color: '#00f3ff' }}>USER_ID</label>
        <input type="email" placeholder="enter_email..." required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
      </div>

      <div>
        <label style={{ fontSize: '0.7rem', opacity: 0.7, display: 'block', color: '#00f3ff' }}>PASSCODE</label>
        <input type="password" placeholder="••••••" required value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
      </div>

      <button type="submit" disabled={loading} style={{
          width: '100%', padding: '15px', background: 'rgba(0, 243, 255, 0.15)', border: '1px solid #00f3ff', color: '#00f3ff',
          fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px', cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px'
      }}>
        {loading ? <Loader2 className="animate-spin" size={18}/> : <>ACCESS SYSTEM <ChevronRight size={18}/></>}
      </button>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.75rem', opacity: 0.7, color: '#00f3ff' }}>
        NO CLEARANCE? <span onClick={onSwitchToRegister} style={{ textDecoration: 'underline', cursor: 'pointer', color: 'white' }}>APPLY HERE</span>
      </div>
    </form>
  );
};

export default Login;