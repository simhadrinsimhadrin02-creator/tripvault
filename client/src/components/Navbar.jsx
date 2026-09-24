import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ username }) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">

                <button
                    className="navbar-logo"
                    onClick={() => navigate("/dashboard")}
                >
                    🌍 TripVault
                </button>

                <button
                    className="hamburger"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    ☰
                </button>

                <div
                    className={`navbar-links ${
                        menuOpen ? "navbar-links-open" : ""
                    }`}
                >
                    <button
                        onClick={() => {
                            navigate("/dashboard");
                            setMenuOpen(false);
                        }}
                    >
                        Dashboard
                    </button>

                    {username && (
                        <button
                            onClick={() => {
                                navigate(`/profile/${username}`);
                                setMenuOpen(false);
                            }}
                        >
                            My Profile
                        </button>
                    )}

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;