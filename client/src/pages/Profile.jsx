import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Profile() {
    const { username } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/users/${username}/profile`
                );

                setProfile(response.data);
            } catch (error) {
                setMessage(
                    error.response?.data?.message ||
                        "Failed to load profile"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    // ==========================================
    // LOADING STATE
    // ==========================================
    if (loading) {
        return (
            <>
                <Navbar />

                <div className="page-container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading profile...</p>
                    </div>
                </div>

                <Footer />
            </>
        );
    }

    // ==========================================
    // PROFILE NOT FOUND
    // ==========================================
    if (!profile) {
        return (
            <>
                <Navbar />

                <main className="page-container">
                    <div className="empty-state">
                        <div className="empty-icon">👤</div>

                        <h2>Profile not found</h2>

                        <p>
                            {message ||
                                "The profile you are looking for does not exist."}
                        </p>

                        <button
                            onClick={() =>
                                navigate("/dashboard")
                            }
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    return (
        <div>
            <Navbar username={profile.user.username} />

            <main className="page-container">

                {/* Profile Header */}
                <section className="profile-header card">

                    <div className="profile-avatar">
                        {profile.user.name
                            ? profile.user.name
                                  .charAt(0)
                                  .toUpperCase()
                            : "U"}
                    </div>

                    <div className="profile-info">

                        <h1>{profile.user.name}</h1>

                        <p className="profile-username">
                            @{profile.user.username}
                        </p>

                        <p className="profile-bio">
                            {profile.user.bio ||
                                "No bio available."}
                        </p>

                        <div className="profile-stats">
                            <div>
                                <strong>
                                    {profile.trips.length}
                                </strong>
                                <span>
                                    {profile.trips.length === 1
                                        ? "Trip"
                                        : "Trips"}
                                </span>
                            </div>
                        </div>

                    </div>

                </section>

                {/* Profile Actions */}
                <div className="profile-actions">

                    <button
                        onClick={() =>
                            navigate("/edit-profile")
                        }
                    >
                        Edit Profile
                    </button>

                    <button
                        className="secondary-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>

                </div>

                {/* Trips */}
                <section className="profile-trips-section">

                    <div className="section-heading">
                        <h2>Trips</h2>

                        <span>
                            {profile.trips.length}{" "}
                            {profile.trips.length === 1
                                ? "Trip"
                                : "Trips"}
                        </span>
                    </div>

                    {profile.trips.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                🧳
                            </div>

                            <h3>No trips available</h3>

                            <p>
                                This user hasn't added any
                                trips yet.
                            </p>
                        </div>
                    ) : (
                        <div className="profile-trip-grid">

                            {profile.trips.map((trip) => (
                                <article
                                    className="profile-trip-card"
                                    key={trip._id}
                                >

                                    {trip.coverImage ? (
                                        <img
                                            src={trip.coverImage}
                                            alt={trip.title}
                                            className="profile-trip-image"
                                        />
                                    ) : (
                                        <div className="profile-trip-placeholder">
                                            🗺️
                                        </div>
                                    )}

                                    <div className="profile-trip-content">

                                        <h3>{trip.title}</h3>

                                        <p>
                                            <strong>
                                                📍 Destination:
                                            </strong>{" "}
                                            {trip.destination}
                                        </p>

                                        <p>
                                            <strong>
                                                📅 Start:
                                            </strong>{" "}
                                            {trip.startDate
                                                ? new Date(
                                                      trip.startDate
                                                  ).toLocaleDateString()
                                                : "N/A"}
                                        </p>

                                        <p>
                                            <strong>
                                                📅 End:
                                            </strong>{" "}
                                            {trip.endDate
                                                ? new Date(
                                                      trip.endDate
                                                  ).toLocaleDateString()
                                                : "N/A"}
                                        </p>

                                        <p>
                                            <strong>
                                                ⭐ Rating:
                                            </strong>{" "}
                                            {trip.rating}/5
                                        </p>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/trip/${trip._id}`
                                                )
                                            }
                                        >
                                            View Trip
                                        </button>

                                    </div>

                                </article>
                            ))}

                        </div>
                    )}

                </section>

            </main>

            <Footer />
        </div>
    );
}

export default Profile;