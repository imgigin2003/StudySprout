# 🌱 StudySprout

StudySprout is a gamified productivity application that turns focused study time into a flourishing virtual garden. By completing Pomodoro sessions, users earn XP to grow unique plants, unlock rare species through consistency, and build a beautiful window display of their academic achievements.

---

## 🚀 Features

### 🍅 Gamified Pomodoro Timer

- **Flexible Focus:** Choose from 5 to 60-minute study blocks.
- **Task-Specific Growth:** Link your timer directly to a specific plant in your garden.
- **Partial Credit:** Life happens! If you stop early, you still earn XP for every full minute you focused.

### 🪴 The Garden System

- **Planting & Growth:** Start from seeds and watch them bloom as you study.
- **Early Mastery:** Prove your expertise! If you master a topic early, you can harvest your plant before the timer ends.
- **Streak Rewards:** Maintain a 7-day study streak to unlock advanced and rare plant varieties.

### 🏆 Achievement Display

- **Harvested Inventory:** Keep a collection of all the plants you've successfully grown.
- **Window Display:** Pick your favorite "Mastered" plants to show off on your public profile window.

---

## 🛠️ Tech Stack

| Layer          | Technology                |
| -------------- | ------------------------- |
| Frontend       | React.js _(Coming Soon!)_ |
| Backend        | Node.js & Express         |
| Database       | MongoDB (Mongoose)        |
| Authentication | JWT & Bcrypt              |

---

## 📁 Project Structure

```
StudySprout/
├── backend/
│   ├── controllers/    # Core game & auth logic
│   ├── models/         # Database schemas (User, Plant)
│   ├── routes/         # API endpoints
│   └── middleware/     # Auth guards & error handling
└── frontend/           # React application (Under Construction 🚧)
```

---

## ⚙️ Installation & Setup

1. **Clone the repository:**

```bash
git clone https://github.com/imgigin2003/StudySprout.git
```

2. **Install dependencies:**

```bash
cd StudySprout/backend
npm install
```

3. **Environment Variables:** Create a `.env` file in the `backend` folder and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

4. **Run the server:**

```bash
npm start
```

---

## 🗺️ Roadmap

- [x] Complete Backend API (Auth, Garden, Pomodoro)
- [ ] Initialize React Frontend
- [ ] Implement Real-time Timer UI
- [ ] Design Interactive Garden Dashboard
- [ ] Add Social Features (View friends' gardens)

---

## 🤝 Contributing

This project is part of a learning journey! Feel free to fork, explore, and suggest improvements.

---

_Happy Studying! 🍅🌱_
