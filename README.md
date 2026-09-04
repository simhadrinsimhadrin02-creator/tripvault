# TripVault

TripVault is a MERN stack travel memory journal that allows users to create an account, securely log in, and access their personalized dashboard.

## 🚀 Features

- User registration
- Secure password hashing using bcrypt
- User login authentication
- JWT-based authentication
- Protected dashboard route
- Fetch authenticated user details
- Logout functionality
- MongoDB Atlas database integration
- React Router navigation
- REST API using Express.js

## 🛠️ Technologies Used

### Frontend
- React
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- JSON Web Token (JWT)
- CORS
- dotenv

## 📁 Project Structure

```text
tripvault/
├── client/
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── Dashboard.jsx
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── server/
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── index.js
│   └── .env
│
├── .gitignore
└── README.md