import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, BookOpen, CheckCircle } from 'lucide-react';

// 1. Accept onUserUpdate as a prop
const SkillList = ({ currentUser, onUserUpdate }) => {
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState("");

  // Load available skills (e.g. "Java", "Football")
  useEffect(() => {
    axios.get('/api/skills').then(res => setSkills(res.data));
  }, []);

  // --- ADD NEW SKILL TO DATABASE ---
  const handleCreateSkill = () => {
    if (!newSkillName) return;
    axios.post('/api/skills', { skillName: newSkillName })
      .then(res => {
        setSkills([...skills, res.data]); // Update the list
        setNewSkillName("");
      });
  };

  // --- ADD SKILL TO YOUR PROFILE ---
  const handleAddToProfile = (skillId) => {
    if (!currentUser) return;

    // Call the PUT endpoint
    axios.put(`/api/users/${currentUser.id}/skills/${skillId}`)
      .then(res => {
        // res.data is the UPDATED User object from the backend
        alert("Skill Added Successfully!");
        
        // 2. IMPORTANT: Update the App state instantly!
        onUserUpdate(res.data); 
      })
      .catch(err => alert("Failed to add skill."));
  };

  // Helper: Check if user already has the skill
  const hasSkill = (skillId) => {
    // SAFETY CHECK: If currentUser or skills is missing, return false (don't crash)
    if (!currentUser || !currentUser.skills) return false;
    
    return currentUser.skills.some(s => s.id === skillId);
  };

  return (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
      
      {/* Create New Skill Input */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Type a new skill (e.g. Yoga)..." 
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: 'white' }}
        />
        <button onClick={handleCreateSkill} style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '0 20px', cursor: 'pointer', fontWeight: 'bold' }}>
          + Add
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
                <CheckCircle size={14} /> Added
              </span>
            ) : (
              <button 
                onClick={() => handleAddToProfile(skill.id)}
                style={{ 
                  background: 'transparent', border: '1px solid #3b82f6', color: '#60a5fa', 
                  padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' 
                }}
              >
                Add to Profile
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillList;