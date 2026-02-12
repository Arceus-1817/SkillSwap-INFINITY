import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, X, MessageSquare, Zap, Shield, ChevronLeft, MoreVertical, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 🎵 Simple Sound Effect for "Tech" feel
const playNotificationSound = () => {
    const audio = new Audio("https://cdn.freesound.org/previews/536/536108_11568284-lq.mp3"); // Short beep
    audio.volume = 0.2;
    audio.play().catch(e => console.log("Audio play failed (user interaction needed)"));
};

const Chat = ({ currentUser, onClose }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // 1. FETCH CONTACTS (Users you have connected with)
  useEffect(() => {
    if (!currentUser?.id) return;
    axios.get(`/api/connections/user/${currentUser.id}`)
      .then(res => {
        // Extract users from connections
        const contacts = res.data
          .filter(c => c.status === 'ACCEPTED')
          .map(c => (c.requester.id === currentUser.id ? c.receiver : c.requester));

        // Remove duplicates
        const uniqueContacts = Array.from(new Map(contacts.map(u => [u.id, u])).values());
        setUsers(uniqueContacts);
        setLoading(false);
      })
      .catch(err => console.error("Contact Load Error", err));
  }, [currentUser]);

  // 2. POLLING FOR MESSAGES
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = () => {
      axios.get(`/api/messages/${currentUser.id}/${selectedUser.id}`)
        .then(res => {
            // Play sound only if new message count > old count (Logic simplified for demo)
            if (res.data.length > messages.length && res.data[res.data.length-1].sender.id !== currentUser.id) {
                playNotificationSound();
            }
            setMessages(res.data);
        })
        .catch(err => console.error("Sync Error", err));
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // 3s Polling
    return () => clearInterval(interval);
  }, [selectedUser, currentUser]); // Removed 'messages' dep to prevent infinite sound loop

  // 3. AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. SEND MESSAGE
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const payload = {
        senderId: currentUser.id,
        receiverId: selectedUser.id,
        text: input
    };

    // Optimistic UI Update (Show immediately)
    const tempMsg = {
        id: Date.now(),
        sender: currentUser,
        text: input,
        timestamp: new Date().toISOString()
    };
    setMessages([...messages, tempMsg]);
    setInput('');

    axios.post('/api/messages/send', payload)
        .then(res => {
            // Replace temp msg if needed, or just let polling handle it
        })
        .catch(err => alert("Transmission Failed"));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000,
        width: '900px', height: '600px', maxHeight: '90vh', maxWidth: '95vw',
        background: 'rgba(5, 10, 20, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(0, 243, 255, 0.3)',
        boxShadow: '0 0 40px rgba(0, 243, 255, 0.15)',
        display: 'flex', overflow: 'hidden',
        fontFamily: '"Inter", sans-serif'
      }}
    >
      {/* --- SIDEBAR (CONTACTS) --- */}
      <div style={{ width: '300px', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)' }}>

        {/* Sidebar Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={20} color="#00f3ff" fill="#00f3ff" />
            <span style={{ color: 'white', fontWeight: 'bold', letterSpacing: '1px' }}>COMMS_LINK</span>
        </div>

        {/* User List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {loading ? <div style={{padding:'20px', color:'#64748b'}}>Scanning frequencies...</div> :
             users.length === 0 ? <div style={{padding:'20px', color:'#64748b'}}>No active links.</div> :
             users.map(u => (
                <div key={u.id} onClick={() => setSelectedUser(u)}
                    style={{
                        padding: '12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '5px',
                        background: selectedUser?.id === u.id ? 'rgba(0, 243, 255, 0.1)' : 'transparent',
                        border: selectedUser?.id === u.id ? '1px solid rgba(0, 243, 255, 0.3)' : '1px solid transparent',
                        display: 'flex', alignItems: 'center', gap: '12px', transition: '0.2s'
                    }}
                >
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1e293b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow:'hidden' }}>
                        {u.avatarUrl ? <img src={u.avatarUrl} style={{width:'100%', height:'100%', objectFit:'cover'}}/> : <span style={{color:'#00f3ff'}}>{u.name.charAt(0)}</span>}
                    </div>
                    <div>
                        <div style={{ color: selectedUser?.id === u.id ? '#00f3ff' : 'white', fontWeight: '500' }}>{u.name}</div>
                        <div style={{ color: '#64748b', fontSize: '0.7rem' }}>SECURE CHANNEL</div>
                    </div>
                </div>
            ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#475569', fontSize: '0.7rem', display: 'flex', justifyContent: 'center' }}>
            ENCRYPTED :: AES-256
        </div>
      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'radial-gradient(circle at top right, rgba(0, 243, 255, 0.05), transparent 40%)' }}>

        {/* Chat Header */}
        <div style={{ height: '70px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 25px' }}>
            {selectedUser ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#334155', overflow:'hidden' }}>
                             {selectedUser.avatarUrl ? <img src={selectedUser.avatarUrl} style={{width:'100%', height:'100%', objectFit:'cover'}}/> : <span style={{display:'flex', height:'100%', alignItems:'center', justifyContent:'center', color:'white'}}>{selectedUser.name.charAt(0)}</span>}
                        </div>
                        <div style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', position: 'absolute', bottom: 0, right: 0, border: '2px solid #050a14' }}></div>
                    </div>
                    <div>
                        <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedUser.name}</div>
                        <div style={{ color: '#10b981', fontSize: '0.75rem', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Shield size={10} /> UPLINK ESTABLISHED
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ color: '#64748b' }}>Select a node to begin transmission</div>
            )}

            <div style={{ display: 'flex', gap: '15px' }}>
                <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><Phone size={20} /></button>
                <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><MoreVertical size={20} /></button>
                <button onClick={onClose} style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#ef4444', borderRadius: '6px', padding: '6px', cursor: 'pointer' }}>
                    <X size={18} />
                </button>
            </div>
        </div>

        {/* Messages Body */}
        <div ref={chatContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {!selectedUser ? (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.1 }}>
                    <Zap size={100} color="white" />
                    <h2>WAITING FOR TARGET</h2>
                </div>
            ) : (
                <AnimatePresence>
                    {messages.map((msg, idx) => {
                        const isMe = msg.sender.id === currentUser.id;
                        return (
                            <motion.div
                                key={msg.id || idx}
                                initial={{ opacity: 0, y: 20, x: isMe ? 20 : -20 }}
                                animate={{ opacity: 1, y: 0, x: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                                    maxWidth: '65%',
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: isMe ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <div style={{
                                    padding: '12px 18px',
                                    borderRadius: isMe ? '15px 15px 0 15px' : '15px 15px 15px 0',
                                    background: isMe ? 'linear-gradient(135deg, rgba(0, 243, 255, 0.2), rgba(0, 243, 255, 0.05))' : 'rgba(30, 41, 59, 0.8)',
                                    border: isMe ? '1px solid rgba(0, 243, 255, 0.3)' : '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    boxShadow: isMe ? '0 0 15px rgba(0, 243, 255, 0.1)' : 'none',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.5'
                                }}>
                                    {msg.text}
                                </div>
                                <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '5px' }}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '20px', background: 'rgba(5, 10, 20, 0.8)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <form onSubmit={sendMessage} style={{ display: 'flex', gap: '15px', position: 'relative' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={!selectedUser}
                    placeholder={selectedUser ? "Enter encrypted message..." : "Select a contact first"}
                    style={{
                        flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                        padding: '15px 20px', borderRadius: '12px', color: 'white', outline: 'none',
                        transition: '0.3s', fontFamily: 'monospace'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#00f3ff'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || !selectedUser}
                    style={{
                        background: '#00f3ff', color: 'black', border: 'none',
                        width: '50px', borderRadius: '12px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: (!input.trim() || !selectedUser) ? 0.5 : 1,
                        transition: '0.2s'
                    }}
                >
                    <Send size={20} />
                </button>
            </form>
        </div>

      </div>
    </motion.div>
  );
};

export default Chat;