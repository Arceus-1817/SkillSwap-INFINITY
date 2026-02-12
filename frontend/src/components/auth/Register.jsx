import { useState } from 'react';
import axios from 'axios';
import { ChevronRight, Loader2 } from 'lucide-react';

const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Calling your Spring Boot Registration Endpoint
    axios.post('/api/auth/register', formData)
      .then(() => {
        alert("NODE_CREATED. PLEASE LOGIN.");
        onSwitchToLogin();
      })
      .catch(err => {
        console.error(err);
        setError("ERR: REGISTRATION_FAILED (Check Java Console)");
        setLoading(false);
      });
  };

  const inputStyle = {
    width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #00f3ff',
    padding: '8px 0', color: 'white', fontFamily: '"Courier New", monospace', fontSize: '0.9rem',
    outline: 'none', marginBottom: '15px', transition: '0.3s'
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: '#ff3333', marginBottom: '10px', fontSize: '0.8rem', border: '1px solid #ff3333', padding: '5px' }}>{`> ${error}`}</div>}

      <input type="text" placeholder="CODENAME" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
      <input type="email" placeholder="EMAIL_LINK" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={inputStyle} />
      <input type="password" placeholder="SET_PASSCODE" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={inputStyle} />

      <button type="submit" disabled={loading} style={{
          width: '100%', padding: '12px', background: 'rgba(0, 243, 255, 0.15)',
          border: '1px solid #00f3ff', color: '#00f3ff',
          fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px',
          cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px'
      }}>
        {loading ? <Loader2 className="animate-spin" size={18}/> : <>INITIALIZE_NODE <ChevronRight size={18}/></>}
      </button>

      <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.75rem', opacity: 0.7, color: '#00f3ff' }}>
        ALREADY_ACTIVE? <span onClick={onSwitchToLogin} style={{ textDecoration: 'underline', cursor: 'pointer', color: 'white' }}>LOGIN</span>
      </div>
    </form>
  );
};

export default Register;