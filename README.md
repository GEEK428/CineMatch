<div align="center">

# 🎬 CineMatch
### *Discover Your Next Favorite Film*

A full-stack movie recommendation app powered by content-based filtering, JWT auth, and Google OAuth 2.0.

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

[![GitHub stars](https://img.shields.io/github/stars/GEEK428/CineMatch?style=social)](https://github.com/GEEK428/CineMatch/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/GEEK428/CineMatch?style=social)](https://github.com/GEEK428/CineMatch/network/members)

</div>

---

## ✨ Features

- 🔎 **Live movie search** with auto-complete across 47 curated films
- 🎯 **Content-based recommendations** — get 4 similar movies ranked by genre & rating similarity
- 🖼️ Movie poster cards with title, genre, rating & description
- 🔐 **Email/password auth** with strong password enforcement + **Google OAuth 2.0**
- 👤 User profiles — update username, bio, avatar, favorite movie
- 🔄 Password reset & permanent account deletion
- 🛡️ Rate limiting, Helmet, bcrypt, JWT, input validation

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JS |
| Backend | Node.js, Express.js 5 |
| Database | MongoDB + Mongoose |
| Auth | JWT, Passport.js, Google OAuth 2.0 |
| Security | Helmet, bcryptjs, express-rate-limit, express-validator |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v16+, MongoDB, Google OAuth credentials

### Setup

```bash
git clone https://github.com/GEEK428/CineMatch.git
cd CineMatch/backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5500/frontend
```

```bash
npm run dev       # development
npm start         # production
```

Serve the `frontend/` folder with a live server (e.g. VS Code Live Server) and open `login.html`.

---

## 📡 API Endpoints

All routes prefixed with `/api/auth`:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register new user |
| `POST` | `/login` | Login with email & password |
| `POST` | `/forgot-password` | Reset password |
| `POST` | `/update-profile` | Update profile details |
| `POST` | `/delete-account` | Delete account (password-verified) |
| `POST` | `/complete-profile` | Complete profile after Google sign-in |
| `GET` | `/google` | Initiate Google OAuth |
| `GET` | `/google/callback` | Google OAuth callback |

---

## 🧠 Recommendation Engine

Each movie is encoded as a 2D feature vector `[genreId, normalizedRating]`. The engine computes **Euclidean distance** between the selected movie and all others, then returns the **top 4 closest matches**.

```js
function getFeatureVector(movie) {
  return [genreMap[movie.genre] || 0, movie.rating / 10];
}
```

---

## 👤 Author

<div align="center">

**GEEK428**

[![GitHub](https://img.shields.io/badge/GitHub-GEEK428-181717?style=for-the-badge&logo=github)](https://github.com/GEEK428)

⭐ *Star this repo if you found it useful!*

</div>
