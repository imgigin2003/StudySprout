# 🌱 StudySprout

> **Grow your focus. One session at a time.**

StudySprout is a gamified productivity app that turns focused study time into a flourishing virtual garden. Complete Pomodoro sessions to earn XP, grow unique plants, unlock rare species through daily streaks, and build a beautiful display of your academic achievements.

---

## ✨ Features

### 🍅 Gamified Pomodoro Timer

- **Flexible Focus** — Study blocks from 5 to 60 minutes
- **Task-Linked Growth** — Attach your timer to a specific plant in your garden
- **Partial XP** — Stop early and still earn XP for every full minute you focused
- **Session Tracking** — Automatic break reminders after every 4 Pomodoros

### 🪴 The Garden System

- **Plant & Grow** — Start from seeds and watch them bloom as you study
- **6 Plant Species** — Rose 🌹, Cactus 🌵, Sunflower 🌻, Tulip 🌷, Fern ☘️, Daisy 🌼
- **Streak Unlocks** — New plant varieties unlock every 7 days of consistent study
- **Early Mastery** — Mastered a topic? Harvest your plant before it's fully grown
- **Delete Plots** — Remove plants from your garden at any time

### 🔐 Auth & Profiles

- **Secure Auth** — JWT-based authentication with bcrypt password hashing
- **Custom Garden Names** — Personalize your garden on signup
- **Profile Stats** — Track total XP, day streak, and plant count

### 🏆 Achievement Display

- **Harvested Inventory** — A collection of every plant you've successfully grown
- **Window Display** — Showcase your favorite Mastered plants on your profile

---

## 🛠️ Tech Stack

| Layer          | Technology                         |
| -------------- | ---------------------------------- |
| Frontend       | React 19, Vite, Tailwind CSS v3    |
| UI Components  | shadcn/ui, Radix UI, Framer Motion |
| Backend        | Node.js, Express                   |
| Database       | MongoDB, Mongoose                  |
| Authentication | JWT, Bcrypt                        |
| Forms          | React Hook Form, Zod               |
| HTTP Client    | Axios                              |

---

## 📁 Project Structure

```
StudySprout/
├── backend/
│   ├── controllers/        # Auth, garden, plant & pomodoro logic
│   ├── models/             # Mongoose schemas (User, Plant, PomodoroSession)
│   ├── routes/             # API endpoints
│   └── middleware/         # Auth guards & error handling
└── frontend/
    ├── src/
    │   ├── components/     # UI components (garden, timer, layout)
    │   ├── pages/          # Route-level pages
    │   ├── context/        # Auth context
    │   ├── hooks/          # Custom hooks
    │   ├── lib/            # Query client, utilities
    │   └── utils/          # Axios instance, sound effects
    └── public/
```

---

## ⚙️ Installation & Setup

### Backend

1. **Clone the repository:**

```bash
git clone https://github.com/imgigin2003/StudySprout.git
cd StudySprout/backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create a `.env` file:**

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

4. **Start the server:**

```bash
npm start
```

### Frontend

```bash
cd StudySprout/frontend
npm install
npm run dev
```

> Frontend runs on `http://localhost:5173` — make sure your backend is running on port `3000`.

5. **Start the DB:**

```bash
mongod
```

---

## 🌿 Streak & Unlock System

| Streak  | Unlocked Plants        |
| ------- | ---------------------- |
| Day 0+  | 🌹 Rose, 🌵 Cactus     |
| Day 7+  | 🌻 Sunflower, 🌷 Tulip |
| Day 14+ | ☘️ Fern, 🌼 Daisy      |

---

## 🗺️ Roadmap

- [x] Backend API — Auth, Garden, Plants, Pomodoro
- [x] React Frontend with Vite + Tailwind
- [x] Pomodoro Timer with session tracking
- [x] Interactive Garden Dashboard
- [x] Streak-based plant unlocks with lock UI
- [x] Sound effects on interactions
- [ ] Social Features — view friends' gardens
- [ ] Mobile app (React Native)
- [ ] Leaderboards & achievements

---

## 🤝 Contributing

This project is part of a learning journey! Feel free to fork, explore, and suggest improvements via issues or pull requests.

---

_Happy Studying! 🍅🌱_
