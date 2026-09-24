import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function EditProfile() {
    const navigate = useNavigate();

    const [bio, setBio] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/auth/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setBio(response.data.user.bio || "");
                setUsername(response.data.user.username);
            } catch (error) {
                setMessage(
                    error.response?.data?.message ||
                        "Failed to load profile"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setSaving(true);

        try {
            const response = await axios.put(
                "http://localhost:5000/api/users/profile",
                {
                    bio,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage(
                response.data.message ||
                    "Profile updated successfully!"
            );

            setTimeout(() => {
                navigate(`/profile/${username}`);
            }, 1000);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "Failed to update profile"
            );
        } finally {
            setSaving(false);
        }
    };

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

    return (
        <div>
            <Navbar username={username} />

            <main className="page-container">

                <div className="edit-profile-wrapper">

                    <section className="edit-profile-card card">

                        <div className="edit-profile-header">
                            <div className="edit-profile-icon">
                                👤
                            </div>

                            <h1>Edit Profile</h1>

                            <p>
                                Update your profile information.
                            </p>
                        </div>

                        {message && (
                            <div
                                className={
                                    message
                                        .toLowerCase()
                                        .includes("success")
                                        ? "success-message"
                                        : "error-message"
                                }
                            >
                                {message}
                            </div>
                        )}

                        <div className="profile-username-box">
                            <span>Username</span>

                            <strong>
                                @{username}
                            </strong>
                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="form-group">
                                <label htmlFor="bio">
                                    Bio
                                </label>

                                <textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) =>
                                        setBio(e.target.value)
                                    }
                                    rows="6"
                                    placeholder="Write something about yourself..."
                                    maxLength="300"
                                ></textarea>

                                <div className="character-count">
                                    {bio.length}/300 characters
                                </div>
                            </div>

                            <div className="edit-profile-actions">

                                <button
                                    type="submit"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Profile"}
                                </button>

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() =>
                                        navigate(
                                            `/profile/${username}`
                                        )
                                    }
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </section>

                </div>

            </main>

            <Footer />
        </div>
    );
}

export default EditProfile;