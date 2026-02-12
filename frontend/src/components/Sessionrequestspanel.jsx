import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, X, Clock, User, MessageSquare } from 'lucide-react';

const SessionRequestsPanel = ({ currentUser }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      // Fetch session requests where current user is the mentor
      axios.get(`/api/sessions/requests/mentor/${currentUser.id}`)
        .then(res => {
          setRequests(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [currentUser]);

  const handleAccept = async (requestId, startTime) => {
    try {
      // Generate meeting link (you can integrate with Zoom/Google Meet API here)
      const meetingLink = `https://meet.google.com/${Math.random().toString(36).substr(2, 9)}`;

      await axios.put(`/api/sessions/requests/${requestId}/accept`, {
        meetingLink,
        startTime
      });

      setRequests(prev => prev.filter(r => r.id !== requestId));
      alert('Session accepted! The mentee will be notified via email.');
    } catch (error) {
      console.error(error);
      alert('Failed to accept session request.');
    }
  };

  const handleDecline = async (requestId) => {
    if (!window.confirm('Are you sure you want to decline this session request?')) return;

    try {
      await axios.delete(`/api/sessions/requests/${requestId}`);
      setRequests(prev => prev.filter(r => r.id !== requestId));
      alert('Session request declined.');
    } catch (error) {
      console.error(error);
      alert('Failed to decline session request.');
    }
  };

  // Colors
  const cyan = '#00f3ff';
  const cardBg = '#1a1f35';
  const borderColor = 'rgba(0, 243, 255, 0.2)';

  // Don't show if no requests
  if (!loading && requests.length === 0) return null;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${cardBg} 0%, #0f1420 100%)`,
      border: `1px solid ${borderColor}`,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 0 30px rgba(0, 243, 255, 0.15), 0 4px 20px rgba(0, 0, 0, 0.3)',
      animation: 'pulse-glow 3s ease-in-out infinite'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: `1px solid ${borderColor}`,
        background: 'rgba(0, 243, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            position: 'relative',
            background: 'rgba(0, 243, 255, 0.15)',
            padding: '10px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Calendar size={20} color={cyan} />
            {requests.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: 'white',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: '700',
                border: '2px solid #1a1f35',
                boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
              }}>
                {requests.length}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: cyan,
              margin: 0,
              letterSpacing: '0.5px'
            }}>
              Session Requests
            </h2>
            <p style={{
              margin: '2px 0 0 0',
              fontSize: '0.75rem',
              color: '#64748b'
            }}>
              Students want to learn from you!
            </p>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div>
        {requests.map((request, index) => (
          <div
            key={request.id}
            style={{
              padding: '20px 24px',
              borderBottom: index < requests.length - 1 ? `1px solid ${borderColor}` : 'none',
              background: 'rgba(0, 0, 0, 0.2)'
            }}
          >
            {/* Student Info */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '16px'
            }}>
              {/* Avatar */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${cyan} 0%, #0ea5e9 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 'bold',
                color: '#0a0e1a',
                boxShadow: '0 4px 12px rgba(0, 243, 255, 0.3)',
                flexShrink: 0
              }}>
                {request.mentee.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#f1f5f9',
                  marginBottom: '4px'
                }}>
                  {request.mentee.name}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#64748b',
                  marginBottom: '8px'
                }}>
                  {request.mentee.email}
                </div>

                {/* New Badge */}
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(0, 243, 255, 0.1)',
                  border: `1px solid ${cyan}`,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  color: cyan,
                  letterSpacing: '0.5px'
                }}>
                  NEW REQUEST
                </div>
              </div>
            </div>

            {/* Topic */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '12px',
              borderLeft: `3px solid ${cyan}`
            }}>
              <div style={{
                fontSize: '0.7rem',
                color: '#64748b',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <MessageSquare size={12} />
                Topic
              </div>
              <div style={{
                fontSize: '1rem',
                color: '#f1f5f9',
                fontWeight: '600'
              }}>
                {request.topic}
              </div>
            </div>

            {/* Preferred Time */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '10px 14px',
              borderRadius: '10px',
              marginBottom: '12px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <Clock size={16} color={cyan} />
              <span style={{
                fontSize: '0.9rem',
                color: '#94a3b8',
                fontWeight: '500'
              }}>
                Preferred: {new Date(request.startTime).toLocaleString([], {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            {/* Message (if provided) */}
            {request.message && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '12px 16px',
                borderRadius: '10px',
                marginBottom: '16px',
                borderLeft: '3px solid rgba(100, 116, 139, 0.5)'
              }}>
                <div style={{
                  fontSize: '0.7rem',
                  color: '#64748b',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Message from student
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#94a3b8',
                  fontStyle: 'italic',
                  lineHeight: '1.5'
                }}>
                  "{request.message}"
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {/* Accept Button */}
              <button
                onClick={() => handleAccept(request.id, request.startTime)}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: '0.2s',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                }}
              >
                <CheckCircle size={18} />
                Accept & Schedule
              </button>

              {/* Decline Button */}
              <button
                onClick={() => handleDecline(request.id)}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: '0.2s',
                  fontWeight: '600',
                  fontSize: '0.85rem'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 30px rgba(0, 243, 255, 0.15), 0 4px 20px rgba(0, 0, 0, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(0, 243, 255, 0.25), 0 4px 20px rgba(0, 0, 0, 0.3);
          }
        }
      `}</style>
    </div>
  );
};

export default SessionRequestsPanel;