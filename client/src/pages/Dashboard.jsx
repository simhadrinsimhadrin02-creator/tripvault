import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/auth/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setUser(response.data.user);
            } catch (error) {
                setMessage("Unable to load user information");
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
};

    return (
        <div>
            <h1>TripVault Dashboard</h1>

            {user ? (
                <>
                    <h2>Welcome, {user.name}!</h2>
                    <p>Email: {user.email}</p>

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </>
            ) : (
                <p>{message || "Loading..."}</p>
            )}
        </div>
    );
}

export default Dashboard;