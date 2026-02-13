import { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/auth/AuthPage";
import UserList from "./components/UserList";
import SkillList from "./components/SkillList";
import SessionList from "./components/SessionList";
import NotificationCenter from "./components/NotificationCenter";
import Profile from "./components/Profile";
import { LayoutDashboard, LogOut } from "lucide-react";
import Chat from "./components/Chat";
import axios from 'axios';

// This tells Axios to use the cloud URL if it exists, otherwise use localhost
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "https://your-future-backend-url.onrender.com";
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("landing"); // 'landing', 'auth', 'dashboard', 'profile'
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = "#0f172a";
    document.body.style.color = "white";
    document.body.style.fontFamily = "Inter, sans-serif";
    document.body.style.margin = "0";
  }, []);

  // --- HANDLERS ---
  const handleLoginSuccess = (user) => {
    console.log("🚀 Login Success! Welcome,", user.name);
    setCurrentUser(user);
    setView("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView("landing");
  };

  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  // --- ROUTING LOGIC ---

  // 1. Landing Page (The Entry Point)
  if (view === "landing") {
    return <LandingPage onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. Auth Page (If accessed directly, though Landing usually handles this transition internally)
  if (view === "auth") {
    return (
      <AuthPage
        onLoginSuccess={handleLoginSuccess}
        onBack={() => setView("landing")}
      />
    );
  }

  // 3. Profile Editor
  if (view === "profile" && currentUser) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f172a",
          paddingTop: "40px",
        }}
      >
        <Profile
          currentUser={currentUser}
          onUpdateUser={(updated) => {
            setCurrentUser(updated);
            setView("dashboard");
          }}
          onCancel={() => setView("dashboard")}
        />
      </div>
    );
  }

  // 4. Dashboard (Main App)
  if (view === "dashboard" && currentUser) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a" }}>
        {/* HEADER */}
        <header
          style={{
            background: "#1e293b",
            borderBottom: "1px solid #334155",
            padding: "16px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                background: "#3b82f6",
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              <LayoutDashboard size={20} color="white" />
            </div>
            <span
              style={{ fontSize: "1.25rem", fontWeight: "700", color: "white" }}
            >
              SkillSwap
            </span>
          </div>

          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            {/* PROFILE BUTTON */}
            <button
              onClick={() => setView("profile")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "rgba(15, 23, 42, 0.6)",
                padding: "6px 16px 6px 6px",
                borderRadius: "30px",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                cursor: "pointer",
                color: "#e2e8f0",
                transition: "0.2s",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #3b82f6",
                  background: "#1e293b",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerText = currentUser.name
                        .charAt(0)
                        .toUpperCase();
                    }}
                  />
                ) : (
                  <span style={{ fontWeight: "bold", color: "#60a5fa" }}>
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>
                {currentUser.name}
              </span>
            </button>

            <button
              onClick={handleLogout}
              style={{
                background: "#334155",
                border: "none",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </header>

        {/* MAIN GRID */}
        <main
          style={{
            maxWidth: "1280px",
            margin: "40px auto",
            padding: "0 20px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
          }}
        >
          {/* LEFT COLUMN */}
          <section
            style={{ display: "flex", flexDirection: "column", gap: "32px" }}
          >
            <NotificationCenter currentUser={currentUser} />
            <SessionList currentUser={currentUser} />
            <div>
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "#e2e8f0",
                  marginBottom: "16px",
                }}
              >
                Your Skill Portfolio
              </h2>
              <SkillList
                currentUser={currentUser}
                onUserUpdate={handleUserUpdate}
              />
            </div>
          </section>

          {/* RIGHT COLUMN */}
          <section>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "#e2e8f0",
                marginBottom: "16px",
              }}
            >
              Community Mentors
            </h2>
            <UserList currentUser={currentUser} />
          </section>
        </main>
        {/* FLOATING CHAT BUTTON */}
        <button
          onClick={() => setShowChat(true)}
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "#00f3ff",
            border: "none",
            boxShadow: "0 0 20px rgba(0, 243, 255, 0.4)",
            cursor: "pointer",
            zIndex: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/724/724715.png"
            alt="Chat"
            style={{ width: "30px", height: "30px", filter: "brightness(0)" }}
          />
        </button>

        {/* CHAT MODAL */}
        {showChat && (
          <Chat currentUser={currentUser} onClose={() => setShowChat(false)} />
        )}
      </div>
    );
  }

  return <div>Loading...</div>;
}

export default App;
