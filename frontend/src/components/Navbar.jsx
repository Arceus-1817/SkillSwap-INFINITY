const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      marginBottom: '40px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ fontSize: '1.5rem' }}>🔄</div>
        <h2 style={{ margin: 0, letterSpacing: '-1px' }}>SkillSwap</h2>
      </div>

      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        style={{
          padding: '10px 20px',
          borderRadius: '30px',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: isDarkMode ? '#f1c40f' : '#2c3e50',
          color: isDarkMode ? '#000' : '#fff',
          fontWeight: 'bold',
          transition: '0.3s'
        }}
      >
        {isDarkMode ? '☀️ Day' : '🌙 Night'}
      </button>
    </nav>
  );
};

export default Navbar;