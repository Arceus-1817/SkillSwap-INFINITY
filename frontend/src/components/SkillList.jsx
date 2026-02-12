import { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen, CheckCircle, Plus } from 'lucide-react';

const SkillList = ({ currentUser, onUserUpdate }) => {
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState("");

  // 1. FETCH ALL GLOBAL SKILLS FROM JAVA
  const fetchGlobalSkills = () => {
    axios.get('/api/skills')
      .then(res => setSkills(res.data))
      .catch(err => console.error("Failed to fetch skills from Java", err));
  };

  useEffect(() => {
    fetchGlobalSkills();
  }, []);

  // 2. CREATE A NEW GLOBAL SKILL
  const handleCreateSkill = () => {
    if (!newSkillName.trim()) return;

    axios.post('/api/skills', { skillName: newSkillName })
      .then(res => {
        setSkills([...skills, res.data]); // Update local list with new skill from Java
        setNewSkillName("");
      })
      .catch(err => console.error("Error creating skill", err));
  };

  // 3. ADD SKILL TO CURRENT USER'S PROFILE (Java Backend)
  const handleAddToProfile = (skillId) => {
    if (!currentUser) return;

    axios.put(`/api/users/${currentUser.id}/skills/${skillId}`)
      .then(res => {
        alert("SKILL_SYNCHRONIZED");
        // Update the global App state with the updated User object from Java
        onUserUpdate(res.data);
      })
      .catch(err => {
        console.error("Skill addition failed", err);
        alert("ERR: UPLINK_FAILED");
      });
  };

  // Helper: Check if user already has this skill in their Java-returned object
  const hasSkill = (skillId) => {
    return currentUser?.skills?.some(s => s.id === skillId);
  };

  return (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>

      {/* Create New Skill Input */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="ENTER_NEW_PROTOCOL..."
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          style={{
            flex: 1, padding: '10px', borderRadius: '8px',
            border: '1px solid #475569', background: '#0f172a', color: 'white'
          }}
        />
        <button
          onClick={handleCreateSkill}
          style={{
            background: '#3b82f6', color: 'white', border: 'none',
            borderRadius: '8px', padding: '0 20px', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* List of Skills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {skills.map(skill => (
          <div key={skill.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen size={16} color="#94a3b8" />
              <span style={{ color: '#e2e8f0' }}>{skill.skillName}</span>
            </div>

            {hasSkill(skill.id) ? (
              <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={14} /> ADDED
              </span>
            ) : (
              <button
                onClick={() => handleAddToProfile(skill.id)}
                style={{
                  background: 'transparent', border: '1px solid #3b82f6', color: '#60a5fa',
                  padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem'
                }}
              >
                ADD_TO_PROFILE
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillList;