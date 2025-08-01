# 🧠 Mood Tracker App

Welcome to the Mood Tracker App — your personal companion for emotional wellness, self-discovery, and mental health awareness. This full-stack application helps you track daily moods, journal thoughts, and engage in personalized self-care routines, all powered by insightful data.

<div align="center">
  <img width="716" height="421" alt="image" src="https://github.com/user-attachments/assets/43f1edd7-fbd3-4987-b6f6-d13c3440e7c9" />
</div>
<div align="center">
  <img width="705" height="344" alt="image" src="https://github.com/user-attachments/assets/5102c060-ec71-4c99-9cae-8424cae26db4" />
</div>

---

## ✨ Features

### 🎭 Mood Tracking

Real-time emotion detection using webcam and AI, helping you understand emotional patterns over time.

**1. Real-time emotion detection**

<div align="center">
  <img width="951" height="434" alt="image" src="https://github.com/user-attachments/assets/9ba48938-1ae0-4d44-8b53-a6dc6f04e6b2" />
</div>

**2. Past and present full analysis of mood tracking**

<div align="center">
  <img width="599" height="359" alt="image" src="https://github.com/user-attachments/assets/20669d36-88ec-4d25-8423-9b945bd349f3" />
</div>
<div align="center">
  <img width="709" height="417" alt="image" src="https://github.com/user-attachments/assets/936103c5-22c5-45c7-9eb6-5925c80b90df" />
</div>
<div align="center">
  <img width="744" height="413" alt="image" src="https://github.com/user-attachments/assets/85766b01-e3c5-432e-9d97-a8061dccced2" />
</div>

**3. Reports can be downloaded as PDFs or timestamp-based emotion CSVs**

---

### 📔 Emotional Journaling

A personal space to reflect, write, and understand the context behind your moods.

<div align="center">
  <img width="203" height="406" alt="image" src="https://github.com/user-attachments/assets/8c52f049-2568-4b8b-843f-d0e5ef968d4f" />
</div>

1. Motivational quotes based on journal reflections  
2. AI-based emotional analysis from text  
3. Self-nurturing activity suggestions  
4. YouTube playlists based on current mood  

---

### 🌱 Self-Care Garden

A gamified checklist with XP, levels, and a virtual garden that grows with your wellness consistency.

<div align="center">
  <img width="351" height="362" alt="image" src="https://github.com/user-attachments/assets/456dc089-aa5a-4322-9711-3ad9dc307738" />
</div>

1. Multiple levels for self-growth motivation  
2. Daily tasks for earning badges  
3. Each activity reflects its self-care value  

---

### 🔐 User Authentication

Secure signup and login system to personalize and protect your experience.

---

### 📊 Data Visualization

Beautiful, intuitive charts to track your emotional trends and personal growth.

---

### 📱 Responsive Design

Accessible and optimized for all devices — mobile, tablet, and desktop.

---

## 🚀 Technologies Used

This monorepo is built with modern full-stack and data science tools:

### 🔧 Frontend

| Feature          | Stack                                                  |
|------------------|--------------------------------------------------------|
| Main App + Self-Care | Next.js 14 (App Router), React, Tailwind CSS, TypeScript, shadcn/ui, Framer Motion |
| Journaling Frontend | React (standalone)                                  |

### 🔙 Backend

| Feature               | Stack                                           |
|------------------------|--------------------------------------------------|
| Authentication & DB    | Next.js API Routes, PostgreSQL (Neon), bcrypt, JWT |
| Journaling Backend     | Flask (Python), pandas (CSV handling)             |
| Emotion Detection      | Streamlit, OpenCV, TensorFlow/Keras, matplotlib, seaborn, Pillow |

---

## 📂 Project Structure

```bash
moodtrackerapp/
├── app/                        # Next.js app structure
│   ├── api/                    # API routes (auth, data)
│   ├── scripts/                # DB setup scripts
├── components/                 # Reusable React components
├── lib/                        # Utility functions (e.g., DB helpers)
├── hooks/                      # Custom React hooks
├── public/                     # Shared static assets
├── finaljournalb/
│   ├── emotional-jornal/       # Journaling React frontend
│   └── emotion-journal-backend/ # Flask backend for journaling
├── selfcarefinalb/             # Gamified self-care app (Next.js)
├── streamlit_app/              # Real-time emotion detection (Streamlit)

## 🛠️ Setup & Installation

### 📋 Prerequisites

- Node.js v18+
- npm or Yarn
- Python v3.8+
- pip
- PostgreSQL DB (Neon, Supabase, or local)

---

### 🔁 1. Clone the Repository
git clone https://github.com/bhavyadmn05/mood-tracker-app/
cd moodtrackerapp

🔐 2. Configure Environment Variables
Create a .env.local file in the root directory:
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your_jwt_secret_key_here"

🧱 3. Database Setup
Install ts-node globally (if not already):
npm install -g ts-node
Run the setup script:
ts-node app/scripts/setup-database.ts
This creates the users table using create-users-table.sql.

💻 4. Start Applications
A. Main App (Next.js)
cd moodtrackerapp
npm install
npm run dev
# Access: http://localhost:3000

B. Journaling App
Flask Backend:
cd finaljournalb/emotion-journal-backend
pip install -r requirements.txt
python app.py
# Access: http://127.0.0.1:5000
React Frontend:
cd finaljournalb/emotional-jornal
npm install
npm start
# Access: http://localhost:3001

C. Self-Care App
cd selfcarefinalb
npm install
npm run dev
# Access: http://localhost:3002

D. Streamlit Emotion Detection
cd streamlit_app
pip install -r requirements.txt
streamlit run app.py
# Access: http://localhost:8501
💡 Usage Workflow
✅ Register/Login
Visit: http://localhost:3000/auth

😊 Mood Tracking (AI Detection)
Visit: http://localhost:8501

📓 Journal Entries
Visit: http://localhost:3001

🪴 Self-Care Garden Checklist
Visit: http://localhost:3002

📄 License
Licensed under the MIT License — see LICENSE for full details.
