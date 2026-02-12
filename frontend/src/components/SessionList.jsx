import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, Video, Trash2, ExternalLink, Copy, Lock, Ban } from 'lucide-react';

const SessionList = ({ currentUser }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date()); // Tracks current time live

  // 1. FETCH SESSIONS
  const fetchSessions = () => {
    if (!currentUser?.id) return;
    axios.get(`/api/sessions/user/${currentUser.id}`)
      .then(res => {
        setSessions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Session Sync Failed", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(() => {
        fetchSessions();
        setNow(new Date()); // Update "now" every 10s to refresh buttons
    }, 10000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const joinSession = (link) => window.open(link, '_blank');

  const cancelSession = (sessionId) => {
    if (!window.confirm("Abort this mission? (Cancel Session)")) return;
    axios.delete(`/api/sessions/${sessionId}`)
      .then(() => {
        setSessions(sessions.filter(s => s.id !== sessionId));
        alert("Mission Aborted.");
      })
      .catch(err => alert("Failed to cancel."));
  };

  const copyLink = (link) => {
      navigator.clipboard.writeText(link);
      alert("Uplink coordinates copied.");
  };

  // 🔥 CORE LOGIC: DETERMINES STATE (Locked, Active, Expired)
  const getSessionState = (startTimeString, durationMinutes = 60) => {
      const start = new Date(startTimeString).getTime();
      const end = start + (durationMinutes * 60 * 1000);
      const unlockTime = start - (15 * 60 * 1000); // 15 mins before
      const currentTime = now.getTime();

      if (currentTime > end) return "EXPIRED";
      if (currentTime >= unlockTime) return "ACTIVE";
      return "LOCKED";
  };

  if (loading) return <div style={{padding:'20px', color:'#94a3b8'}}>Scanning schedule...</div>;

  return (
    <div style={{
      background: '#1e293b',
      border: '1px solid rgba(244, 114, 182, 0.3)',
      borderRadius: '12px', padding: '24px', color: 'white',
      minHeight: '200px'
    }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f472b6', marginBottom: '20px', fontFamily: 'monospace', letterSpacing: '1px' }}>
        <Calendar size={18} /> ACTIVE_SESSIONS
      </h3>

      {sessions.length === 0 ? (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'150px', opacity: 0.4, border: '1px dashed #334155', borderRadius:'8px' }}>
            <Calendar size={40} />
            <p style={{ marginTop:'10px', fontSize: '0.9rem' }}>NO_SCHEDULED_DATA</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'15px' }}>
            {sessions.map(ss => {
              const isToday = new Date(ss.startTime).toDateString() === new Date().toDateString();
              const state = getSessionState(ss.startTime, ss.durationMinutes);

              return (
                <div key={ss.id} style={{
                    background: state === 'EXPIRED' ? 'rgba(15, 23, 42, 0.4)' : 'rgba(15, 23, 42, 0.6)',
                    padding: '20px', borderRadius: '12px',
                    borderLeft: state === 'EXPIRED' ? '4px solid #475569' : (isToday ? '4px solid #f472b6' : '4px solid #334155'),
                    position: 'relative', opacity: state === 'EXPIRED' ? 0.7 : 1
                }}>

                    {/* HEADER */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom:'15px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: state === 'EXPIRED' ? '#64748b' : '#f472b6', fontWeight:'bold', fontSize:'1.1rem', textDecoration: state === 'EXPIRED' ? 'line-through' : 'none' }}>
                                <Clock size={16} />
                                {new Date(ss.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop:'4px' }}>
                                {new Date(ss.startTime).toDateString()}
                            </div>
                        </div>
                        {state === 'EXPIRED' && <span style={{ background:'rgba(71, 85, 105, 0.5)', color:'#cbd5e1', fontSize:'0.7rem', padding:'2px 8px', borderRadius:'4px' }}>COMPLETED</span>}
                        {state !== 'EXPIRED' && isToday && <span style={{ background:'rgba(244, 114, 182, 0.2)', color:'#f472b6', fontSize:'0.7rem', padding:'2px 8px', borderRadius:'4px' }}>TODAY</span>}
                    </div>

                    <div style={{ fontSize:'0.9rem', marginBottom:'20px', color:'white' }}>
                        <span style={{ opacity: 0.6 }}>WITH: </span>
                        <span style={{ fontWeight:'bold', color: state === 'EXPIRED' ? '#94a3b8' : '#f472b6' }}>
                             {currentUser.id === ss.mentor.id ? ss.mentee.name : ss.mentor.name}
                        </span>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div style={{ display:'flex', gap:'10px' }}>

                        {/* 🔥 3-STATE BUTTON LOGIC */}
                        {state === 'ACTIVE' && (
                            <button onClick={() => joinSession(ss.meetingLink)}
                                style={{
                                    flex: 1, padding: '10px', background: '#f472b6', color: 'white',
                                    border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer',
                                    display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                                    boxShadow: '0 0 10px rgba(244, 114, 182, 0.4)'
                                }}>
                                <Video size={16} /> INITIALIZE UPLINK
                            </button>
                        )}

                        {state === 'LOCKED' && (
                            <button disabled style={{
                                    flex: 1, padding: '10px', background: '#334155', color: '#94a3b8',
                                    border: '1px solid #475569', borderRadius: '6px', cursor: 'not-allowed',
                                    display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', opacity: 0.7
                                }}>
                                <Lock size={16} /> LOCKED (Opens 15m early)
                            </button>
                        )}

                        {state === 'EXPIRED' && (
                            <button disabled style={{
                                    flex: 1, padding: '10px', background: 'transparent', color: '#64748b',
                                    border: '1px solid #475569', borderRadius: '6px', cursor: 'not-allowed',
                                    display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'
                                }}>
                                <Ban size={16} /> LINK EXPIRED
                            </button>
                        )}

                        {state !== 'EXPIRED' && (
                            <button onClick={() => copyLink(ss.meetingLink)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #334155', color: '#94a3b8', padding:'10px', borderRadius:'6px', cursor:'pointer' }}>
                                <Copy size={18} />
                            </button>
                        )}

                        <button onClick={() => cancelSession(ss.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#ef4444', padding:'10px', borderRadius:'6px', cursor:'pointer' }}>
                            <Trash2 size={18} />
                        </button>
                    </div>

                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default SessionList;