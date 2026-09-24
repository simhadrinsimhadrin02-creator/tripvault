import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [trips, setTrips] = useState([]);
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
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setUser(userResponse.data.user);

                const tripsResponse = await axios.get(
                    "http://localhost:5000/api/trips",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setTrips(tripsResponse.data.trips);
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                        "Unable to load your trips"
                );
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
            const response = await axios.post(
                "http://localhost:5000/api/trips",
                {
                    title,
                    destination,
                    startDate,
                    endDate,
                    description,
                    rating: Number(rating),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            let createdTrip = response.data.trip;

            // Upload photo if selected
            if (selectedImage) {
                const formData = new FormData();

                formData.append("image", selectedImage);

                const uploadResponse = await axios.post(
                    `http://localhost:5000/api/trips/${createdTrip._id}/upload`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                createdTrip = uploadResponse.data.trip;
            }

            setTrips((currentTrips) => [
                createdTrip,
                ...currentTrips,
            ]);

            // Clear form
            setTitle("");
            setDestination("");
            setStartDate("");
            setEndDate("");
            setDescription("");
            setRating("");
            setSelectedImage(null);

            toast.success("Trip created successfully!");
        } catch (error) {
            toast.error(
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
            const response = await axios.put(
                `http://localhost:5000/api/trips/${editingTrip._id}`,
                {
                    title,
                    destination,
                    startDate,
                    endDate,
                    description,
                    rating: Number(rating),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            let updatedTrip = response.data.trip;

            // Upload new photo if selected
            if (selectedImage) {
                const formData = new FormData();

                formData.append("image", selectedImage);

                const uploadResponse = await axios.post(
                    `http://localhost:5000/api/trips/${editingTrip._id}/upload`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                updatedTrip = uploadResponse.data.trip;
            }

            setTrips((currentTrips) =>
                currentTrips.map((trip) =>
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

            toast.success("Trip updated successfully!");
        } catch (error) {
            toast.error(
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
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTrips((currentTrips) =>
                currentTrips.filter(
                    (trip) => trip._id !== tripId
                )
            );

            toast.success("Trip deleted successfully!");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to delete trip"
            );
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

                        <p>
                            Loading your trips...
                        </p>
                    </div>
                </div>

                <Footer />
            </>
        );
    }

    // ==========================================
    // DASHBOARD UI
    // ==========================================
    return (
        <div>
            <Navbar username={user?.username} />

            <main className="page-container">

                {/* Header */}
                <section className="dashboard-header">
                    <div>
                        <h1>TripVault Dashboard</h1>

                        {user && (
                            <>
                                <h2>
                                    Welcome, {user.name}! 👋
                                </h2>

                                <p className="user-email">
                                    Email: {user.email}
                                </p>
                            </>
                        )}
                    </div>
                </section>

                {/* Create / Edit Trip */}
                <section className="trip-form-card card">

                    <h2>
                        {editingTrip
                            ? "Edit Trip"
                            : "Create a New Trip"}
                    </h2>

                    <form
                        onSubmit={
                            editingTrip
                                ? handleUpdateTrip
                                : handleCreateTrip
                        }
                    >

                        {/* Trip Title */}
                        <div className="form-group">
                            <label htmlFor="trip-title">
                                Trip Title
                            </label>

                            <input
                                id="trip-title"
                                type="text"
                                placeholder="Enter trip title"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                required
                            />
                        </div>

                        {/* Destination */}
                        <div className="form-group">
                            <label htmlFor="destination">
                                Destination
                            </label>

                            <input
                                id="destination"
                                type="text"
                                placeholder="Enter destination"
                                value={destination}
                                onChange={(e) =>
                                    setDestination(
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </div>

                        {/* Dates */}
                        <div className="form-row">

                            <div className="form-group">
                                <label htmlFor="start-date">
                                    Start Date
                                </label>

                                <input
                                    id="start-date"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="end-date">
                                    End Date
                                </label>

                                <input
                                    id="end-date"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) =>
                                        setEndDate(
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>

                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label htmlFor="description">
                                Description
                            </label>

                            <textarea
                                id="description"
                                placeholder="Enter trip description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                rows="4"
                            ></textarea>
                        </div>

                        {/* Rating */}
                        <div className="form-group">
                            <label htmlFor="rating">
                                Rating
                            </label>

                            <input
                                id="rating"
                                type="number"
                                min="1"
                                max="5"
                                placeholder="1 to 5"
                                value={rating}
                                onChange={(e) =>
                                    setRating(e.target.value)
                                }
                                required
                            />
                        </div>

                        {/* Photo */}
                        <div className="form-group">
                            <label htmlFor="trip-photo">
                                Trip Photo
                            </label>

                            <input
                                id="trip-photo"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) =>
                                    setSelectedImage(
                                        e.target.files[0] ||
                                            null
                                    )
                                }
                            />

                            {selectedImage && (
                                <div className="photo-preview">
                                    <p>
                                        <strong>
                                            Photo Preview:
                                        </strong>
                                    </p>

                                    <img
                                        src={URL.createObjectURL(
                                            selectedImage
                                        )}
                                        alt="Selected trip"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="form-actions">

                            <button type="submit">
                                {editingTrip
                                    ? "Update Trip"
                                    : "Create Trip"}
                            </button>

                            {editingTrip && (
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => {
                                        setEditingTrip(null);
                                        setTitle("");
                                        setDestination("");
                                        setStartDate("");
                                        setEndDate("");
                                        setDescription("");
                                        setRating("");
                                        setSelectedImage(null);
                                    }}
                                >
                                    Cancel Edit
                                </button>
                            )}

                        </div>

                    </form>
                </section>

                {/* My Trips */}
                <section className="trips-section">

                    <div className="section-heading">
                        <h2>My Trips</h2>

                        <span>
                            {trips.length}{" "}
                            {trips.length === 1
                                ? "Trip"
                                : "Trips"}
                        </span>
                    </div>

                    {trips.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                🧳
                            </div>

                            <h3>
                                You don't have any trips yet.
                            </h3>

                            <p>
                                Create your first trip and
                                start your journey!
                            </p>

                        </div>

                    ) : (

                        <div className="trip-grid">

                            {trips.map((trip) => (

                                <article
                                    className="trip-card"
                                    key={trip._id}
                                >

                                    {/* Cover Image */}
                                    {trip.coverImage ? (
                                        <img
                                            className="trip-card-image"
                                            src={trip.coverImage}
                                            alt={trip.title}
                                        />
                                    ) : (
                                        <div className="trip-card-placeholder">
                                            🗺️
                                        </div>
                                    )}

                                    <div className="trip-card-content">

                                        <h3>
                                            {trip.title}
                                        </h3>

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

                                        <div className="trip-card-actions">

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/trip/${trip._id}`
                                                    )
                                                }
                                            >
                                                View Details
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setEditingTrip(
                                                        trip
                                                    );

                                                    setTitle(
                                                        trip.title
                                                    );

                                                    setDestination(
                                                        trip.destination
                                                    );

                                                    setStartDate(
                                                        trip.startDate
                                                            ? trip.startDate.split(
                                                                  "T"
                                                              )[0]
                                                            : ""
                                                    );

                                                    setEndDate(
                                                        trip.endDate
                                                            ? trip.endDate.split(
                                                                  "T"
                                                              )[0]
                                                            : ""
                                                    );

                                                    setDescription(
                                                        trip.description ||
                                                            ""
                                                    );

                                                    setRating(
                                                        trip.rating ||
                                                            ""
                                                    );

                                                    setSelectedImage(
                                                        null
                                                    );

                                                    window.scrollTo({
                                                        top: 0,
                                                        behavior:
                                                            "smooth",
                                                    });
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="danger-button"
                                                onClick={() =>
                                                    handleDeleteTrip(
                                                        trip._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                </article>

                            ))}

                        </div>

                    )}

                </section>

            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default Dashboard;