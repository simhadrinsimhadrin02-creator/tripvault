import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TripDetails from "./pages/TripDetails";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

function Home() {
    return (
        <div>
            <h1>Welcome to TripVault</h1>
            <p>Your travel memory journal</p>
        </div>
    );
}

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />
                <Route
    path="/trip/:id"
    element={<TripDetails />}
/>

<Route
    path="/profile/:username"
    element={<Profile />}
/>
<Route
    path="/edit-profile"
    element={<EditProfile />}
/>

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;