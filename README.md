# 🌍 TripVault

**TripVault** is a full-stack MERN travel memory journal that allows users to create and manage trips, upload travel photos, maintain personal profiles, and share public travel profiles.

🔗 **Live Demo:** https://tripvault-theta.vercel.app/
💻 **GitHub Repository:** https://github.com/simhadrinsimhadrin02-creator/tripvault

---

## 📸 Project Preview

> Add your TripVault dashboard screenshot or GIF here.

```text
![TripVault Dashboard](./screenshots/dashboard.png)
```

---

## 🚀 Features

### 🔐 Authentication

* User registration
* Username-based registration
* Secure password hashing using bcryptjs
* JWT-based authentication
* Login and logout
* Protected routes
* Authenticated user information

### 🧳 Trip Management

* Create trips
* View trip details
* Edit trips
* Delete trips
* Trip title and destination
* Start and end dates
* Trip description
* Trip rating
* Personal trip dashboard

### 📸 Photo Uploads

* Upload travel photos
* Cloudinary image storage
* Multer-based image upload
* JPG, PNG and WEBP support
* 5 MB image size limit
* Trip cover image
* Multiple photos per trip
* Responsive photo gallery

### 👤 User Profiles

* Unique usernames
* Personal profile
* Public profile pages
* Profile bio
* Edit profile
* Update bio
* Display user's trips
* Public trip information

### 🎨 UI & Responsive Design

* Responsive layout
* Mobile-friendly navigation
* Hamburger menu on small screens
* Responsive trip cards
* Responsive forms
* Responsive photo galleries
* Loading states
* Empty states
* Error messages
* Toast notifications
* Consistent styling
* Footer with GitHub link

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* CSS
* React Toastify

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* CORS
* dotenv
* Multer

### Image Storage

* Cloudinary

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database
* Cloudinary — Image Storage

---

## 📁 Project Structure

```text
tripvault/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TripDetails.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── EditProfile.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   ├── vercel.json
│   └── package.json
│
├── server/
│   ├── models/
│   │   ├── User.js
│   │   └── Trip.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── trips.js
│   │   └── userRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   │
│   ├── uploads/
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Local Installation

### 1. Clone the repository

```bash
git clone https://github.com/simhadrinsimhadrin02-creator/tripvault.git
```

```bash
cd tripvault
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

---

## 🔑 Environment Variables

### Backend

Create:

```text
server/.env
```

Add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend

Create:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000
```

⚠️ Never commit `.env` files or expose secret keys publicly.

---

## ▶️ Run the Application Locally

### Start Backend

```bash
cd server
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 🌐 Deployment

### Frontend

The React frontend is deployed using **Vercel**.

🔗 https://tripvault-theta.vercel.app/

### Backend

The Node.js/Express backend is deployed using **Render**.

### Database

MongoDB Atlas is used for storing:

* User information
* Trip information
* Profile information
* Trip image URLs

### Image Storage

Cloudinary is used for storing uploaded trip photos.

---

## 🧪 Production Testing

The deployed application has been tested for:

* ✅ User login
* ✅ Dashboard loading
* ✅ Trip creation
* ✅ Trip photo upload
* ✅ Cloudinary image storage
* ✅ Trip details
* ✅ Trip editing
* ✅ Trip deletion
* ✅ User profile
* ✅ Public profile
* ✅ Profile bio update
* ✅ Responsive UI
* ✅ Vercel frontend and Render backend communication

---

## 📱 Responsive Design

TripVault is designed to work across different screen sizes, including:

* Desktop
* Laptop
* Tablet
* Mobile devices

The interface includes responsive:

* Navigation
* Trip cards
* Forms
* Photo galleries
* Profile pages
* Buttons and controls

---

## 🔒 Security

* Passwords are hashed using bcryptjs.
* JWT is used for authentication.
* Protected API routes require authentication.
* Environment variables are used for sensitive configuration.
* `.env` files are excluded from Git.

---

## 👨‍💻 Developer

**Simhadri N**

BE — Information Science and Engineering

Built using the MERN stack as part of the TripVault virtual internship.

### GitHub

https://github.com/simhadrinsimhadrin02-creator

---

## 📄 License

This project is created for educational and internship purposes.
