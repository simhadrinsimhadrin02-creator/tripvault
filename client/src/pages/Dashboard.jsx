import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [trips, setTrips] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [destination, setDestination] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [rating, setRating] = useState("");
    const [editingTrip, setEditingTrip] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const token = localStorage.getItem("token");

    // ==========================================
    // FETCH USER AND TRIPS
    // ==========================================
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get(
                    "http://localhost:5000/api/auth/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setUser(userResponse.data.user);

                const tripsResponse = await axios.get(
                    "http://localhost:5000/api/trips",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setTrips(tripsResponse.data.trips);

            } catch (error) {
                setMessage("Unable to load your trips");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);


    // ==========================================
    // CREATE TRIP + PHOTO UPLOAD
    // ==========================================
    const handleCreateTrip = async (e) => {
        e.preventDefault();

        try {
            // Step 1: Create trip
            const response = await axios.post(
                "http://localhost:5000/api/trips",
                {
                    title,
                    destination,
                    startDate,
                    endDate,
                    description,
                    rating: Number(rating)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            let createdTrip = response.data.trip;

            // Step 2: Upload photo if selected
            if (selectedImage) {
                const formData = new FormData();

                formData.append("image", selectedImage);

                const uploadResponse = await axios.post(
                    `http://localhost:5000/api/trips/${createdTrip._id}/upload`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                createdTrip = uploadResponse.data.trip;
            }

            // Add trip to list
            setTrips([createdTrip, ...trips]);

            // Clear form
            setTitle("");
            setDestination("");
            setStartDate("");
            setEndDate("");
            setDescription("");
            setRating("");
            setSelectedImage(null);

            setMessage("Trip created successfully!");

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to create trip"
            );
        }
    };


    // ==========================================
    // UPDATE TRIP + PHOTO UPLOAD
    // ==========================================
    const handleUpdateTrip = async (e) => {
        e.preventDefault();

        try {
            // Step 1: Update trip details
            const response = await axios.put(
                `http://localhost:5000/api/trips/${editingTrip._id}`,
                {
                    title,
                    destination,
                    startDate,
                    endDate,
                    description,
                    rating: Number(rating)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            let updatedTrip = response.data.trip;

            // Step 2: Upload new photo if selected
            if (selectedImage) {
                const formData = new FormData();

                formData.append("image", selectedImage);

                const uploadResponse = await axios.post(
                    `http://localhost:5000/api/trips/${editingTrip._id}/upload`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                updatedTrip = uploadResponse.data.trip;
            }

            // Step 3: Update trip in dashboard
            setTrips(
                trips.map((trip) =>
                    trip._id === editingTrip._id
                        ? updatedTrip
                        : trip
                )
            );

            // Exit edit mode
            setEditingTrip(null);

            // Clear form
            setTitle("");
            setDestination("");
            setStartDate("");
            setEndDate("");
            setDescription("");
            setRating("");
            setSelectedImage(null);

            setMessage("Trip updated successfully!");

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to update trip"
            );
        }
    };


    // ==========================================
    // DELETE TRIP
    // ==========================================
    const handleDeleteTrip = async (tripId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this trip?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:5000/api/trips/${tripId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTrips(
                trips.filter((trip) => trip._id !== tripId)
            );

            setMessage("Trip deleted successfully!");

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to delete trip"
            );
        }
    };


    // ==========================================
    // LOGOUT
    // ==========================================
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };


    // ==========================================
    // LOADING
    // ==========================================
    if (loading) {
        return <p>Loading...</p>;
    }


    // ==========================================
    // DASHBOARD UI
    // ==========================================
    return (
        <div>

            <h1>TripVault Dashboard</h1>

            {user && (
                <>
                    <h2>Welcome, {user.name}!</h2>
                    <button onClick={() => navigate(`/profile/${user.username}`)}>
    My Profile
</button>
                    <p>Email: {user.email}</p>
                </>
            )}

            <hr />

            <h2>My Trips</h2>

            <h3>
                {editingTrip
                    ? "Edit Trip"
                    : "Create a New Trip"}
            </h3>


            {/* ==========================================
                CREATE / EDIT FORM
            ========================================== */}

            <form
                onSubmit={
                    editingTrip
                        ? handleUpdateTrip
                        : handleCreateTrip
                }
            >

                <div>
                    <label>Trip Title</label>
                    <br />

                    <input
                        type="text"
                        placeholder="Enter trip title"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                    />
                </div>

                <br />


                <div>
                    <label>Destination</label>
                    <br />

                    <input
                        type="text"
                        placeholder="Enter destination"
                        value={destination}
                        onChange={(e) =>
                            setDestination(e.target.value)
                        }
                    />
                </div>

                <br />


                <div>
                    <label>Start Date</label>
                    <br />

                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) =>
                            setStartDate(e.target.value)
                        }
                    />
                </div>

                <br />


                <div>
                    <label>End Date</label>
                    <br />

                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) =>
                            setEndDate(e.target.value)
                        }
                    />
                </div>

                <br />


                <div>
                    <label>Description</label>
                    <br />

                    <textarea
                        placeholder="Enter trip description"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                    ></textarea>
                </div>

                <br />


                <div>
                    <label>Rating</label>
                    <br />

                    <input
                        type="number"
                        min="1"
                        max="5"
                        placeholder="1 to 5"
                        value={rating}
                        onChange={(e) =>
                            setRating(e.target.value)
                        }
                    />
                </div>

                <br />


                <div>
    <label>Trip Photo:</label>
    <br />

    <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) =>
            setSelectedImage(e.target.files[0])
        }
    />

    {selectedImage && (
        <div style={{ marginTop: "15px" }}>
            <p>
                <strong>Photo Preview:</strong>
            </p>

            <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected trip"
                width="250"
                style={{
                    maxHeight: "200px",
                    objectFit: "cover"
                }}
            />
        </div>
    )}
