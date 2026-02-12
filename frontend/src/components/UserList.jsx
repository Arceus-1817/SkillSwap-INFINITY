import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, UserPlus, Check, Calendar, Loader2, Copy, ShieldCheck, X } from 'lucide-react';

const UserList = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingUserId, setBookingUserId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  // ✨ NEW FEATURE: SEARCH STATE
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch Users AND Connections
  useEffect(() => {
    if (!currentUser?.id) return;
    const fetchData = async () => {
        try {
            const [usersRes, connectionsRes] = await Promise.all([
                axios.get('/api/users'),
                axios.get(`/api/connections/user/${currentUser.id}`)
            ]);
            setUsers(usersRes.data.filter(u => u.id !== currentUser.id));
            setConnections(connectionsRes.data);
            setLoading(false);
        } catch (err) {
            console.error("Data Load Error:", err);
            setLoading(false);
        }
    };
    fetchData();
  }, [currentUser]);

  // ✨ NEW FEATURE: FILTER LOGIC (Name OR Skill)
  const filteredUsers = users.filter(user => {
      const lowerTerm = searchTerm.toLowerCase();
      const nameMatch = user.name?.toLowerCase().includes(lowerTerm);
      // Check if ANY skill matches
      const skillMatch = user.skills?.some(skill => skill.skillName.toLowerCase().includes(lowerTerm));
      return nameMatch || skillMatch;
  });

  const getConnectionStatus = (otherUserId) => {
    const conn = connections.find(c =>
        (c.requester.id === currentUser.id && c.receiver.id === otherUserId) ||
        (c.receiver.id === currentUser.id && c.requester.id === otherUserId)
    );
    return conn ? conn.status : null;
  };

  const handleConnect = (receiverId) => {
    const message = prompt("Send a note with your request?");
    if (message === null) return;
    axios.post('/api/connections/request', null, { params: { requesterId: currentUser.id, receiverId, message } })
      .then(res => { alert("Request Sent!"); setConnections([...connections, res.data]); })
      .catch(err => alert("Connection Failed"));
  };

  const handleSchedule = (mentorId) => {
    if (!selectedDate) return alert("Please pick a time!");
    const formattedDate = selectedDate.length === 16 ? selectedDate + ":00" : selectedDate;
    axios.post('/api/sessions/schedule', null, { params: { mentorId, menteeId: currentUser.id, startTime: formattedDate } })
      .then(() => { alert("Session Booked!"); setBookingUserId(null); })
      .catch(err => alert(err.response?.data?.message || "Booking Failed"));
  };

  // ✨ NEW FEATURE: Copy Email
  const copyEmail = (email) => {
      navigator.clipboard.writeText(email);
      alert("Comms Link Copied: " + email);
  };

  if (loading) return <div style={{padding:'20px', color:'white', display:'flex', gap:'10px'}}><Loader2 className="animate-spin"/> Initializing Node Map...</div>;

  return (
    <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>

      {/* HEADER WITH SEARCH */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ color: '#00f3ff', margin: 0 }}>AVAILABLE NODES</h3>

          {/* ✨ NEW FEATURE: SEARCH BAR UI */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search name or protocol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px',
                    background: '#0f172a', border: '1px solid #334155', color: 'white', outline: 'none'
                }}
              />
          </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredUsers.map(user => {
          const status = getConnectionStatus(user.id);

          return (
            <div key={user.id} style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155', position: 'relative' }}>

              {/* ✨ NEW FEATURE: ONLINE STATUS INDICATOR */}
              <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                  <span style={{ fontSize: '0.6rem', color: '#10b981', letterSpacing: '1px' }}>ACTIVE</span>
              </div>

              {/* AVATAR + NAME */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <div style={{
                      width: '50px', height: '50px', borderRadius: '50%',
                      background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid #00f3ff', overflow: 'hidden', flexShrink: 0
                  }}>
                      {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt="Av" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00f3ff' }}>{user.name?.charAt(0).toUpperCase()}</span>
                      )}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                      <h4 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {user.name}
                          {/* ✨ NEW FEATURE: ROLE BADGE */}
                          {user.role === 'MENTOR' && <ShieldCheck size={14} color="#f472b6" />}
                      </h4>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                          <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem' }}>{user.email?.substring(0, 15)}...</p>
                          <Copy size={12} color="#475569" style={{ cursor: 'pointer' }} onClick={() => copyEmail(user.email)} />
                      </div>
                  </div>
              </div>

              <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '15px', height: '36px', overflow: 'hidden' }}>
                  "{user.bio || "System default: No bio available."}"
              </p>

              {/* ✨ NEW FEATURE: SKILLS ON CARD */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '15px', height: '24px', overflow: 'hidden' }}>
                  {user.skills && user.skills.length > 0 ? (
                      user.skills.slice(0, 3).map(s => (
                          <span key={s.id} style={{ fontSize: '0.65rem', background: 'rgba(0, 243, 255, 0.1)', color: '#00f3ff', padding: '2px 6px', borderRadius: '4px' }}>
                              {s.skillName}
                          </span>
                      ))
                  ) : <span style={{ fontSize: '0.65rem', color: '#475569' }}>NO_PROTOCOLS</span>}
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ marginTop: '10px' }}>
                 {status === 'ACCEPTED' ? (
                     bookingUserId === user.id ? (
                          <div style={{ border: '1px solid #f472b6', padding: '10px', borderRadius: '8px', background: 'rgba(244, 114, 182, 0.05)' }}>
                              <input type="datetime-local" style={{width:'100%', marginBottom:'8px', background: '#1e293b', color:'white', border:'1px solid #475569', padding:'5px', borderRadius:'4px'}} onChange={e => setSelectedDate(e.target.value)} />
                              <div style={{display:'flex', gap:'5px'}}>
                                <button onClick={() => handleSchedule(user.id)} style={{flex:1, background:'#f472b6', border:'none', padding:'8px', color:'white', borderRadius:'4px', fontWeight:'bold', cursor:'pointer'}}>CONFIRM</button>
                                <button onClick={() => setBookingUserId(null)} style={{background:'transparent', border:'1px solid #f472b6', padding:'8px', color:'#f472b6', borderRadius:'4px', cursor:'pointer'}}><X size={14}/></button>
                              </div>
                          </div>
                     ) : (
                          <button onClick={() => setBookingUserId(user.id)} style={{ width:'100%', padding: '10px', background: 'transparent', border: '1px solid #f472b6', color: '#f472b6', borderRadius: '8px', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                              <Calendar size={16}/> BOOK SESSION
                          </button>
                     )
                 ) : status === 'PENDING' ? (
                     <button disabled style={{ width:'100%', padding: '10px', background: 'rgba(255,255,0,0.1)', color: 'yellow', border: '1px solid yellow', borderRadius: '8px', opacity: 0.7 }}>
                         <Loader2 size={16} className="animate-spin" style={{display:'inline', marginRight:'5px'}}/> PENDING...
                     </button>
                 ) : (
                     <button onClick={() => handleConnect(user.id)} style={{ width:'100%', padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                         <UserPlus size={16}/> CONNECT
                     </button>
                 )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserList;