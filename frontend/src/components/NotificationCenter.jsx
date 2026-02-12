import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, Check, X } from 'lucide-react';

const NotificationCenter = ({ currentUser }) => {
  const [notifications, setNotifications] = useState([]);

  // 1. Fetch pending connections from Java Backend
  const fetchNotifications = () => {
    if (!currentUser?.id) return;

    axios.get(`/api/connections/pending/${currentUser.id}`)
      .then(res => {
        setNotifications(res.data);
      })
      .catch(err => {
        console.error("Failed to load notifications from Java", err);
      });
  };

  useEffect(() => {
    fetchNotifications();

    // Polling every 5 seconds to check for new requests without Firebase
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // 2. Handle Accept/Reject Actions via Java REST API
  const handleAction = (requestId, newStatus) => {
    axios.put(`/api/connections/${requestId}/status`, null, {
      params: { status: newStatus }
    })
    .then(() => {
      // Optimistically remove from UI
      setNotifications(prev => prev.filter(n => n.id !== requestId));
      alert(`REQUEST_${newStatus.toUpperCase()}`);
    })
    .catch(err => {
      console.error("Action failed", err);
      alert("ERR: UPLINK_FAILURE");
    });
  };

  return (
    <div style={{
      background: '#0f172a',
      border: '1px solid rgba(0, 243, 255, 0.3)',
      borderRadius: '12px',
      padding: '20px',
      color: 'white',
      boxShadow: '0 0 20px rgba(0, 243, 255, 0.05)'
    }}>
      <h3 style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: '#00f3ff',
        marginBottom: '20px',
        fontSize: '1rem',
        letterSpacing: '1px',
        fontFamily: 'monospace'
      }}>
        <Bell size={18} /> INCOMING_UPLINKS
      </h3>

      {notifications.length === 0 ? (
        <p style={{ opacity: 0.4, fontSize: '0.8rem', textAlign: 'center', padding: '20px 0' }}>
          NO_PENDING_REQUESTS
        </p>
      ) : (
        notifications.map(note => (
          <div key={note.id} style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '12px',
            border: '1px solid #334155'
          }}>
            <div style={{ fontSize: '0.85rem', marginBottom: '12px' }}>
              <span style={{ color: '#00f3ff', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                CONNECTION_INITIATED
              </span>
              <p style={{ margin: 0, opacity: 0.7, fontStyle: 'italic', lineHeight: '1.4' }}>
                "{note.message || 'Transmission received without text.'}"
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleAction(note.id, 'accepted')}
                style={actionBtnStyle('#10b981')}
              >
                <Check size={16}/>
              </button>

              <button
                onClick={() => handleAction(note.id, 'rejected')}
                style={actionBtnStyle('#ef4444')}
              >
                <X size={16}/>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Reusable style helper
const actionBtnStyle = (color) => ({
  flex: 1,
  background: `${color}1a`, // 10% opacity
  border: `1px solid ${color}`,
  borderRadius: '4px',
  padding: '8px',
  color: color,
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  transition: '0.2s'
});

export default NotificationCenter;