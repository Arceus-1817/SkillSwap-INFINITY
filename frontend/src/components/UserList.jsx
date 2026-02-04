import { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from 'lucide-react';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/users').then(res => setUsers(res.data));
  }, []);

  return (
    <div style={{
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
        {users.map(user => (
          <div key={user.id} style={{
            background: '#0f172a', padding: '16px', borderRadius: '10px', border: '1px solid #334155'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: '#475569', padding: '10px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <User size={20} color="#e2e8f0" />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.95rem', color: '#f1f5f9', fontWeight: '600' }}>{user.name || "Community Member"}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.email}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #334155', paddingTop: '10px' }}>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>Can Teach:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map(s => (
                    <span key={s.id} style={{
                      fontSize: '0.75rem', color: '#60a5fa', background: 'rgba(59, 130, 246, 0.1)',
                      padding: '4px 8px', borderRadius: '4px'
                    }}>
                      {s.SkillName}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>No skills listed yet</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;