import { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Search, Code, UserPlus, Check, Calendar, Loader2 } from 'lucide-react';

const UserList = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sentRequests, setSentRequests] = useState(new Set()); 
  
  // Booking State
  const [bookingUserId, setBookingUserId] = useState(null); 
  const [selectedDate, setSelectedDate] = useState("");

  // --- 1. FETCH USERS ---
  const fetchUsers = () => {
    axios.get('/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error("Failed to fetch users", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- 2. SEARCH LOGIC ---
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) {
        axios.get(`/api/users/search?skill=${searchTerm}`)
             .then(res => setUsers(res.data))
             .catch(err => console.error(err));
      } else {
        fetchUsers();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // --- 3. HANDLE CONNECT ---
  const handleConnect = (receiverId) => {
    if (!currentUser) return alert("Please log in to connect!");

    const message = prompt("Send a note with your request? (Optional)");
    if (message === null) return; 

    setSentRequests(prev => new Set(prev).add(receiverId)); // Optimistic update

    axios.post('/api/connections/request', null, {
        params: {
            requesterId: currentUser.id,
            receiverId: receiverId,
            message: message
        }
    })
    .then(() => console.log("Request sent!"))
    .catch(err => {
        alert("Failed to send request.");
        const newSet = new Set(sentRequests);
        newSet.delete(receiverId);
        setSentRequests(newSet);
    });
  };

  // --- 4. HANDLE SCHEDULE ---
  const handleSchedule = (mentorId) => {
    if (!selectedDate) return alert("Please pick a time first!");

    // Fix date format for Java (Append :00 seconds)
    const formattedDate = selectedDate.length === 16 ? selectedDate + ":00" : selectedDate;

    axios.post('/api/sessions/schedule', null, {
        params: {
            mentorId: mentorId,
            menteeId: currentUser.id,
            startTime: formattedDate
        }
    })
    .then(() => {
        alert("✅ Session Booked Successfully!");
        setBookingUserId(null); 
        setSelectedDate("");    
    })
    .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
            alert("❌ " + err.response.data.message); 
        } else {
            alert("❌ Failed to book session. You might need to connect first.");
        }
    });
  };

  return (
    <div style={{
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      {/* SEARCH BAR */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          placeholder="Find mentors by skill (e.g. Java)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', 
            border: '1px solid #475569', background: '#0f172a', color: 'white', outline: 'none'
          }}
        />
      </div>

      {/* USER GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {users.length > 0 ? (
          users.map(user => (
            <div key={user.id} style={{ 
              background: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155',
              display: 'flex', flexDirection: 'column', gap: '12px'
            }}>
              
              {/* HEADER: AVATAR + NAME */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                
                {/* AVATAR CIRCLE */}
                <div style={{ 
                    width: '50px', height: '50px', borderRadius: '50%', 
                    overflow: 'hidden', border: '2px solid #3b82f6', 
                    background: '#1e293b', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)', flexShrink: 0
                }}>
                    {user.avatarUrl ? (
                        <img 
                          src={user.avatarUrl} 
                          alt={user.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                              // If image fails, switch to Initials
                              e.target.style.display = 'none'; 
                              e.target.parentElement.innerText = user.name.charAt(0).toUpperCase();
                              e.target.parentElement.style.color = '#60a5fa';
                              e.target.parentElement.style.fontWeight = 'bold';
                              e.target.parentElement.style.fontSize = '1.2rem';
                          }}
                        />
                    ) : (
                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#60a5fa' }}>
                            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </span>
                    )}
                </div>

                {/* NAME & TITLE */}
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '1.1rem', color: '#f1f5f9', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>SkillSwap Mentor</div>
                </div>
              </div>

              {/* SKILLS */}
              <div style={{ borderTop: '1px solid #334155', paddingTop: '12px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    <Code size={14} /> TEACHES
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {user.skills && user.skills.length > 0 ? (
                    user.skills.map(s => (
                      <span key={s.id} style={{ 
                        fontSize: '0.75rem', color: '#60a5fa', background: 'rgba(59, 130, 246, 0.1)', 
                        padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(59, 130, 246, 0.2)'
                      }}>
                        {s.skillName}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#475569', fontStyle: 'italic' }}>No skills listed</span>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                {/* 1. CONNECT */}
                <button 
                  onClick={() => handleConnect(user.id)}
                  disabled={sentRequests.has(user.id) || user.id === currentUser?.id}
                  style={{ 
                    width: '100%', padding: '10px',
                    background: sentRequests.has(user.id) ? 'rgba(16, 185, 129, 0.1)' : '#3b82f6', 
                    color: sentRequests.has(user.id) ? '#10b981' : 'white', 
                    border: sentRequests.has(user.id) ? '1px solid rgba(16, 185, 129, 0.3)' : 'none', 
                    borderRadius: '8px', cursor: sentRequests.has(user.id) ? 'default' : 'pointer',
                    fontSize: '0.9rem', fontWeight: '600',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                >
                  {sentRequests.has(user.id) ? <><Check size={18}/> Request Sent</> : <><UserPlus size={18}/> Connect</>}
                </button>

                {/* 2. BOOK SESSION */}
                {bookingUserId === user.id ? (
                    <div style={{ background: '#1e293b', border: '1px solid #db2777', padding: '10px', borderRadius: '8px', animation: 'fadeIn 0.2s' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#f472b6' }}>Pick a time:</p>
                        <input 
                            type="datetime-local" 
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: 'none', marginBottom: '8px', background: '#334155', color: 'white' }}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleSchedule(user.id)} style={{ flex: 1, background: '#db2777', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Confirm</button>
                            <button onClick={() => setBookingUserId(null)} style={{ flex: 1, background: '#475569', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={() => setBookingUserId(user.id)}
                        disabled={user.id === currentUser?.id}
                        style={{ 
                            width: '100%', padding: '10px', background: 'transparent', 
                            border: '1px solid #db2777', color: '#f472b6', borderRadius: '8px', 
                            cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                            fontWeight: '600'
                        }}
                    >
                        <Calendar size={18} /> Book Session
                    </button>
                )}
              </div>

            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#64748b' }}>
            No mentors found.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;