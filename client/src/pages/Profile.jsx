import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (!profile) {
        return (
            <div>
                <h2>Profile not found</h2>
                <p>{message}</p>

                <br />

                <button onClick={() => navigate("/")}>
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1>{profile.user.name}</h1>

            <p>
                <strong>@{profile.user.username}</strong>
            </p>

            <p>
                {profile.user.bio || "No bio available."}
            </p>

            <hr />

            <h2>Trips</h2>

            {profile.trips.length === 0 ? (
                <p>No trips available.</p>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "20px"
                    }}
                >
                    {profile.trips.map((trip) => (
                        <div
                            key={trip._id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "15px",
                                borderRadius: "10px"
                            }}
                        >
                            {trip.coverImage && (
                                <img
                                    src={trip.coverImage}
                                    alt={trip.title}
                                    style={{
                                        width: "100%",
                                        height: "180px",
                                        objectFit: "cover"
                                    }}
                                />
                            )}

                            <h3>{trip.title}</h3>

                            <p>
                                <strong>Destination:</strong>{" "}
                                {trip.destination}
                            </p>

                            <p>
                                <strong>Start:</strong>{" "}
                                {trip.startDate
                                    ? new Date(
                                          trip.startDate
                                      ).toLocaleDateString()
                                    : "N/A"}
                            </p>

                            <p>
                                <strong>End:</strong>{" "}
                                {trip.endDate
                                    ? new Date(
                                          trip.endDate
                                      ).toLocaleDateString()
                                    : "N/A"}
                            </p>

                            <p>
                                <strong>Rating:</strong>{" "}
                                ⭐ {trip.rating}/5
                            </p>
                        </div>
                    ))}
                </div>
            )}

            <br />

            <button onClick={() => navigate("/edit-profile")}>
                Edit Profile
            </button>

            <button
                onClick={() => navigate("/")}
                style={{ marginLeft: "10px" }}
            >
                Go Home
            </button>
        </div>
    );
}

export default Profile;