</div>

                <br />


                <button type="submit">
                    {editingTrip
                        ? "Update Trip"
                        : "Create Trip"}
                </button>

            </form>

            <hr />


            {/* ==========================================
                MESSAGE
            ========================================== */}

            {message && <p>{message}</p>}


            {/* ==========================================
                TRIP LIST
            ========================================== */}

            {trips.length === 0 ? (

                <p>
                    You don't have any trips yet.
                    Create your first trip!
                </p>

            ) : (

                trips.map((trip) => (

                    <div key={trip._id}>

                        <h3>{trip.title}</h3>


                        <p>
                            <strong>Destination:</strong>{" "}
                            {trip.destination}
                        </p>


                        <p>
                            <strong>Start Date:</strong>{" "}
                            {trip.startDate
                                ? new Date(
                                    trip.startDate
                                ).toLocaleDateString()
                                : "N/A"}
                        </p>


                        <p>
                            <strong>End Date:</strong>{" "}
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


                        {/* ==========================================
                            COVER IMAGE
                        ========================================== */}

                        {trip.coverImage && (
                            <div>
                                <img
                                    src={trip.coverImage}
                                    alt={trip.title}
                                    width="250"
                                />
                            </div>
                        )}

                        <br />


                        {/* ==========================================
                            VIEW DETAILS BUTTON
                        ========================================== */}

                        <button
                            onClick={() =>
                                navigate(
                                    `/trip/${trip._id}`
                                )
                            }
                        >
                            View Details
                        </button>


                        {/* ==========================================
                            EDIT BUTTON
                        ========================================== */}

                        <button
                            onClick={() => {
                                setEditingTrip(trip);

                                setTitle(trip.title);

                                setDestination(
                                    trip.destination
                                );

                                setStartDate(
                                    trip.startDate
                                        ? trip.startDate.split("T")[0]
                                        : ""
                                );

                                setEndDate(
                                    trip.endDate
                                        ? trip.endDate.split("T")[0]
                                        : ""
                                );

                                setDescription(
                                    trip.description || ""
                                );

                                setRating(
                                    trip.rating || ""
                                );
                            }}
                            style={{
                                marginLeft: "10px"
                            }}
                        >
                            Edit
                        </button>


                        {/* ==========================================
                            DELETE BUTTON
                        ========================================== */}

                        <button
                            onClick={() =>
                                handleDeleteTrip(
                                    trip._id
                                )
                            }
                            style={{
                                marginLeft: "10px"
                            }}
                        >
                            Delete
                        </button>

                        <hr />

                    </div>

                ))
            )}


            {/* ==========================================
                LOGOUT
            ========================================== */}

            <button onClick={handleLogout}>
                Logout
            </button>

        </div>
    );
}

export default Dashboard;