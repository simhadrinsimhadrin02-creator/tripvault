# TripVault

TripVault is a MERN stack travel memory journal that allows users to create an account, securely log in, create and manage trips, upload travel photos, and share public travel profiles.

## 🚀 Features

### 🔐 Authentication
- User registration
- Username-based registration
- Secure password hashing using bcrypt
- User login authentication
- JWT-based authentication
- Protected dashboard route
- Fetch authenticated user details
- Logout functionality

### 🧳 Trip Management
- Create trips
- View trips
- Edit trips
- Delete trips
- Trip title and destination
- Start and end dates
- Trip description
- Trip rating

### 📸 Photo Uploads
- Upload trip photos
- Cloudinary image storage
- Multer-based image upload middleware
- JPG, PNG and WEBP image support
- 5 MB image size limit
- Trip cover image support
- Multiple photos for each trip
- Local image preview before upload
- Display cover images on the dashboard
- Display all trip photos in a photo gallery

### 👤 Public Profiles
- Unique username for each user
- Public user profile page
- Public profile accessible without login
- Display user's name and username
- User bio
- Edit profile and update bio
- Display user's trips on public profile
- Trip cover images displayed on profile
- Public profile API

### 🗄️ Database & API
- MongoDB Atlas database integration
- Mongoose data modeling
- REST API using Express.js
- Protected API routes using JWT
- Public profile API without authentication

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
- Multer
- Cloudinary
- multer-storage-cloudinary

## 📁 Project Structure

```text
tripvault/

├── client/
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── TripDetails.jsx
│       │   ├── Profile.jsx
│       │   └── EditProfile.jsx
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── server/
│   ├── models/
│   │   ├── User.js
│   │   └── Trip.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── trips.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   ├── index.js
│   └── .env
│
├── .gitignore
└── README.md