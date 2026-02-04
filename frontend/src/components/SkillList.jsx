import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Search, BookOpen, Download } from 'lucide-react';

const SkillList = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = () => {
    axios.get('/api/skills').then(res => setSkills(res.data));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill) return;
    axios.post('/api/skills', { SkillName: newSkill }).then(res => {
      setSkills([...skills, res.data]);
      setNewSkill("");
    });
  };

  const handleClaimSkill = (skillId) => {
    axios.put(`/api/users/1/skills/${skillId}`).then(() => {
      alert("Success! You have added this skill to your profile.");
    });
  };

  const filteredSkills = skills.filter(s =>
    (s.SkillName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          placeholder="Search for a skill..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 10px 10px 40px',
            borderRadius: '8px',
            border: '1px solid #475569',
            background: '#0f172a',
            color: 'white',
            outline: 'none',
            fontSize: '0.9rem'
          }}
        />
      </div>

      {/* ADD SKILL FORM */}
      <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Type a new skill (e.g. Java, Yoga)..."
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #3b82f6',
            background: 'rgba(59, 130, 246, 0.1)',
            color: 'white',
            outline: 'none',
            fontSize: '0.9rem'
          }}
        />
        <button type="submit" style={{
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '0 20px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Plus size={18} /> Add
        </button>
      </form>

      {/* SKILL LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
        {filteredSkills.map(skill => (
          <div key={skill.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px', background: '#334155', borderRadius: '8px',
            transition: '0.2s'
          }}>
            <span style={{ fontWeight: '500', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen size={16} color="#94a3b8"/> {skill.SkillName}
            </span>
            <button
              onClick={() => handleClaimSkill(skill.id)}
              style={{
                background: 'transparent',
                border: '1px solid #3b82f6',
                color: '#60a5fa',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Add to Profile
            </button>
          </div>
        ))}
        {filteredSkills.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '0.9rem' }}>
            No skills found. Try adding one above!
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillList;