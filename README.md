#  Goal Tracker App (Assignment 6)

A modern **React.js Goal Tracker application** with gamified XP system, streak tracking, multilingual support, and full RTL/LTR layout compatibility.

This app helps users stay productive by tracking daily goals and rewarding consistency.

---

## Project Overview

Goal Tracker is a productivity app where users can:

- Create and manage personal goals
- Track daily progress
- Earn XP for completing goals
- Maintain streaks for consistency
- Use the app in multiple languages

The app is fully responsive and works on both mobile and desktop devices.

---

## Tech Stack

- React.js
- Context API
- Firebase (Authentication & Config)
- i18next (Language system)
- Custom Hooks
- LocalStorage utilities
- CSS / Theme system

---

## 📁 Project Structure

React.js
└── Assignment6
└── src
├── components
│ ├── GoalsDetails.jsx
│ ├── Topbar.jsx
│ └── Sidebar.jsx
│
├── context
│ └── AuthContext.jsx
│
├── firebase
│ └── config.js
│
├── hooks
│ ├── goalsCache.js
│ └── useGoals.js
│
├── pages
│ ├── Analytics.jsx
│ ├── Auth.jsx
│ ├── Calendar.jsx
│ ├── Categories.jsx
│ ├── CreateGoal.jsx
│ ├── Dashboard.jsx
│ ├── Goals.jsx
│ └── Settings.jsx
│
├── utils
│ ├── goalUtils.js
│ ├── profileStorage.js
│ └── storage.js
│
├── App.jsx
├── i18n.js
├── index.css
├── main.jsx
├── rtlCache.js
└── theme.js


## How to Run the Project

```bash
# 1. Clone repository
git clone https://github.com/fereshtehazizi/goal-tracker.git

# 2. Go to project folder
cd Assignment6

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

## Language System (RTL / LTR)

This project supports 3 languages:

🇬🇧 English (LTR)
🇦🇫 Persian / Farsi (RTL)
🇸🇦 Arabic (RTL)

## XP & Streak System

This app uses a gamification system to motivate users.

⚡ XP Rules
Completing 1 day progress = 20 XP
XP is awarded daily based on goal activity

🔥 Streak Rules
A streak increases when the user completes at least one goal per day
Consecutive active days increase streak count
Missing a day resets streak to 0
