import { useState } from 'react';
import axios from 'axios';
import { Save, X, Fingerprint, Cpu, Shield, Activity } from 'lucide-react';

const Profile = ({ currentUser, onUpdateUser, onCancel }) => {
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    bio: currentUser.bio || '',
    avatarUrl: currentUser.avatarUrl || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/api/users/${currentUser.id}`, formData)
      .then(res => {
        alert("IDENTITY_UPDATED");
        onUpdateUser(res.data);
        onCancel();
      })
      .catch(err => {
        console.error("Java Update Failed:", err);
        alert("ERR: UPDATE_FAILED");
      });
  };

  const inputStyle = {
    width: '100%', padding: '12px', background: '#020617', border: '1px solid #334155',
    color: 'white', borderRadius: '8px', outline: 'none', fontFamily: 'Inter, sans-serif'
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', color: 'white' }}>
      <div style={{
          background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(0, 243, 255, 0.3)',
          borderRadius: '20px', padding: '40px', position: 'relative',
          boxShadow: '0 0 50px rgba(0, 243, 255, 0.1)'
      }}>

        {/* HUD Corners */}
        <div style={{ position: 'absolute', top: -1, left: -1, width: '20px', height: '20px', borderTop: '2px solid #00f3ff', borderLeft: '2px solid #00f3ff' }}></div>
        <div style={{ position: 'absolute', bottom: -1, right: -1, width: '20px', height: '20px', borderBottom: '2px solid #00f3ff', borderRight: '2px solid #00f3ff' }}></div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', color: '#00f3ff', fontFamily: 'monospace' }}>
            <Fingerprint /> IDENTITY_EDITOR
        </h2>

        {/* ✨ NEW FEATURE: STATS HUD ✨ */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
            <div style={{ flex: 1, background: 'rgba(0, 243, 255, 0.05)', padding: '10px', borderRadius: '8px', border: '1px dashed rgba(0, 243, 255, 0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={16} color="#00f3ff" />
                <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>CLEARANCE</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{currentUser.role || 'AGENT'}</div>
                </div>
            </div>
            <div style={{ flex: 1, background: 'rgba(0, 243, 255, 0.05)', padding: '10px', borderRadius: '8px', border: '1px dashed rgba(0, 243, 255, 0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Activity size={16} color="#00f3ff" />
                <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>MODULES</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{currentUser.skills?.length || 0} INSTALLED</div>
                </div>
            </div>
        </div>

        {/* ✨ NEW FEATURE: SKILLS DISPLAY ✨ */}
        <div style={{ marginBottom: '25px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', marginBottom: '10px', fontSize: '0.9rem' }}>
                <Cpu size={14} /> INSTALLED_PROTOCOLS (SKILLS)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {currentUser.skills && currentUser.skills.length > 0 ? (
                    currentUser.skills.map(skill => (
                        <span key={skill.id} style={{
                            background: 'rgba(0, 243, 255, 0.1)', color: '#00f3ff',
                            padding: '5px 10px', borderRadius: '5px', fontSize: '0.8rem', border: '1px solid rgba(0, 243, 255, 0.2)'
                        }}>
                            {skill.skillName}
                        </span>
                    ))
                ) : (
                    <span style={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.8rem' }}>No skills installed. Use the dashboard to add some.</span>
                )}
            </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Avatar Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                    width: '60px', height: '60px', borderRadius: '50%', background: '#1e293b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #334155', overflow: 'hidden'
                }}>
                    {formData.avatarUrl ? (
                        <img src={formData.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#64748b' }}>{formData.name.charAt(0)}</span>
                    )}
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.9rem' }}>Avatar URL</label>
                    <input type="text" placeholder="https://..." value={formData.avatarUrl} onChange={e => setFormData({...formData, avatarUrl: e.target.value})} style={inputStyle} />
                </div>
            </div>

            {/* Name Input */}
            <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.9rem' }}>Codename</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
            </div>

            {/* Bio Input */}
            <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.9rem' }}>Directive (Bio)</label>
                <textarea rows="3" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} style={{ ...inputStyle, resize: 'none' }} />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                <button type="submit" style={primaryBtnStyle}> <Save size={18} /> SAVE </button>
                <button type="button" onClick={onCancel} style={secondaryBtnStyle}> <X size={18} /> CANCEL </button>
            </div>
        </form>
      </div>
    </div>
  );
};

const primaryBtnStyle = {
    flex: 1, padding: '12px', background: '#00f3ff', color: 'black', border: 'none',
    fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
};
const secondaryBtnStyle = {
    flex: 1, padding: '12px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155',
    fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
};

export default Profile;