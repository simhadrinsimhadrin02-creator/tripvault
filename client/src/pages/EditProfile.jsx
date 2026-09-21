import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EditProfile() {
    const navigate = useNavigate();

    const [bio, setBio] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/auth/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
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

        try {
            const response = await axios.put(
                "http://localhost:5000/api/users/profile",
                {
                    bio
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(response.data.message);

            setTimeout(() => {
                navigate(`/profile/${username}`);
            }, 1000);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to update profile"
            );
        }
    };

    if (loading) {
        return <p>Loading profile...</p>;
    }

    return (
        <div>
            <h1>Edit Profile</h1>

            {message && <p>{message}</p>}

            <p>
                <strong>Username:</strong> @{username}
            </p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Bio:
                    </label>

                    <br />

                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows="5"
                        cols="50"
                        placeholder="Write something about yourself..."
                    />
                </div>

                <br />

                <button type="submit">
                    Save Profile
                </button>

                <button
                    type="button"
                    onClick={() =>
                        navigate(`/profile/${username}`)
                    }
                    style={{ marginLeft: "10px" }}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default EditProfile;