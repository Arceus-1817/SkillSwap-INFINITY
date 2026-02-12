# ⚡ SkillSwap: The Future of Skill Exchange

![License](https://img.shields.io/badge/License-MIT-blue.svg) ![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-green) ![React](https://img.shields.io/badge/Frontend-React-cyan)

**SkillSwap** is a full-stack mentorship platform designed with a high-fidelity "Cyberpunk/Futuristic" UI. It connects mentors and mentees based on specific technical skills, facilitating knowledge sharing through real-time communication and video conferencing.

## ✨ Key Features

### 🛡️ **Identity & Security**
* **Secure Authentication:** Custom implementation using BCrypt password hashing.
* **Role-Based Access:** Distinction between Users, Mentors, and Admins.
* **Profile Management:** Edit "Codenames" (Usernames), Avatars, and Biographies.

### 🤝 **Networking & Discovery**
* **Smart Search Matrix:** Filter users by **Name** or **Installed Protocols** (Skills).
* **Connection System:** Send, Accept, and Reject "Uplink" (Connection) requests.
* **Online Status:** Visual indicators for active nodes.

### 💬 **Real-Time Comms**
* **Encrypted-Style Chat:** A visually immersive chat interface with:
    * Glassmorphism UI.
    * Message sound effects.
    * Animated entry (Framer Motion).
    * Auto-scrolling history.

### 📅 **Mission Control (Scheduling)**
* **Session Booking:** Schedule meetings with time-conflict validation.
* **Jitsi Meet Integration:** Auto-generates secure, non-expiring video links.
* **Time-Lock Protocol:** "Join" buttons remain locked until 15 minutes before the session.
* **Auto-Expiry:** Links automatically disable after the session duration ends.

### 📧 **Automated Notifications**
* **Email Alerts:** Instant notifications for Connection Requests and Session Confirmations.
* **Scheduler:** Background jobs run every minute to send meeting reminders 15 minutes prior to start.

---

## 🛠️ Tech Stack

### **Backend (The Core)**
* **Framework:** Java Spring Boot 3+
* **Database:** H2 (Dev) / MySQL (Prod)
* **ORM:** Hibernate / Spring Data JPA
* **Security:** Spring Security (Custom Config)
* **Email:** JavaMailSender (Gmail SMTP)
* **Scheduling:** Spring Scheduler

### **Frontend (The Interface)**
* **Library:** React.js (Vite)
* **Styling:** CSS-in-JS with Cyberpunk Theme
* **HTTP Client:** Axios
* **Icons:** Lucide React
* **Animations:** Framer Motion

---

## 🚀 Getting Started

### Prerequisites
* Java JDK 17 or higher
* Node.js & npm
* A Gmail Account (for email notifications)

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/skillswap.git](https://github.com/your-username/skillswap.git)
cd skillswap
2. Backend Setup
Navigate to the backend folder (usually root or /backend).

Open src/main/resources/application.properties.

CRITICAL: Update the email settings with your Gmail App Password:

Properties
spring.mail.host=smtp.gmail.com
spring.mail.username=your-email@gmail.com
spring.mail.password=your-16-char-app-password
Run the application:

Bash
mvn spring-boot:run
3. Frontend Setup
Navigate to the frontend folder:

Bash
cd frontend
Install dependencies:

Bash
npm install framer-motion axios lucide-react
Start the development server:

Bash
npm run dev
📸 Usage Guide
Register: Create two accounts (e.g., Tony Stark and Steve Rogers) in different browsers (or Incognito mode).

Add Skills: Go to your profile and add skills (e.g., "Java", "React").

Connect: Search for the other user and click Connect.

Chat: Once accepted, open the chat bubble to exchange messages.

Book: Click Book Session, pick a time, and confirm.

Join: When the time comes, click Initialize Uplink to launch the video call.

🤝 Contributing
Contributions are welcome! Please fork the repository and create a pull request for any feature updates.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
Distributed under the MIT License. See LICENSE for more information.
